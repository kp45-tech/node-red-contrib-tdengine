module.exports = function(RED) {
    const taos = require('td2.0-connector');

    function TDEngineNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        doConnect(config);

        node.on('input', function(msg) {
            console.log('Start to execute SQL ' + msg.payload);
            var query = node.cursor.query('show databases;');
            var promise = query.execute();
            promise.then(function(result) {
                result.pretty();
            });
        });

        node.on('close', function name(msg) {
            node.conn.close()
        })

        function doConnect(config) {
            var host = config.host ? config.host : 'localhost';
            var port = config.port ? config.port : 6030;
            var username = this.credentials.username ? this.credentials.username : 'root';
            var password = this.credentials.password ? this.credentials.password : 'taosdata';

            var conn = taos.connect({ host: host, user: username, password: password, port: port });
            var cursor = conn.cursor(); // Initializing a new cursor
            node.conn = conn;
            node.cursor = cursor;
            testConnection();
            console.log('Connect to TDEngine Database by ' + host + ':' + port + ' with credentials ' + username + '/' + password);
        }

        function testConnection() {
            var query = node.cursor.query('show databases;');
            var promise = query.execute();
            promise.then(function(result) {
                result.pretty();
            });
        }
    }
    RED.nodes.registerType("tdengine", TDEngineNode, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    });
}