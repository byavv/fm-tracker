"use strtict";
const boot = require('loopback-boot')
    , http = require('http')
    , loopback = require('loopback')
    , app = module.exports = loopback()
    , logger = require("./lib/logger")
    , debug = require('debug')('ms:tracker');

const http_port = process.env.HTTP_PORT || 3006,
    etcd_host = process.env.ETCD_HOST || "localhost",
    rabbit_host = process.env.BROCKER_HOST || "localhost",
    mongo_host = process.env.DBSOURCE_HOST || "localhost";


if (!process.env.HTTP_HOST) { logger.warn('HTTP_HOST environment is not set, try default (localhost)'); }
if (!process.env.ETCD_HOST) { logger.warn('ETCD_HOST environment is not set, try default (localhost)'); }
if (!process.env.BROCKER_HOST) { logger.warn('BROCKER_HOST environment is not set, try default (localhost)'); }

//app.set("mongo_host", mongo_host);
app.set("http_port", http_port);
app.set("etcd_host", etcd_host);
app.set("rabbit_host", rabbit_host);
app.set("ms_name", 'tracker');

boot(app, __dirname, (err) => {
    if (err) throw err;
    app.start = function () {
        const httpServer = http.createServer(app).listen(http_port, () => {
            app.emit('started');
            app.close = (done) => {
                app.removeAllListeners('started');
                app.removeAllListeners('loaded');
                if (app.registry) {
                    debug('Leave etcd ...');
                    app.registry.leave(app.get('ms_name'));
                }
                if (app.rabbit) {
                    debug('Close rabbit...');
                    app.rabbit.closeAll();
                }
                httpServer.close(done);
            };
        });
    };

    process.on('SIGINT', () => {
        debug('Exiting...');
        app.close((err) => {            
            process.exit(err ? -1 : 0)
        });
    });

    if (require.main === module)
        app.start();
    app.loaded = true;
    app.emit('loaded');
});
