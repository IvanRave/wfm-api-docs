var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jshintReporter = require('jshint-stylish');

var filePath = {
	jshintBase : {
		src : './*.js'
	},
	jshintApp : {
		src : ['public/js/**/*.js']
	},
	jshintTest : {
		src : 'test/**/*.js'
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
