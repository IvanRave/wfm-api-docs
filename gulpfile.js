var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jshintReporter = require('jshint-stylish');
var ghPages = require('gulp-gh-pages');
var del = require('del');
var rename = require('gulp-rename');

var filePath = {
	jshintBase : {
		src : './*.js'
	},
	jshintApp : {
		src : ['public/js/**/*.js']
	},
	jshintTest : {
		src : 'test/**/*.js'
	},
	app : {
		src : './public/',
		dst : './dst/',
		dev : './dev/'
	}
};

gulp.task('default', function () {
	gulp.src(filePath.jshintBase.src)
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter(jshintReporter));

	gulp.src(filePath.jshintApp.src)
	.pipe(jshint('./public/js/.jshintrc'))
	.pipe(jshint.reporter(jshintReporter));
});

gulp.task('test', function () {
	gulp.src(filePath.jshintTest.src)
	.pipe(jshint('./test/.jshintrc'))
	.pipe(jshint.reporter(jshintReporter));
});

/** Clean destination folder */
gulp.task('clean', function (cb) {
	del([filePath.app.dst], cb);
});

// Copy all static files
gulp.task('copySource', ['clean'], function () {
	return gulp.src(filePath.app.src + '**/*')
	.pipe(gulp.dest(filePath.app.dst));
});

gulp.task('renameConfig', ['clean', 'copySource'], function () {
	return gulp.src(filePath.app.dst + 'js/cnst-helper-release.js')
	.pipe(rename('js/cnst-helper.js'))
	.pipe(gulp.dest(filePath.app.dst));
});

// Auto clean and copy all files
gulp.task('build', ['renameConfig']);

// https://github.com/rowoot/gulp-gh-pages
gulp.task('gh-pages', function () {
	gulp.src(filePath.app.dst + "**/*").pipe(ghPages());
});
