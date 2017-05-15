'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var del = require('del');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');

////////////////////////////////////////////////////////////
// Task to arrange the main scripts
////////////////////////////////////////////////////////////
gulp.task('scripts', function() {
	gulp.src(['app/js/*.js', '!app/js/main.min.js', '!app/js/data.min.js', '!app/js/vendor.min.js'])
		.pipe(plumber())
		.pipe(rename({suffix:'.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'));
});

////////////////////////////////////////////////////////////
// Task to arrange the css
////////////////////////////////////////////////////////////
gulp.task('sass', function() {
	gulp.src('app/scss/style.scss')
		.pipe(plumber())
		.pipe(rename({suffix:'.min'}))
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(gulp.dest('app/css'));
});

////////////////////////////////////////////////////////////
// Build-Vendor JS task
////////////////////////////////////////////////////////////
gulp.task('build:vendorjs', function(cb) {
	gulp.src(['app/bower_components/jquery/dist/jquery.min.js', 'app/bower_components/lodash/dist/lodash.min.js'])
		.pipe(concat('vendor.min.js'))
		.pipe(gulp.dest('app/js/'));
	cb();
});

////////////////////////////////////////////////////////////
// Build-Vendor CSS task
////////////////////////////////////////////////////////////
gulp.task('build:vendorcss', function(cb) {
	gulp.src('app/bower_components/**/*.css')
		.pipe(concat('vendor.min.css'))
		.pipe(gulp.dest('app/css/'));
	cb();
});

////////////////////////////////////////////////////////////
// Watch tasks
////////////////////////////////////////////////////////////
gulp.task('watch', ['scripts', 'sass', 'build:vendorjs', 'build:vendorcss'], function() {
	gulp.watch('app/js/*.js', ['scripts']);
	gulp.watch('app/scss/*.scss', ['sass']);
});

////////////////////////////////////////////////////////////
// Default task
////////////////////////////////////////////////////////////
gulp.task('default', ['scripts', 'sass', 'build:vendorjs', 'build:vendorcss']);

////////////////////////////////////////////////////////////
// Build-Clear task
////////////////////////////////////////////////////////////
gulp.task('build:cleanfolder', function(cb) {
	del([
		'build/**'
	], cb);
	cb();
});

////////////////////////////////////////////////////////////
// Build-Copy task
////////////////////////////////////////////////////////////
gulp.task('build:copy', ['build:cleanfolder'], function() {
	return gulp.src('app/**/*')
		.pipe(plumber())
		.pipe(gulp.dest('build/'));
});

////////////////////////////////////////////////////////////
// Build-Remove task
////////////////////////////////////////////////////////////
gulp.task('build:remove', ['build:copy'], function(cb) {
	del([
		'build/scss/',
		'build/bower_components/',
		'build/js/!(*.min.js)',
		'build/bower.json'
	], {force: true}, cb)
	cb();
});

////////////////////////////////////////////////////////////
// Build task
////////////////////////////////////////////////////////////
gulp.task('build', ['build:copy', 'build:remove']);