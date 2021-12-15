var helper = require("node-red-node-test-helper");
var tdengineNode = require("../tdengine.js");
var config = {
    host: "hwsaas1.taosdata.com",
    port: 6060,
    username: "acct_hw47053787",
    password: "acct_hw47053787",
    path: "/rest/sqlt/"
};

describe('TDEngine Node', function () {

    afterEach(function () {
        helper.unload();
    });

    it('should be loaded', function (done) {
        var flow = [{ id: "n1", type: "tdengine", name: "test name" }];
        helper.load(tdengineNode, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', 'test name');
            n1.query("show databases;");
            done();
        });
    });
});