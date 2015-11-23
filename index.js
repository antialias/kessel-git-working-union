var path = require('path');
var invert = require('lodash.invert');
var assign = require('lodash.assign');
var childProcess = require('child_process');
module.exports = function (options) {
    this._options = options || {};
};
module.exports.prototype = {
    apply: function (kesselrun) {
        kesselrun.plugin('reduce-unglobbed-jasmine-specs', function (specFiles) {
            var pathFromRoot = this._pathFromGitRoot();
            var oldCwd = process.cwd();
            var dirtySpecFiles;
            process.chdir(this._options.cwd || process.cwd());
            var dirtyFileMap = invert(childProcess.execSync('git diff --name-only').toString().trim().split("\n"));
            dirtySpecFiles = specFiles.filter(function (specFile) {
                return !!dirtyFileMap[path.join(pathFromRoot, kesselrun.jasmineConfig.spec_dir, specFile)];
            }.bind(this));
            process.chdir(oldCwd);
            return dirtySpecFiles;
        }.bind(this));
    },
    _pathFromGitRoot: function () {
        return path.relative(childProcess.execSync('git rev-parse --show-toplevel').toString().trim(), process.cwd());
    }
};
