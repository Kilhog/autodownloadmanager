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
  if (process.platform == 'win32') {
    console.log('Windows Build Launching');

    /* Windows Override */
    var out = "build\\";
    var path = out + applicationName + "-win";

    //var path = "D:/nodeJS/autodownloadmanager/build/" + applicationName + ".app";
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

    out = "build\\";
    console.log(path);
    console.log(execSync("rmdir /s /q " + out + applicationName + '-win'));
    console.log(execSync("xcopy node_modules\\electron-prebuilt\\dist " + out + applicationName + "-win /e /s /q /i"));

    console.log(execSync("move " + out + applicationName + "-win\\electron.exe " + out + applicationName + "-win\\" + application + ".exe"));
    console.log(execSync("rmdir /s /q " + out + applicationName + "-win\\resources\\default_app"));
    console.log(execSync("mkdir " + out + applicationName + "-win\\resources\\app"));
    console.log(execSync("xcopy dist " + out + applicationName + "-win\\resources\\app /e /s /q /i"));
    console.log(execSync("xcopy lib " + out + applicationName + "-win\\resources\\app /e /s /q /i"));
    console.log(execSync("copy main.js " + out + applicationName + "-win\\resources\\app"));
    console.log(execSync("copy package.json " + out + applicationName + "-win\\resources\\app"));
    console.log(execSync("flatten-packages"));
    console.log(execSync("xcopy node_modules " + out + applicationName + "-win\\resources\\app\\node_modules /e /s /i"));
    console.log(execSync("rmdir /s /q " + out + applicationName + "-win\\resources\\app\\node_modules\\electron-prebuilt"));
    console.log(execSync("rmdir /s /q " + out + applicationName + "-win\\resources\\app\\node_modules\\gulp"));

    /*console.log('Creation des repertoire');
    for (mkdir of mkdirs) {
      console.log(mkdir);
      pExec("mkdir -p " + mkdir);
    }*/

    /*for (rm of rms) {
      pExec("rm -rf " + rm);
    }*/

    //pExec("sed -i '' 's/Electron/AutoDownloadManager/g' " + path + '/Contents/Info.plist')
    //pExec("mv " + path + "/Contents/MacOS/Electron " + path + "/Contents/MacOS/AutoDownloadManager");

    /*for (cp of cps) {
      pExec("cp " + cp[0] + " " + cp[1]);
    }*/

    /*for (cpr of cprs) {
      pExec("cp -R " + cpr[0] + " " + cpr[1]);
    }*/

    //pExec("cd " + out + " && tar -zcvf " + applicationName + ".app.tar.gz " + applicationName + ".app/*");
    //pExec("rm -rf " + path);
  }
};

gulp.task('package', ['min-all'], build);

gulp.task('package-dev', ['move-all'], build);
