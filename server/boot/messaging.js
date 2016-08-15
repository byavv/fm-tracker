const rabbit = require('rabbot')
    , debug = require("debug")("ms:tracker")
    , logger = require("../lib/logger");

module.exports = function (app) {
    var Track = app.models.track;

    const handle = () => {
        rabbit.handle('tracker.track', (message) => {
            debug("TRACK CAR", message.body)
            Track.create(message.body, (err, track) => {
                err ? message.reject() : message.ack();
            })
        });
        rabbit.handle('tracker.update', (message) => {
            debug("UPDATE TRACKING", message.body)
            if (message.body && message.body.carId)
                Track.findOne({ where: { carId: message.body.carId } }, (err, track) => {
                    if (err || !track) {
                        message.reject();
                    } else {
                        track.updateAttributes({
                            image: message.body.image,
                            description: message.body.description ? message.body.description : track.description
                        }, (err, tr) => {
                            err ? message.reject(err) : message.ack();
                        })
                    }
                })
        });
        rabbit.handle('tracker.delete', (message) => {
            debug("DELETE FROM TRACKING", message.body)
            if (message.body && message.body.carId)
                Track.destroyAll({ carId: message.body.carId }, (err, info) => {
                    err ? message.reject(err) : message.ack();
                })
        });

        app.rabbit = rabbit;
        logger.info(`Service ${app.get('ms_name')} joined rabbit network`);
    }

    app.once('started', () => {
        require('../lib/topology')(rabbit, {
            name: app.get('ms_name'),
            host: app.get("rabbit_host")
        })
            .then(handle)
            .catch((err) => {
                logger.error(`Error when joining rabbit network`, err);
                throw err;
            });
    });
}
