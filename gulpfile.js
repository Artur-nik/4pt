const { src, dest, parallel, series, watch } = require('gulp');
const sass          = require('gulp-sass');
const browserSync   = require('browser-sync').create();
const del           = require('del');
const gcmq          = require('gulp-group-css-media-queries');
const autoprefixer  = require('gulp-autoprefixer');
const fileinclude   = require('gulp-file-include');
const cssnano       = require('gulp-cssnano');

let path = {
    dev: {
        html:          "app/",
        css:           "app/css/",
        scss:           "src/dev.scss",
    },
    build: {
        css: "build/"
    },
    assembly: {
        css: "assembly/",
        scss: "src/assembly/*.scss"
    },
    src: {
        html:           [
                            "src/template/*.html", 
                            '!' + "src/template/**/_*.html"
                        ],
        scss:           "src/4pt-*.scss", 
              
        //js:           "src/js/*.js",
    },
    watch: {
        html:           [
                            "src/template/*.html", 
                            "src/template/**/_*.html"
                        ],
        scss:           "src/**/*.scss",
        js:             "src/js/**/*.js",
    },
    clean: "app/**/*",
    cleanBuild: "build/**/*",
    cleanAssembly: "assembly/**/*",
}



// Определяем логику работы Browsersync
function browser_sync() {
    browserSync.init({ 
        server: {
            baseDir: 'app',
            index:'index.html'
        },
        notify: false, // Отключаем уведомления
        online: true, // Режим работы
        open: false
    })
}
// 
function html() {
    return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.dev.html))
    .pipe(browserSync.stream());
}
// sass
function styles() {
    return src(path.dev.scss)
    .pipe(sass())
    .pipe(autoprefixer({
        //grid: true,
        flexbox: false,}))
    // сбор медиа запросов
    .pipe(gcmq())       
    //.pipe(cssnano({
    //    discardComments: false,
    //}))
    .pipe(dest(path.dev.css))
    .pipe(browserSync.stream());
}
//*
function stylesBuild() {
    return src(path.src.scss)
    .pipe(sass())
    .pipe(autoprefixer({
        //grid: true,
        flexbox: false,}))
    // сбор медиа запросов
    .pipe(gcmq())       
    .pipe(cssnano({
        discardComments: false,
    }))
    .pipe(dest(path.build.css))
}
//*
function stylesAssembly() {
    return src(path.assembly.scss)
    .pipe(sass())
    .pipe(autoprefixer({
        //grid: true,
        flexbox: false,}))
    // сбор медиа запросов
    .pipe(gcmq())       
    .pipe(cssnano({
        discardComments: false,
    }))
    .pipe(dest(path.assembly.css))
}
// js
function scripts() {
    return src(path.src.js)
    .pipe(dest(path.dev.js))
    .pipe(browserSync.stream())
}
// watch
function startwatch() {
    watch(path.watch.scss,  styles);
    watch(path.watch.js,    scripts);
    watch(path.watch.html,  html);
}

// удаление папки dest
function cleandest() {
    return del(path.clean);
}
// удаление папки Build
function cleanBuild() {
    return del(path.cleanBuild);
}

function cleanAssembly() {
    return del(path.cleanAssembly);
}
exports.browser_sync = browser_sync;
exports.html = html;
exports.scripts = scripts;
exports.styles = styles;
exports.startwatch = startwatch;
exports.cleandest = cleandest;

exports.default = series(cleandest, parallel(styles, browser_sync, html,  startwatch));
exports.build = series(cleanBuild, stylesBuild);
exports.ass = series(cleanAssembly, stylesAssembly);