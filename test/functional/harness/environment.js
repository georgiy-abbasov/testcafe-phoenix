var site           = require('../site');
var createTestCafe = require('../../../lib');

var Environment = module.exports = function (tcPort1, tcPort2, sitePort1, sitePort2) {
    this.testCafe  = null;
    this.tcPort1   = tcPort1;
    this.tcPort2   = tcPort2;
    this.sitePort1 = sitePort1;
    this.sitePort2 = sitePort2;
};

Environment.prototype.start = function () {
    var environment = this;

    site.create(environment.sitePort1, environment.sitePort2, './test/functional/');

    return createTestCafe('localhost', environment.tcPort1, environment.tcPort2)
        .then(function (tc) {
            environment.testCafe = tc;

            return tc;
        });
};

Environment.prototype.tearDown = function () {
    site.destroy();
    this.testCafe.close();
};
