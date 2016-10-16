'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var debug = require('gulp-debug');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var cssnano = require('gulp-cssnano');
var del = require('del');
var uglify = require('gulp-uglify');

var stylesDestPath = '../public/css/';
var stylesDestFilename = 'citytalk.min.css';
var stylesDestVendorFilename = 'citytalk.vendor.min.css';
var jsDestPath = '../public/js/';
var jsDestFilename = 'citytalk.min.js';
var jsDestVendorFilename = 'citytalk.vendor.min.js';
var htmlDestPath = '../public/';

/**
 * Styles
 */
gulp.task('styles', ['styles:clean', 'styles:build', 'styles:watch'], function () {
});

gulp.task('styles:clean', function () {
    del([stylesDestPath + stylesDestFilename], {force: true});
});

gulp.task('styles:build', function () {
    gulp.src('sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(debug({title: 'src'}))
        .pipe(sass().on('error', sass.logError))
        .pipe(debug({title: 'sass'}))
        .pipe(cssnano())
        .pipe(debug({title: 'cssnano'}))
        .pipe(concat(stylesDestFilename))
        .pipe(debug({title: 'concat'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(stylesDestPath))
});

gulp.task('styles:watch', function () {
    gulp.watch('sass/*.scss', ['styles:build']);
});


gulp.task('styles-vendor', ['styles-vendor:clean', 'styles-vendor:build'], function () {
});

gulp.task('styles-vendor:clean', function () {
    del([stylesDestPath + stylesDestVendorFilename], {force: true});
});

gulp.task('styles-vendor:build', function () {
    gulp.src('node_modules/bootstrap/dist/css/bootstrap.css')
        .pipe(sourcemaps.init())
        .pipe(debug({title: 'src'}))
        .pipe(cssnano())
        .pipe(debug({title: 'cssnano'}))
        .pipe(concat(stylesDestVendorFilename))
        .pipe(debug({title: 'concat'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(stylesDestPath))
});


/**
 * Javascript
 */
gulp.task('js', ['js:clean', 'js:build', 'js:watch'], function () {
});

gulp.task('js:clean', function () {
    del([jsDestPath + jsDestFilename], {force: true});
});

gulp.task('js:build', function () {
    gulp.src(['js/citytalk.module.js',
            'js/citytalk.routes.js',
            'js/controllers/**/*',
            'js/components/**/*',
            'js/services/**/*' ],
        {base: 'js/'})
        .pipe(sourcemaps.init())
        .pipe(debug({title: 'src'}))
        .pipe(uglify())
        .pipe(debug({title: 'uglify'}))
        .pipe(concat(jsDestFilename))
        .pipe(debug({title: 'concat'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jsDestPath))
});

gulp.task('js:watch', function () {
    gulp.watch('js/**/*', ['js:build']);
});


gulp.task('js-vendor', ['js-vendor:clean', 'js-vendor:build'], function () {
});

gulp.task('js-vendor:clean', function () {
    del([jsDestPath + jsDestVendorFilename], {force: true});
});

gulp.task('js-vendor:build', function () {
    gulp.src(['node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'node_modules/angular/angular.js',
            'node_modules/angular-ui-router/release/angular-ui-router.js',
            'node_modules/socket.io-client/socket.io.js' ],
        {base: 'node_modules/'})
        .pipe(sourcemaps.init())
        .pipe(debug({title: 'src'}))
        .pipe(uglify())
        .pipe(debug({title: 'uglify'}))
        .pipe(concat(jsDestVendorFilename))
        .pipe(debug({title: 'concat'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jsDestPath))
});

/**
 * HTML
 */
gulp.task('html', ['html:clean', 'html:build', 'html:watch'], function () {
});

gulp.task('html:clean', function () {
    del([htmlDestPath + 'index.html', htmlDestPath + 'html/'], {force: true});
});

gulp.task('html:build', function () {
    gulp.src(['index.html',
            'views/**/*' ],
        {base: './'})
        .pipe(debug({title: 'src'}))
        .pipe(gulp.dest(htmlDestPath))
});

gulp.task('html:watch', function () {
    gulp.watch(['index.html', 'views/**/*' ], ['html:build']);
});