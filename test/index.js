var execSync = require('child_process');
var sinon = require('sinon');
var WorkingUnion = require('../');
var assert = require('assert');
describe('kessel git working union', function () {
    it('should union the set of specfiles with the set of unstaged files in gits working directory', sinon.test(function () {
        this.stub(WorkingUnion.prototype, '_pathFromGitRoot', function () {return ''});
        this.stub(execSync, 'execSync', function () {
            return ['fizz', 'foo', 'bar'].join("\n");
        });
        new WorkingUnion().apply({
            jasmineConfig: {
                spec_dir: ''
            },
            plugin: function (hook, cb) {
                assert.equal(hook, 'reduce-unglobbed-jasmine-specs');
                assert.deepEqual(
                    cb(['foo', 'baz', 'bar']),
                    ['foo', 'bar']
                );
            }
        });
    }));
});
