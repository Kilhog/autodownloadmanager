'use strict';

var webpack = require('webpack-stream');
var gulp = require('gulp');

module.exports = function(src, dest) {
  return gulp.src(src)
    .pipe(webpack(require('../../webpack.config.js')))
    .pipe(gulp.dest(dest));
};
