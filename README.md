# gulp-asar

[![build status](http://img.shields.io/travis/bwin/gulp-asar/master.svg?style=flat-square)](https://travis-ci.org/bwin/gulp-asar)
[![dependencies](http://img.shields.io/david/bwin/gulp-asar.svg?style=flat-square)](https://david-dm.org/bwin/gulp-asar)
[![npm version](http://img.shields.io/npm/v/gulp-asar.svg?style=flat-square)](https://npmjs.org/package/gulp-asar)

> Gulp plugin to generate atom-shell asar packages.

## Example gulpfile
```js
var gulp = require('gulp');
var gulpAsar = require('gulp-asar');

gulp.task('default', function() {
  gulp.src('some/path/**/*', { base: 'some/path/' })
  .pipe(gulpAsar('archive.asar'))
  .pipe(gulp.dest('dist'));
});
```

Parts of code based on:
* [original `gulp-asar`](https://github.com/bwin/gulp-asar)
  by Benjamin Winkler
  and [contributors](https://github.com/bwin/gulp-asar/graphs/contributors)
* [`asar`](https://github.com/electron/asar)
  by GitHub, Inc.
  and [contributors](https://github.com/electron/asar/graphs/contributors)
* [`gulp-tar`](https://github.com/sindresorhus/gulp-tar)
  by Sindre Sorhus
  and [contributors](https://github.com/sindresorhus/gulp-tar/graphs/contributors)

(everything licensed MIT)
