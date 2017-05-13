'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var del = require('del');
var plumber = require('gulp-plumber');

////////////////////////////////////////////////////////////
// Task to arrange the main scripts
////////////////////////////////////////////////////////////
gulp.task('scripts', function() {
	gulp.src(['app/js/*.js', '!app/js/main.min.js', '!app/js/data.min.js'])
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
// Watch tasks
////////////////////////////////////////////////////////////
gulp.task('watch', function() {
	gulp.watch('app/js/*.js', ['scripts']);
	gulp.watch('app/scss/*.scss', ['sass']);
});

////////////////////////////////////////////////////////////
// Default task
////////////////////////////////////////////////////////////
gulp.task('default', ['scripts', 'sass', 'watch']);