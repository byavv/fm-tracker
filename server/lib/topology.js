module.exports = function (rabbit, options) {

    return rabbit.configure({
        // arguments used to establish a connection to a broker
        connection: {
            user: "guest",
            pass: "guest",
            server: [options.host],
           	port: 5672,
            vhost: "%2f",
            timeout: 1000,
            failAfter: 30,
            retryLimit: 400
        },
        // setup all exchanges, process might use
        exchanges: [
            { name: 'ex.cars', type: 'direct', persistent: true, autoDelete: true },
            { name: 'ex.image', type: 'direct', persistent: true, autoDelete: true },
            { name: 'ex.tracker', type: 'direct', persistent: true, autoDelete: true },
            { name: 'ex.profile', type: 'direct', persistent: true, autoDelete: true }
        ],
        // setup the queues, only subscribing to the one this service
        // will consume messages from
        queues: [
            { name: `tracker.q.messages`, subscribe: true, durable: true, autoDelete: true, },
        ],
        // binds exchanges and queues to one another
        bindings: [
            { exchange: 'ex.tracker', target: 'tracker.q.messages', keys: ['messages'] },
        ]
    });
};
