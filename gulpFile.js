const gulp = require('gulp');
const gutil = require('gulp-util');
const pug = require('gulp-pug');
const uglify = require('gulp-uglify');
const stylus = require('gulp-stylus');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const merge = require('utils-merge');
const rename = require('gulp-rename');
const chalk = require('chalk');

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

// gulp.task('js', function () {
//	// set up the browserify instance on a task basis
//		var b = browserify({
//				entries: './src/index.js',
//				transform: ['babelify'],
//				debug: true

//	});

//	return b.bundle()
//		.pipe(source('app.js'))
//		.pipe(buffer())
//		.pipe(sourcemaps.init({loadMaps: true}))
//				// Add transformation tasks to the pipeline here.
//				.pipe(uglify())
//				.on('error', gutil.log)
//		.pipe(sourcemaps.write('./'))
//		.pipe(gulp.dest('./dist/js/'));
// });

function map_error(err) {
	if (err.fileName) {
		// regular error
		gutil.log(chalk.red(err.name)
			+ ': '
			+ chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
			+ ': '
			+ 'Line '
			+ chalk.magenta(err.lineNumber)
			+ ' & '
			+ 'Column '
			+ chalk.magenta(err.columnNumber || err.column)
			+ ': '
							+ chalk.blue(err.description));
	} else {
		// browserify error..
		gutil.log(chalk.red(err.name)
			+ ': '
							+ chalk.yellow(err.message));
	}

		// this.end();
}
/* */

gulp.task('watchify', function () {
		var args = merge(watchify.args, { debug: true });
		var bundler = watchify(browserify('./src/index.js', args)).transform(babelify, { /* opts */ });
		bundle_js(bundler);

	bundler.on('update', function () {
			bundle_js(bundler);
	})
})

function bundle_js(bundler) {
	return bundler.bundle()
		.on('error', map_error)
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(gulp.dest('app/dist'))
		.pipe(rename('app.min.js'))
		.pipe(sourcemaps.init({ loadMaps: true }))
			// capture sourcemaps from transforms
			.pipe(uglify())
		.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest('app/dist'));
}

// Without watchify
gulp.task('js', function () {
		var bundler = browserify('./src/index.js', { debug: true }).transform(babelify, {presets: ["es2015"]});

		return bundle_js(bundler);
})

// Without sourcemaps
gulp.task('browserify-production', function () {
		var bundler = browserify('./index.js/app.js').transform(babelify, {/* options */ });

	return bundler.bundle()
		.on('error', map_error)
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(rename('app.min.js'))
		.pipe(uglify())
				.pipe(gulp.dest('app/dist'));
});

gulp.task('default', function defaultTask() {
		gulp.watch(['./src/templates/*.pug'], ['template']);
		gulp.watch(['./src/styles/*.styl'], ['style']);
		gulp.watch(['./src/index.js'], ['js']);
});
