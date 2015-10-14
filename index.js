var Repository = require('nodegit').Repository;
var Diff = require('nodegit').Diff;
var invert = require('lodash.invert');
var execSync = require('execSync'); // TODO: use child_process.execSync once we get to node 4
module.exports = function (options) {
    this._options = options || {};
};
module.exports.prototype = {
    apply: function (kesselrun) {
        kesselrun.plugin('reduce-unglobbed-jasmine-specs', function (specFiles) {
            var specFileMap = invert(specFiles);
            return execSync.exec('git diff --name-only', {
                cwd: this._options.cwd || process.cwd(),
                encoding: 'utf8'
            }).stdout.trim().split("\n").filter(function (newFile) {
                return !!specFileMap[newFile];
            });
        }.bind(this));
    }
};
