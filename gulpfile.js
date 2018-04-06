var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var inject = require('gulp-inject');
var webserver = require('gulp-webserver');
var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcCSS: 'src/**/*.scss',
    srcJS: 'src/**/*.js',
    tmp: 'tmp',
    tmpIndex: 'tmp/index.html',
    tmpCSS: 'tmp/**/*.css',
    tmpJS: 'tmp/**/*.js',
    dist: 'dist',
    distIndex: 'dist/index.html',
    distCSS: 'dist/**/*.css',
    distJS: 'dist/**/*.js'
};

gulp.task('copy', ['html', 'css', 'js']);

gulp.task('html', function() {
    return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});

gulp.task('css', function() {
    return gulp.src(paths.srcCSS)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'] // config object
        }))
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('js', function() {
    return gulp.src(paths.srcJS)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015'] // babel config object
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('inject', ['copy'], function() {
    var css = gulp.src(paths.tmpCSS);
    var js = gulp.src(paths.tmpJS);
    return gulp.src(paths.tmpIndex)
        .pipe(inject(css, { relative: true }))
        .pipe(inject(js, { relative: true }))
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('serve', ['inject'], function() {
    return gulp.src(paths.tmp)
        .pipe(webserver({
            port: 3000,
            livereload: true
        }));
});

gulp.task('watch', ['serve'], function() {
    gulp.watch(paths.src, ['inject']);
});

gulp.task('default', ['watch']);

gulp.task('html:dist', function() {
    return gulp.src(paths.srcHTML)
        .pipe(htmlclean())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('css:dist', function() {
    return gulp.src(paths.srcCSS)
        .pipe(concat('style.min.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'] // config object
        }))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('js:dist', function() {
    return gulp.src(paths.srcJS)
        .pipe(sourcemaps.init())
        .pipe(concat('script.min.js'))
        .pipe(babel({
            presets: ['es2015'] // babel config object
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist']);

gulp.task('inject:dist', ['copy:dist'], function() {
    var css = gulp.src(paths.distCSS);
    var js = gulp.src(paths.distJS);
    return gulp.src(paths.distIndex)
        .pipe(inject(css, { relative: true }))
        .pipe(inject(js, { relative: true }))
        .pipe(gulp.dest(paths.dist));
});
gulp.task('build', ['inject:dist']);

gulp.task('live', function() {
    return gulp.src(paths.dist)
        .pipe(webserver({
            port: 8000,
            livereload: true
        }));
});