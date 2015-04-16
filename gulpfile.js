var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var minifyCSS = require('gulp-minify-css');
var shell = require('gulp-shell')
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');

gulp.task('clean-min-css', function(){
	return gulp.src('dist/styles/bundle.css', {read: false}).pipe(clean());
});

gulp.task('min-css', ['clean-min-css'],function() {
  return gulp.src([
  	'./css/styles.css', 
  	'./node_modules/bootstrap/dist/css/bootstrap.min.css', 
  	'./node_modules/font-awesome/css/font-awesome.min.css', 
  	'./lib/alexcrack-angular-ui-notification-438f94e/dist/angular-ui-notification.min.css'])
  .pipe(concatCss('styles/bundle.css'))
  .pipe(minifyCSS({keepBreaks:false,keepSpecialComments:0}))
  .pipe(gulp.dest('dist/'));
});

gulp.task('move-css', ['clean-min-css'],function() {
  return gulp.src([
  	'./css/styles.css', 
  	'./node_modules/bootstrap/dist/css/bootstrap.min.css', 
  	'./node_modules/font-awesome/css/font-awesome.min.css', 
  	'./lib/alexcrack-angular-ui-notification-438f94e/dist/angular-ui-notification.min.css'])
  .pipe(concatCss('styles/bundle.css'))
  .pipe(gulp.dest('dist/'));
});

gulp.task('clean-move-jquery', function(){
	return gulp.src('dist/js/jquery.min.js', {read: false}).pipe(clean());
});

gulp.task('move-jquery',['clean-move-jquery'], function(){
	return gulp.src(['./node_modules/jquery/dist/jquery.min.js'])
	.pipe(gulp.dest('dist/js/'));
});

gulp.task('clean-min-js', function(){
	return gulp.src('dist/js/script.min.js', {read: false}).pipe(clean());
});

gulp.task('min-js',['clean-min-js','move-jquery','min-api'], function(){
	return gulp.src([
		'./node_modules/jquery/dist/jquery.min.js',
		'./node_modules/angular/angular.min.js',
		'./node_modules/angular-ui-router/release/angular-ui-router.min.js',
		'./node_modules/angular-bootstrap/dist/ui-bootstrap-tpls.min.js',
		'./lib/alexcrack-angular-ui-notification-438f94e/dist/angular-ui-notification.min.js',
		'./js/script.js'])
	.pipe(concat('js/script.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/'));
});

gulp.task('move-js',['clean-min-js','move-jquery','move-api'], function(){
	return gulp.src([
		'./node_modules/jquery/dist/jquery.min.js',
		'./node_modules/angular/angular.min.js',
		'./node_modules/angular-ui-router/release/angular-ui-router.min.js',
		'./node_modules/angular-bootstrap/dist/ui-bootstrap-tpls.min.js',
		'./lib/alexcrack-angular-ui-notification-438f94e/dist/angular-ui-notification.min.js',
		'./js/script.js'])
	.pipe(concat('js/script.min.js'))
	.pipe(gulp.dest('dist/'));
});

gulp.task('min-api', function(){
	return gulp.src([
		'./js/api-*'])
	.pipe(uglify())
	.pipe(gulp.dest('dist/js/'));
})

gulp.task('move-api', function(){
	return gulp.src([
		'./js/api-*'])
	.pipe(gulp.dest('dist/js/'));
})

gulp.task('default', ['move-css','move-js'], function() {
	var sys = require('sys');
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { sys.puts(stdout) }
	exec("./node_modules/atom-shell/dist/Atom.app/Contents/MacOS/Atom .", puts);
})

gulp.task('compile', ['min-css','min-js'], function() {
	var sys = require('sys');
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { sys.puts(stdout) }
	exec("./node_modules/atom-shell/dist/Atom.app/Contents/MacOS/Atom .", puts);
})