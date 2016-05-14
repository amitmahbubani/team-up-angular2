'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'), 
    tsc = require('gulp-typescript'),
    webserver = require('gulp-webserver');

var paths = {
	sass_src: 'app/assets/sass/**/*.scss',
	css_dest: 'app/assets/css/',
	tsc_src: 'app/**/*.ts',
	tsc_dest: 'compiled/',
	
};

var tsConfig = require('./tsconfig.json');
var tsOptions = tsc.createProject(tsConfig.compilerOptions);


gulp.task('styles', function() {
	return gulp.src(paths.sass_src)
	.pipe(sass({
		outputStyle: 'compressed'
	}).on('error', sass.logError))
	.pipe(gulp.dest(paths.css_dest));
});

gulp.task('scripts', function() {
	return gulp.src(paths.tsc_src)
		.pipe(tsc(tsOptions))
		.pipe(gulp.dest(paths.tsc_dest))
});

gulp.task('runserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: false,
      directoryListing: false,
      open: true
    }));
});

gulp.task('watch', function() {
	gulp.watch(paths.sass_src, ['styles']);
	gulp.watch(paths.tsc_src, ['scripts']);
});

gulp.task('default', ['scripts', 'styles', 'watch', 'runserver']);
