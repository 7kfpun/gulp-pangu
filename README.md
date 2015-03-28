# gulp-pangu [![Build Status](https://travis-ci.org/7kfpun/gulp-pangu.svg)](https://travis-ci.org/7kfpun/gulp-pangu)

gulp-pangu is a [Gulp](https://github.com/gulpjs/gulp) extension to add space between Chinese and English characters to file(s) in the pipeline.

The algorithm is from [paranoid-auto-spacing](https://github.com/vinta/paranoid-auto-spacing)

```javascript
var pangu = require('gulp-pangu');
```

## Install

```bash
$ npm install --save-dev gulp-pangu
```

## Usage

```javascript
// include the required packages.
var gulp = require('gulp');
var pangu = require('gulp-pangu');

gulp.task('pangu', function() {
  gulp.src(['./test.html'])
  .pipe(pangu())
  .pipe(gulp.dest('./dist/'));
});
```

## License

Released under the [MIT License](http://opensource.org/licenses/MIT).
