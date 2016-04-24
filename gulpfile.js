var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var exec = require('child_process').exec;
var babel = require('gulp-babel');
var pjson = require('./package.json');
var packager = require('electron-packager');
var install = require("gulp-install");
var spawn = require('child_process').spawn;
var fs = require('fs');
var replace = require('gulp-replace');

var css = [
  './app-raw/css/styles.css'
];

var js = [
  './app-raw/js/*.js'
];

var html = [
  './app-raw/partial/*.html'
];

var modules = [];

for(var k in pjson.dependencies) {
  modules.push('./node_modules/' + k + '/**/*');
}

function launchDarwin() {
  try {
    fs.symlinkSync(__dirname + "/app", __dirname + "/node_modules/electron-prebuilt/dist/Electron.app/Contents/Resources/app");
  } catch (e) {}

  var cmd = "open -a finder ./node_modules/electron-prebuilt/dist/Electron.app";

  exec(cmd);
}

function launch() {
  try {
    fs.symlinkSync(__dirname + "/node_modules", __dirname + "/app/node_modules");
  } catch (e) {}

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
    .pipe(minifyCSS({keepBreaks: false, keepSpecialComments: 0, rebase: false}))
    .pipe(gulp.dest('app/css/'));
});

gulp.task('min-js', function () {
  return gulp.src(js)
    .pipe(babel({presets: ['es2015']}))
    .pipe(uglify())
    .pipe(gulp.dest('app/js/'));
});

gulp.task('min-html', function() {
  return gulp.src(html)
    .pipe(htmlmin())
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

gulp.task('create-min-app', ['min-css', 'min-js', 'min-html', 'move-lib', 'move-main'], function () {

});

gulp.task('default', ['create-min-app', 'patch-angular-material'], function () {
  launch();
});

gulp.task('darwin', ['create-min-app', 'patch-angular-material'], function () {
  launchDarwin();
});

gulp.task('patch-angular-material', function(){
  return gulp.src('./node_modules/angular-material/angular-material.min.css')
    .pipe(replace('599px', '1px'))
    .pipe(replace('600px', '2px'))
    .pipe(replace('959px', '3px'))
    .pipe(replace('960px', '4px'))
    .pipe(gulp.dest('./node_modules/angular-material/'));
});

var build = function() {
  packager({dir: 'app', name: "AutoDownloadManager", platform: 'darwin', arch: 'all', version: '0.37.7', 'app-version': pjson.version, icon: "img/atom.icns", out: "build", overwrite: true}, function done (err, appPath) { console.log(err, appPath)});
  packager({dir: 'app', name: "AutoDownloadManager", platform: 'win32', arch: 'all', version: '0.37.7', 'app-version': pjson.version, icon: "img/atom.ico", out: "build", overwrite: true}, function done (err, appPath) { console.log(err, appPath)});
  packager({dir: 'app', name: "AutoDownloadManager", platform: 'linux', arch: 'all', version: '0.37.7', 'app-version': pjson.version, out: "build", overwrite: true}, function done (err, appPath) { console.log(err, appPath)});
};

gulp.task('package', ['create-min-app', 'patch-angular-material'], build);
