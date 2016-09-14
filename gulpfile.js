/* File: gulpfile.js */

// grab our gulp packages
var del = require('del'),
    info = require('./package.json'),
    gulp  = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    yuidoc = require('gulp-yuidoc');

var paths = {};
paths.src = './src/*.js';
paths.dist = './dist';
paths.doc = './doc';

//initializer
gulp.task('default', ['watch']);

gulp.task('jshint', function () {
    return gulp.src(paths.src)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('min', function() {
  gulp.src(paths.src)
      .pipe(uglify())
      .pipe(rename({
        suffix: '-' + info.version + '.min'
      }))
      .pipe(gulp.dest(paths.dist));
});

gulp.task('dist', ['min', 'jshint'], function() {
    gulp.src(paths.src)
        .pipe(rename({
            basename: 'Joa-',
            suffix: info.version
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('doc', function() {
    gulp.src(paths.src)
        .pipe(yuidoc())
        .pipe(gulp.dest(paths.doc));
});

gulp.task('build', ['dist', 'doc']);

gulp.task('watch', ['build'], function () {
    gulp.watch(paths.src, ['build']);
});