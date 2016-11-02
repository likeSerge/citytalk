'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const debug = require('gulp-debug');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('gulp-cssnano');
const del = require('del');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

const stylesDestPath = '../public/css/';
const stylesDestFilename = 'citytalk.min.css';
const stylesDestVendorFilename = 'citytalk.vendor.min.css';
const jsDestPath = '../public/js/';
const jsDestFilename = 'citytalk.min.js';
const jsDestVendorFilename = 'citytalk.vendor.min.js';
const htmlDestPath = '../public/';

/**
 * Styles
 */
gulp.task('styles', ['styles:clean', 'styles:build', 'styles:watch'], () => {});

gulp.task('styles:clean', () => {
    del([stylesDestPath + stylesDestFilename], {force: true});
});

gulp.task('styles:build', () => {
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

gulp.task('styles:watch', () => {
    gulp.watch('sass/*.scss', ['styles:build']);
});


gulp.task('styles-vendor', ['styles-vendor:clean', 'styles-vendor:build'], () => {
});

gulp.task('styles-vendor:clean', () => {
    del([stylesDestPath + stylesDestVendorFilename], {force: true});
});

gulp.task('styles-vendor:build', () => {
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
gulp.task('js', ['js:clean', 'js:build', 'js:watch'], () => {
});

gulp.task('js:clean', () => {
    del([jsDestPath + jsDestFilename], {force: true});
});

gulp.task('js:build', () => {
    gulp.src(['js/citytalk.module.js',
            'js/citytalk.routes.js',
            'js/client.conf.js',
            'js/controllers/**/*',
            'js/components/**/*',
            'js/services/**/*' ],
        {base: 'js/'})
        .pipe(sourcemaps.init())
        .pipe(debug({title: 'src'}))
        .pipe(babel({presets: ['es2015']}))
        .pipe(debug({title: 'babel es2015'}))
        .pipe(uglify())
        .pipe(debug({title: 'uglify'}))
        .pipe(concat(jsDestFilename))
        .pipe(debug({title: 'concat'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jsDestPath))
});

gulp.task('js:watch', () => {
    gulp.watch('js/**/*', ['js:build']);
});


gulp.task('js-vendor', ['js-vendor:clean', 'js-vendor:build'], () => {
});

gulp.task('js-vendor:clean', () => {
    del([jsDestPath + jsDestVendorFilename], {force: true});
});

gulp.task('js-vendor:build', () => {
    gulp.src(['node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'node_modules/angular/angular.js',
            'node_modules/angular-ui-router/release/angular-ui-router.js',
            'node_modules/ngstorage/ngStorage.js',
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
gulp.task('html', ['html:clean', 'html:build', 'html:watch'], () => {
});

gulp.task('html:clean', () => {
    del([htmlDestPath + 'index.html', htmlDestPath + 'html/'], {force: true});
});

gulp.task('html:build', () => {
    gulp.src(['index.html',
            'views/**/*' ],
        {base: './'})
        .pipe(debug({title: 'src'}))
        .pipe(gulp.dest(htmlDestPath))
});

gulp.task('html:watch', () => {
    gulp.watch(['index.html', 'views/**/*' ], ['html:build']);
});