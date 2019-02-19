var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


gulp.task('CrudBase', function () {
	gulp.src('../app/webroot/js/CrudBase/*.js')
	.pipe(concat('CrudBase.min.js'))
//	.pipe(babel({
//		presets: ['@babel/env']
//	}))
//	.pipe(uglify())
	.pipe(gulp.dest('../app/webroot/js/CrudBase/dist'));
});

gulp.task('wp_post', function () {
	gulp.src('../app/webroot/js/WpPost/*.js')
	.pipe(concat('one.js'))
	.pipe(babel({
		presets: ['@babel/env']
	}))
	.pipe(uglify())
	.pipe(gulp.dest('../app/webroot/js/WpPost/dist'));
});