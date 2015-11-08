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
var pjson = require('./package.json');

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

var modules = [
  './node_modules/angular/**/*',
  './node_modules/angular-animate/**/*',
  './node_modules/angular-aria/**/*',
  './node_modules/angular-material/**/*',
  './node_modules/angular-ui-router/**/*',
  './node_modules/cheerio/**/*',
  './node_modules/crypto-js/**/*',
  './node_modules/curlrequest/**/*',
  './node_modules/dblite/**/*',
  './node_modules/font-awesome/**/*',
  './node_modules/jquery/**/*',
  './node_modules/moment/**/*',
  './node_modules/path-extra/**/*',
  './node_modules/request/**/*',
  './node_modules/strike-api/**/*',
  './node_modules/superagent/**/*',
  './node_modules/t411/**/*',
  './node_modules/transmission/**/*',
  './node_modules/underscore/**/*'
];

var electronPrebuilt = './node_modules/electron-prebuilt/dist/Electron.app';

function launch() {
  function puts(error, stdout, stderr) {
    sys.puts(stdout);
  }

  if (process.platform == 'darwin') {
    exec("./node_modules/electron-prebuilt/dist/Electron.app/Contents/MacOS/Electron ./app/", puts);
  } else if (process.platform == 'linux') {
    exec("./node_modules/electron-prebuilt/dist/electron ./app/", puts);
  } else if (process.platform == 'win32') {
    exec(".\\node_modules\\electron-prebuilt\\dist\\electron.exe .\\app\\", puts);
  }
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
    .pipe(babel())
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
    .pipe(htmlmin({collapseWhitespace: true}))
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

gulp.task('compile', ['min-all'], function () {
  launch();
});

function pExec(cmd) {
  console.log(execSync(cmd).stderr);
};

var build = function() {
  var application = "AutoDownloadManager";
  var applicationName = application + "_" + pjson.version.replace(/\./g, '_');
  var out = "./build/";
  var path = out + applicationName + ".app";

  if (process.platform == 'darwin') {
    var rms = [path + "/Contents/Resources/default_app", path + "/Contents/Resources/atom.icns"];
    var mkdirs = [path + "/Contents/Resources/app", path + "/Contents/Resources/app/node_modules/"];
    var cps = [
      ['img/atom.icns', path + '/Contents/Resources/atom.icns'],
      ['index.html', path + '/Contents/Resources/app/'],
      ['main.js', path + '/Contents/Resources/app/'],
      ['package.json', path + '/Contents/Resources/app/']
    ];
    var cprs = [
      ['dist', path + '/Contents/Resources/app/'],
      ['lib', path + '/Contents/Resources/app/'],
      ['node_modules/cheerio', path + '/Contents/Resources/app/node_modules/'],
      ['node_modules/crypto-js', path + '/Contents/Resources/app/node_modules/'],
      ['node_modules/dblite', path + '/Contents/Resources/app/node_modules/'],
      ['node_modules/jquery', path + '/Contents/Resources/app/node_modules/'],
      ['node_modules/strike-api', path + '/Contents/Resources/app/node_modules/'],
      ['node_modules/superagent', path + '/Contents/Resources/app/node_modules/'],
      ['node_modules/t411', path + '/Contents/Resources/app/node_modules/'],
      ['node_modules/transmission', path + '/Contents/Resources/app/node_modules/'],
      ['node_modules/font-awesome', path + '/Contents/Resources/app/node_modules/'],
      ['node_modules/path-extra', path + '/Contents/Resources/app/node_modules/'],
      ['node_modules/underscore', path + '/Contents/Resources/app/node_modules/']
    ];

    pExec("cp -R ./node_modules/electron-prebuilt/dist/Electron.app " + path);

    for (mkdir of mkdirs) {
      pExec("mkdir -p " + mkdir);
    }

    for (rm of rms) {
      pExec("rm -rf " + rm);
    }

    pExec("sed -i '' 's/Electron/AutoDownloadManager/g' " + path + '/Contents/Info.plist')
    pExec("mv " + path + "/Contents/MacOS/Electron " + path + "/Contents/MacOS/AutoDownloadManager");

    for (cp of cps) {
      pExec("cp " + cp[0] + " " + cp[1]);
    }

    for (cpr of cprs) {
      pExec("cp -R " + cpr[0] + " " + cpr[1]);
    }

    pExec("cd " + out + " && tar -zcvf " + applicationName + ".app.tar.gz " + applicationName + ".app/*");
    pExec("rm -rf " + path);
  }
};

gulp.task('package', ['min-all'], build);

gulp.task('package-dev', ['move-all'], build);
