module.exports = function (RED) {
  "use strict";
  const axios = require('axios');

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
    let url = this.generateUrl(server);
    axios.post(url, sql, {
      headers: { 'Authorization': this.token(server) }
    }).then(function (response) {
      console.log('Get http response from taos : ' + response.data.data);
      return response.data.data;
    }).catch(function (error) {
      console.log("Request Failed " + e);
      throw new Error(response.desc);
    });
  }

  function generateUrl(server) {
    return "http://" + server.host + ":" + server.port + '/rest/sql';
  }

  function token(server) {
    return 'Basic ' + Buffer.from(server.username + ":" + server.password).toString('base64')
  }
};
