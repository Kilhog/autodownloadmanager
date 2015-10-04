var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var clean = require('gulp-rimraf');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var sys = require('sys');
var exec = require('child_process').exec;
var execSync = require('sync-exec');
var babel = require('gulp-babel');

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

var html = [
  './partial/*.html'
];

var electronPrebuilt = './node_modules/electron-prebuilt/dist/Electron.app';

function launch() {
  function puts(error, stdout, stderr) {
    sys.puts(stdout);
  }

  if (process.platform == 'darwin') {
    exec("./node_modules/electron-prebuilt/dist/Electron.app/Contents/MacOS/Electron .", puts);
  } else if (process.platform == 'linux') {
    exec("./node_modules/electron-prebuilt/dist/electron .", puts);
  } else if (process.platform == 'win32') {
    exec(".\\node_modules\\electron-prebuilt\\dist\\electron.exe .\\", puts);
  }
}

gulp.task('clean-min-css', function () {
  return gulp.src('dist/styles/bundle.css', {read: false}).pipe(clean());
});

gulp.task('min-css', ['clean-min-css'], function () {
  return gulp.src(css)
    .pipe(concatCss('styles/bundle.css'))
    .pipe(minifyCSS({keepBreaks: false, keepSpecialComments: 0, rebase: false}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('move-css', ['clean-min-css'], function () {
  return gulp.src(css)
    .pipe(concatCss('styles/bundle.css'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean-move-jquery', function () {
  return gulp.src('dist/js/jquery.min.js', {read: false}).pipe(clean());
});

gulp.task('move-jquery', ['clean-move-jquery'], function () {
  return gulp.src(['./node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('clean-min-js', function () {
  return gulp.src('dist/js/script.min.js', {read: false}).pipe(clean());
});

gulp.task('min-js', ['clean-min-js', 'move-jquery', 'min-api'], function () {
  return gulp.src(js)
    .pipe(concat('js/script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('move-js', ['clean-min-js', 'move-jquery', 'move-api'], function () {
  return gulp.src(js)
    .pipe(concat('js/script.min.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('min-api', function () {
  return gulp.src([
    './js/api-*'])
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('move-api', function () {
  return gulp.src([
    './js/api-*'])
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('clean-min-html', function () {
  return gulp.src('dist/html/*.html', {read: false}).pipe(clean());
});

gulp.task('min-html', ['clean-min-html'], function() {
  return gulp.src(html)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/html/'));
});

gulp.task('move-html', ['clean-min-html'], function() {
  return gulp.src(html)
    .pipe(gulp.dest('dist/html/'));
});

gulp.task('move-all', ['move-css', 'move-js', 'move-html'], function () {

});

gulp.task('min-all', ['min-css', 'min-js', 'min-html'], function () {

});

gulp.task('default', ['move-all'], function () {
  launch();
});

gulp.task('compile', ['min-all'], function () {
  launch();
});

var build = function() {
  execSync("rm -rf ./build");

  if (process.platform == 'darwin') {
    execSync("mkdir build");
    execSync("cp -R ./node_modules/electron-prebuilt/dist/Electron.app ./build/AutoDownloadManager.app");
    execSync("sed 's/Electron/AutoDownloadManager/g' ./build/AutoDownloadManager.app/Contents/Info.plist > ./build/AutoDownloadManager.app/Contents/Info.plist.tmp");
    execSync("rm ./build/AutoDownloadManager.app/Contents/Info.plist");
    execSync("mv ./build/AutoDownloadManager.app/Contents/Info.plist.tmp ./build/AutoDownloadManager.app/Contents/Info.plist");
    execSync("rm ./build/AutoDownloadManager.app/Contents/Info.plist.tmp");
    execSync("mv ./build/AutoDownloadManager.app/Contents/MacOS/Electron ./build/AutoDownloadManager.app/Contents/MacOS/AutoDownloadManager");
    execSync("mkdir ./build/AutoDownloadManager.app/Contents/Resources/app");
    execSync("cp index.html ./build/AutoDownloadManager.app/Contents/Resources/app/");
    execSync("cp main.js ./build/AutoDownloadManager.app/Contents/Resources/app/");
    execSync("cp package.json ./build/AutoDownloadManager.app/Contents/Resources/app/");
    execSync("cp -R dist ./build/AutoDownloadManager.app/Contents/Resources/app/");
    execSync("cp -R lib ./build/AutoDownloadManager.app/Contents/Resources/app/");
    execSync("mkdir ./build/AutoDownloadManager.app/Contents/Resources/app/db/");
    execSync("mkdir ./build/AutoDownloadManager.app/Contents/Resources/app/node_modules/");

    execSync("cp -R node_modules/cheerio ./build/AutoDownloadManager.app/Contents/Resources/app/node_modules/");
    execSync("cp -R node_modules/crypto-js ./build/AutoDownloadManager.app/Contents/Resources/app/node_modules/");
    execSync("cp -R node_modules/curlrequest ./build/AutoDownloadManager.app/Contents/Resources/app/node_modules/");
    execSync("cp -R node_modules/dblite ./build/AutoDownloadManager.app/Contents/Resources/app/node_modules/");
    execSync("cp -R node_modules/jquery ./build/AutoDownloadManager.app/Contents/Resources/app/node_modules/");
    execSync("cp -R node_modules/strike-api ./build/AutoDownloadManager.app/Contents/Resources/app/node_modules/");
    execSync("cp -R node_modules/superagent ./build/AutoDownloadManager.app/Contents/Resources/app/node_modules/");
    execSync("cp -R node_modules/t411 ./build/AutoDownloadManager.app/Contents/Resources/app/node_modules/");
    execSync("cp -R node_modules/transmission ./build/AutoDownloadManager.app/Contents/Resources/app/node_modules/");
    execSync("cp -R node_modules/font-awesome ./build/AutoDownloadManager.app/Contents/Resources/app/node_modules/");
    execSync("cd build && tar -zcvf AutoDownloadManager.app.tar.gz AutoDownloadManager.app/*");
  }
};

gulp.task('package', ['min-all'], build);

gulp.task('package-dev', ['move-all'], build);
