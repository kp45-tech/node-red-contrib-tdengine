module.exports = function (RED) {
  "use strict";
  const fetch = require('node-fetch');

  function TaosConfig(n) {
    RED.nodes.createNode(this, n);
    this.host = n.host;
    this.port = n.port;
    this.username = n.username;
    this.password = n.password;
  }
  RED.nodes.registerType("taos-config", TaosConfig);

  function TaosQuery(n) {
    RED.nodes.createNode(this, n);
    this.server = RED.nodes.getNode(n.server);
    this.database = n.database;
    this.query = n.query;
    var node = this;

    node.on("close", function (done) {
      node.status({});
      client = null;
      done();
    });

    node.on("input", function (msg, send, done) {
      let topic = undefined;
      send = send || function () { node.send.apply(node, arguments) }
      done = done || function (err) { if (err) node.error(err, msg); }

      let sql = msg.payload;

      if (!msg.payload || msg.payload == "") {
        throw new Error("Execute SQL must be set.");
      }

      try {
        let response = query(this.server, sql);
        msg.payload = response;
        send(msg);
        done();
      } catch (error) {
        done(error);
      }

    });
  }
  RED.nodes.registerType("taos-query", TaosQuery);

  async function query(server, sql) {
    try {
      let response = await fetch(this.generateUrl(server), {
        method: 'POST',
        body: sql,
        headers: { 'Authorization': this.token(server) }
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

  function generateUrl(server) {
    return "http://" + server.host + ":" + server.port + server.path;
  }

  function token(server) {
    return 'Basic ' + Buffer.from(server.username + ":" + server.password).toString('base64')
  }
};
