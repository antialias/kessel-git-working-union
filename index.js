var Repository = require('nodegit').Repository;
var Diff = require('nodegit').Diff;
var invert = require('lodash.invert');
module.exports = function (options) {
    this._options = options || {};
};
module.exports.prototype = {
    apply: function (kesselrun) {
        kesselrun.plugin('reduce-unglobbed-jasmine-specs', function (specFiles) {
            return Repository.open(this._options.path || process.cwd()).then(function (repository) {
                return Diff.indexToWorkdir(repository, null, {flags: Diff.FORMAT.NAME_ONLY});
            }).then(function (diff) {
                return diff.patches();
            }).then(function (patches) {
                var specFileMap = invert(specFiles);
                return patches.map(function (patch) {
                    return patch.newFile().path();
                }).filter(function (newFile) {
                    return !!specFileMap[newFile];
                });
            });
        }.bind(this));
    }
};
