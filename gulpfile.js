/**
 * Dependencies.
 */
var gulp = require('gulp'),
	jscs = require('gulp-jscs'),
	stylish = require('gulp-jscs-stylish'),
	jshint = require('gulp-jshint'),
	filelog = require('gulp-filelog');


gulp.task('lint', function () {
	var src = ['gulpfile.js', 'index.js', 'lib/**/*.js', 'test/**/*.js'];

	return gulp.src(src)
		.pipe(filelog('lint'))
		.pipe(jshint('.jshintrc')) // enforce good practics
		.pipe(jscs('.jscsrc')) // enforce style guide
		.pipe(stylish.combineWithHintResults())
		.pipe(jshint.reporter('jshint-stylish', {verbose: true}))
		.pipe(jshint.reporter('fail'));
});


gulp.task('watch', function () {
	gulp.watch(['index.js', 'lib/**/*.js'], ['default']);
});


gulp.task('default', gulp.series('lint'));
