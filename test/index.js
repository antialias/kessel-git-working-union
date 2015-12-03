var sinon = require('sinon');
var WorkingUnion = require('proxyquire')('../', {
    'sync-exec': function () {
        return ['fizz', 'foo', 'bar'].join("\n");
    }
});
var assert = require('assert');
describe('kessel git working union', function () {
    it('should union the set of specfiles with the set of unstaged files in gits working directory', sinon.test(function () {
        this.stub(WorkingUnion.prototype, '_pathFromGitRoot', function () {return ''});
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
