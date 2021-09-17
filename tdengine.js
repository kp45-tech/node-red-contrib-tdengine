module.exports = function(RED) {
    const taos = require('td2.0-connector');

    function TDEngineNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        doConnect(config);
        console.log('Connect to TDEngine Database by ' + config.host + ':' + config.port + ' with credentials ' + config.user + '/' + config.password);

        node.on('input', function(msg) {
            console.log('Start to execute SQL ' + msg.payload);
        });

        node.on('close', function name(msg) {
            node.conn.close()
        })

        function doConnect(config) {
            var conn = taos.connect({ host: config.host || 'localhost', user: config.user || 'root', password: config.password || "taosdata", port: config.port || 6030 })
            var cursor = conn.cursor(); // Initializing a new cursor
            node.conn = conn;
            node.cursor = cursor;

        }
    }
    RED.nodes.registerType("tdengine", TDEngineNode, {
        credentials: {
            user: { type: "text" },
            password: { type: "password" }
        }
    });
}