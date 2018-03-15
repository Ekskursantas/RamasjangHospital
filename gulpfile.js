'use strict';
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var ts = require('gulp-typescript');
var browserSync = require('browser-sync');
var del = require('del');
var runSequence = require('run-sequence');
var beeper = require('beeper');

var plugins = gulpLoadPlugins();
var reload = browserSync.reload;

// Hospital variables
var tsProject = ts.createProject('tsconfig.json');
var paths = {
  npm: './node_modules/',
  tsSource: 'src/**/*.ts',
  tsOutput: 'dist_folder/scripts/',
  js: 'dist_folder/scripts/',
  vendor: 'dist_folder/scripts/vendor/'
};

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.tsSource, ["compile"]);
});

// Default Task
gulp.task('default', ['watch'], function() {
    gulp.start('vendor', 'compile');
});

gulp.task('compile', function compileHospital() {
  var tsResult = tsProject.src() // instead of gulp.src(...)
    .pipe(tsProject())
    .on('error', handleErrors);
    
  return tsResult
    .pipe(plugins.uglify())
    .pipe(gulp.dest(paths.tsOutput));
});

gulp.task('vendor', function vendorHospital() {
  // Order of files being compiled.
  // Order is important here.
  var tsResult = gulp.src([
    'js/vendor/modernizr-custom.js',
    'js/vendor/jquery.xdomainrequest.min.js',
    // 'js/vendor/jquery-3.1.1.slim.min.js',
    // 'js/vendor/pixi.min.js',
    'js/vendor/preloadjs-0.6.2.min.js',
    'js/vendor/soundjs-0.6.2.min.js',
    'js/vendor/dragonBones.min.js',
    'js/vendor/dragonBonesPixi.min.js',
    'js/vendor/pixi-svg-graphics.js',
    // 'js/vendor/ts-bytearray.js',
    'js/vendor/TweenMax.min.js'

  ])
  .pipe(plugins.concat('vendor.min.js'));

  return tsResult
    .pipe(plugins.uglify())
    .pipe(gulp.dest(paths.vendor))
    .on('error', handleErrors);
});

gulp.task('clean', function cleanHospital() {
  return del.sync(paths.tsOutput + '**/*.js');
});

gulp.task('dist_folder', function distHospital(callback) {
  // https://www.npmjs.com/package/run-sequence
  // This is intended to be a temporary solution until the release of gulp 4.0 which has support
  // for defining task dependencies in series or in parallel.
  // Be aware that this solution is a hack, and may stop working with a future update to gulp.
  runSequence('clean', 'vendor', 'compile', callback);
});

function handleErrors(err) {
  console.log('Error: ' + err.toString());
}
