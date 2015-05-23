var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var clean = require('gulp-rimraf');
var uglify = require('gulp-uglify');
var sys = require('sys');
var exec = require('child_process').exec;

var css = [
  './css/styles.css',
  './node_modules/font-awesome/css/font-awesome.min.css',
  './node_modules/angular-material/angular-material.min.css'
];

var js = [
  './node_modules/angular/angular.min.js',
  './node_modules/angular-animate/angular-animate.min.js',
  './node_modules/angular-aria/angular-aria.min.js',
  './node_modules/angular-material/angular-material.min.js',
  './node_modules/angular-ui-router/release/angular-ui-router.min.js',
  './js/mainModule.js',
	'./js/mainCtrl.js',
	'./js/managerCtrl.js',
	'./js/reglagesCtrl.js',
  './js/modal_change_target.js',
  './js/episode_bottom_sheet.js'
];

function launch() {
	function puts(error, stdout, stderr) { 
		sys.puts(stdout); 
	}

	if(process.platform == 'darwin') {
		exec("./node_modules/electron-prebuilt/dist/Electron.app/Contents/MacOS/Electron .", puts);
	} else if (process.platform == 'linux') {
		exec("./node_modules/electron-prebuilt/dist/electron .", puts);
	} else if (process.platform == 'win32') {
		exec(".\\node_modules\\electron-prebuilt\\dist\\electron.exe .\\", puts);
	}
}

gulp.task('clean-min-css', function(){
	return gulp.src('dist/styles/bundle.css', {read: false}).pipe(clean());
});

gulp.task('min-css', ['clean-min-css'],function() {
  return gulp.src(css)
  .pipe(concatCss('styles/bundle.css'))
  .pipe(minifyCSS({keepBreaks:false,keepSpecialComments:0}))
  .pipe(gulp.dest('dist/'));
});

gulp.task('move-css', ['clean-min-css'],function() {
  return gulp.src(css)
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
	return gulp.src(js)
	.pipe(concat('js/script.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/'));
});

gulp.task('move-js',['clean-min-js','move-jquery','move-api'], function(){
	return gulp.src(js)
	.pipe(concat('js/script.min.js'))
	.pipe(gulp.dest('dist/'));
});

gulp.task('min-api', function(){
	return gulp.src([
		'./js/api-*'])
	.pipe(uglify())
	.pipe(gulp.dest('dist/js/'));
});

gulp.task('move-api', function(){
	return gulp.src([
		'./js/api-*'])
	.pipe(gulp.dest('dist/js/'));
});

gulp.task('default', ['move-css','move-js'], function() {
	launch();
});

gulp.task('compile', ['min-css','min-js'], function() {
	launch();
});


