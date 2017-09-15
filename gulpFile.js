const gulp = require('gulp');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');

gulp.task('template', function buildHTML() {
	return gulp.src('./src/templates/index.pug')
				.pipe(pug())
				.pipe(gulp.dest('./out'));
});

gulp.task('style', function styleTask() {
	return gulp.src('./src/styles/main.styl')
		.pipe(stylus())
		.pipe(gulp.dest('./out'));
});

gulp.task('default', function defaultTask() {
		gulp.watch(['./src/templates/*.pug'], ['template']);
		gulp.watch(['./src/styles/*.styl'], ['style']);
});
