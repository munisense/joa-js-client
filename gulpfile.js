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
    yuidoc = require('gulp-yuidoc'),
    jasmine = require('gulp-jasmine'),
    notify = require('gulp-notify');

var paths = {};
paths.src = './src/*.js';
paths.dist = './dist';
paths.doc = './doc';
paths.test = './test/Joa.spec.js';
paths.example = './examples';

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

gulp.task('dist', ['test', 'min', 'jshint'], function() {
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

gulp.task('test', function() {
    gulp.src(paths.test)
        // gulp-jasmine works on filepaths so you can't have any plugins before it 
        .pipe(jasmine())
        .on('error', notify.onError({
            title: 'Jasmine Test Failed',
            message: 'One or more tests failed, see the cli for details.'
        }));
});

gulp.task('build', ['dist', 'doc']);

gulp.task('watch', ['build'], function () {
    gulp.watch([paths.src, paths.test], ['build']);
});