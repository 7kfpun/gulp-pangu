/* jshint node: true */
'use strict';

var gulp = require('gulp');
var pangu = require('../');

gulp.task('pangu', function() {
  gulp.src(['./test.html'])
  .pipe(pangu())
  .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['pangu']);
