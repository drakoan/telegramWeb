const { src, dest, watch, series, parallel } = require('gulp');

const sass = require('gulp-sass')(require('sass-embedded')); // allows to use dart-sass
const prefix = require('gulp-autoprefixer'); // prefixing css
const minifycss = require('gulp-clean-css'); // minifies css
const minifyhtml = require('gulp-htmlmin'); // minifies html
const terser = require('gulp-terser'); // minifies js
const imagewebp = require('gulp-webp'); // converts images to .webp format
const bs = require('browser-sync').create(); // browser auto-reload
const replace = require('gulp-replace'); // replaces content in files
const fileinclude = require('gulp-file-include'); // includes files' content inside another file

// some modules I'm not using right now, but I don't want to lose them:)
// these modules are listed below
const rename = require('gulp-rename'); // changes file names and paths

// tasks

// replaces <img src="picture.jpg|png"> with <img src="picture.webp">
function changeImgPaths() {
    return src('dist/*.html')
      .pipe( replace(/src="(.+)\.(png|jpg)"/g, "src=\"$1.webp\"") )
      .pipe(dest('dist'));
}

// autoreloads browser
function browserSync() {
    bs.init({
        server: {
            baseDir: "./dist",
            // reloadDelay: 1000,
        }
    });
}

// moves fonts to another folder
function moveFonts() {
    return src('src/fonts/**/*')
        .pipe(dest('dist/fonts'));
}

// takes all html files except these that start with underscore (_header.html for example), makes includes,
function html() {
    return src('src/[!_]*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('dist'));
}

function compilescss() {
    return src('src/sass/main.scss')
        .pipe(sass())
        .pipe(prefix())
        .pipe(bs.stream())
        .pipe(dest('dist/css'));

}

// converts images to webp
function webpImage() {
    return src('src/**/*.{jpg,png}')
        .pipe(imagewebp())
        // .pipe(rename(function (path) {
        //     path.dirname = "";
        // }))
        .pipe(dest('dist'));
}

function moveSvg() {
    return src('src/**/*.svg')
        .pipe(dest('dist'));
}

function movejs() {
    return src('src/**/*.js')
        .pipe(dest('dist'));
}

function htmlmin() {
    return src('dist/**/*.html')
        .pipe(minifyhtml({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(dest('dist'));
}

function cssmin() {
    return src('dist/**/*.css')
        .pipe(minifycss())
        .pipe(dest('dist'));
}

// minifies js
function jsmin() {
    return src('dist/**/*.js')
        .pipe(terser())
        .pipe(dest('dist'));
}

// watch task
function watchTask() {
    watch('src/fonts/**/*', moveFonts);
    watch('src/**/*.html', series(html, changeImgPaths));
    watch('src/**/*.scss', compilescss);
    watch('src/**/*.js', movejs);
    watch('src/**/*.{jpg,png}', webpImage);
    watch('src/**/*.svg', moveSvg);


    // idk how to add this in the watches above
    watch('dist/**/*.html').on('change', bs.reload);
    watch('dist/**/*.js').on('change', bs.reload);
}

// default gulp task
// it starts browserSync and all other tasks in parallel
exports.default = parallel(browserSync, series(
    html,
    changeImgPaths,
    moveFonts,
    compilescss,
    movejs,
    moveSvg,
    webpImage,
    watchTask
));

exports.minifyAll = parallel(
    htmlmin,
    cssmin,
    jsmin
);