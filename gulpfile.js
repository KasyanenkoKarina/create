import gulp from 'gulp';

import pug from 'gulp-pug';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import image from 'gulp-image';
import browserSync from 'browser-sync';

const { src, dest, watch, task, series, parallel } = gulp
const sass = gulpSass( dartSass );
const browser = browserSync.create()

task('html:build', function () {
    return src('src/pug/*.pug') 
        .pipe(pug({pretty: true}))
        .pipe(dest('dist'))
        .pipe(browser.reload({
            stream: true
        }));
});

task('styles:build', function () {
    return src('src/styles/*.scss') 
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('dist/css/'))
        .pipe(browser.reload({
            stream: true
        }));
});

task('images:build', function () {
    return src('src/images/*') 
        .pipe(image())
        .pipe(dest('dist/images/'))
        .pipe(browser.reload({
            stream: true
        }));
});

task('browser-sync', function() {
    browser.init( {
        server: {
            baseDir: './dist/',
            index: "index.html"
        }
    });
});

task('build', series('html:build', 'styles:build', 'images:build'));

task('watch', parallel('browser-sync', function () {
    watch('src/pug/**/*.pug', series('html:build'));
    watch('src/styles/**/*.scss', series('styles:build'));
    watch('src/images/*', series('images:build'));
}));