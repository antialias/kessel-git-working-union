var Repository = require('nodegit').Repository;
var Diff = require('nodegit').Diff;
var Promise = require('bluebird');
var sinon = require('sinon');
var WorkingUnion = require('../');
var assert = require('assert');
describe('kessel git working union', function () {
    it('should union the set of specfiles with the set of unstaged files in gits working directory', sinon.test(function (done) {
        this.stub(Repository, 'open', function () {
            return Promise.all([]);
        });
        this.stub(Diff, 'indexToWorkdir', function () {
            return {
                patches: function () {
                    return [
                        'foo',
                        'bar',
                        'fizz'
                    ].map(function (path) {
                        return {
                            newFile: function () {return path;}
                        };
                    });
                }
            };
        });
        new WorkingUnion().apply({
            plugin: function (hook, cb) {
                assert.equal(hook, 'reduce-unglobbed-jasmine-specs');
                cb(['foo', 'baz', 'bar']).then(function (union) {
                    assert.deepEqual(union, ['foo', 'bar']);
                    done();
                }).then(null, function (err) {
                    done(err);
                });
            }
        });
    }));
});
