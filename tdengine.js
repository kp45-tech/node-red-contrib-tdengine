module.exports = function (RED) {
    const fetch = require('node-fetch');

    function TDEngineNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function (msg) {
            console.log('Start to execute SQL ' + msg.payload);
            var promise = query(msg.payload);
            promise.then(function (result) {
                result.pretty();
            });
        });

        node.on('close', function name(msg) {
            console.log("TDEngine node closed.");
        })

        async function query(sql) {
            try {
                let response = await fetch(this.generateUrl(), {
                    method: 'POST',
                    body: sql,
                    headers: { 'Authorization': this.token() }
                })
                if (response.status == 'succ') {
                    console.log("Get http response from taos : " + response.json());
                    return await response.json()
                } else {
                    throw new Error(response.desc)
                }
            } catch (e) {
                console.log("Request Failed " + e)
            }
        }

        function generateUrl() {
            return "http://" + this.config.host + ":" + this.config.port + this.config.path;
        }

        function token() {
            return 'Basic ' + Buffer.from(this.config.username + ":" + this.config.password).toString('base64')
        }

    }
    RED.nodes.registerType("tdengine", TDEngineNode, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    });
}