/* global describe, it */
'use strict';

var pangu = require('../');
var fs = require('fs');
var gutil = require('gulp-util');
var should = require('should');
require('mocha');

var sample = fs.readFileSync('test/test.html');
var expect = fs.readFileSync('test/test.build.html', 'utf8');

describe('gulp-pangu', function() {

  describe('pangu()', function() {
    it('should have pangu()', function () {
      pangu();
    });

    it('should insert space collectly', function(done) {
      var stream = pangu();

      var fakeFile = new gutil.File({
        contents: sample
      });
      // gutil.log(fakeFile.contents.toString('utf-8'));

      stream.once('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);
        // gutil.log(newFile.contents.toString('utf-8'));
        String(newFile.contents).should.equal(expect);
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });
  });

});
