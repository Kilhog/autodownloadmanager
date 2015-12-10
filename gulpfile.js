var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var exec = require('child_process').exec;
var babel = require('gulp-babel');
var pjson = require('./package.json');
var packager = require('electron-packager');
var spawn = require('child_process').spawn;

var css = [
  './app-raw/css/styles.css'
];

var js = [
  './app-raw/js/mainModule.js',
  './app-raw/js/mainCtrl.js',
  './app-raw/js/managerCtrl.js',
  './app-raw/js/reglagesCtrl.js',
  './app-raw/js/modal_change_target.js',
  './app-raw/js/episode_bottom_sheet.js'
];

var html = [
  './app-raw/partial/*.html'
];

var modules = [];

for(var k in pjson.dependencies) {
  modules.push('./node_modules/' + k + '/**/*');
}

function launch() {

  var cmd = "",
    pathApp = "./app/";

  if (process.platform == 'darwin') {
    cmd = "./node_modules/electron-prebuilt/dist/Electron.app/Contents/MacOS/Electron";
  } else if (process.platform == 'linux') {
    cmd = "./node_modules/electron-prebuilt/dist/electron";
  } else if (process.platform == 'win32') {
    cmd = ".\\node_modules\\electron-prebuilt\\dist\\electron.exe";
    pathApp = ".\\app\\";
  }

  var electron = spawn(cmd, [pathApp]);


  electron.stdout.on('data', function (data) {
    console.log(String(data));
  });

  electron.stderr.on('data', function (data) {
    console.log(String(data));
  });

  electron.on('exit', function (code) {
    console.log('child process exited with code ' + String(code));
  });

}

gulp.task('min-css', function () {
  return gulp.src(css)
    .pipe(concatCss('css/bundle.css'))
    .pipe(minifyCSS({keepBreaks: false, keepSpecialComments: 0, rebase: false}))
    .pipe(gulp.dest('app/'));
});

gulp.task('move-css', function () {
  return gulp.src(css)
    .pipe(concatCss('css/bundle.css'))
    .pipe(gulp.dest('app/'));
});

gulp.task('min-js', ['min-api'], function () {
  return gulp.src(js)
    .pipe(concat('js/script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/'));
});

gulp.task('move-js', ['move-api'], function () {
  return gulp.src(js)
    .pipe(concat('js/script.min.js'))
    .pipe(gulp.dest('app/'));
});

gulp.task('min-api', function () {
  return gulp.src([
    './app-raw/js/api-*'])
    .pipe(babel({presets: ['es2015']}))
    .pipe(uglify())
    .pipe(gulp.dest('app/js/'));
});

gulp.task('move-api', function () {
  return gulp.src([
    './app-raw/js/api-*'])
    .pipe(gulp.dest('app/js/'));
});

gulp.task('min-html', function() {
  return gulp.src(html)
    .pipe(htmlmin())
    .pipe(gulp.dest('app/partial/'));
});

gulp.task('move-html', function() {
  return gulp.src(html)
    .pipe(gulp.dest('app/partial/'));
});

gulp.task('move-lib', function() {
  return gulp.src("./app-raw/lib/**/*")
    .pipe(gulp.dest('app/lib/'));
});

gulp.task('move-main', function() {
  return gulp.src(["./app-raw/main.js", "./app-raw/index.html", "./package.json"])
    .pipe(gulp.dest('app/'));
});

gulp.task('move-modules', function() {
  return gulp.src(modules, {base: './node_modules/'})
    .pipe(gulp.dest('app/node_modules/'));
});

gulp.task('move-all', ['move-css', 'move-js', 'move-html', 'move-lib', 'move-main', 'move-modules'], function () {

});

gulp.task('min-all', ['min-css', 'min-js', 'min-html', 'move-lib', 'move-main', 'move-modules'], function () {

});

gulp.task('default', ['move-all'], function () {
  launch();
});

gulp.task('min', ['min-all'], function () {
  launch();
});

var build = function() {
  if (process.platform == 'darwin') {
    packager({dir: 'app', name: "AutoDownloadManager", platform: 'darwin', arch: 'all', version: '0.31.2', 'app-version': pjson.version, icon: "img/atom.icns", out: "build", overwrite: true}, function done (err, appPath) { console.log(err, appPath)});
    packager({dir: 'app', name: "AutoDownloadManager", platform: 'win32', arch: 'all', version: '0.31.2', 'app-version': pjson.version, icon: "img/atom.ico", out: "build", overwrite: true}, function done (err, appPath) { console.log(err, appPath)});
    packager({dir: 'app', name: "AutoDownloadManager", platform: 'linux', arch: 'all', version: '0.31.2', 'app-version': pjson.version, out: "build", overwrite: true}, function done (err, appPath) { console.log(err, appPath)});
  }
  if (process.platform == 'win32') {
    packager({dir: 'app', name: "AutoDownloadManager", platform: 'win32', arch: 'all', version: '0.31.2', 'app-version': pjson.version, icon: "img/atom.ico", out: "build", overwrite: true}, function done (err, appPath) { console.log(err, appPath)});
  }
};

gulp.task('package', ['min-all'], build);

gulp.task('package-dev', ['move-all'], build);
