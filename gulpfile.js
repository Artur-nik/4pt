const { src, dest, parallel, series, watch } = require('gulp');
const sass          = require('gulp-sass');
const browserSync   = require('browser-sync').create();
const del           = require('del');
const gcmq          = require('gulp-group-css-media-queries');
const autoprefixer  = require('gulp-autoprefixer');
const fileinclude   = require('gulp-file-include');
const cssnano       = require('gulp-cssnano');


let way = "/";
let prototype = 'prototype-box';
//let prototype = 'prototype-components';

let path = {
    build: {
        html:          "app/",
        css:           "app/css/",
        js:            "app/js/",
    },
    src: {
        html:           [
                            "test/*.html", 
                            '!' + "test/**/_*.html"
                        ],
        scss:           "src/" + prototype + "/4pt.scss",
        js:             "src/js/*.js",
    },
    watch: {
        html:           [
                            "test/*.html", 
                            "test/**/_*.html"
                        ],
        scss:           "src/" + prototype + "/**/*.scss",
        js:             "src/js/**/*.js",
    },
    clean: "app/**/*",
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
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream());
}
// sass
function styles() {
    return src(path.src.scss)
    .pipe(sass())
    .pipe(autoprefixer({
        //grid: true,
        flexbox: false,
        overrideBrowserslist: [
                            '>0.5%',
                            'last 4 versions',
                            'edge >= 15',
                            'not ie > 11', 
                            'not ie_mob > 0',  
                            'ff >= 31',
                            'chrome >= 49',
                            'opera >= 36',
                            'safari >= 9.1',
                            'ios >= 9.3',
                            'android > 4.4.4',                         
                        ]}))
    // сбор медиа запросов
    .pipe(gcmq())       
//    .pipe(cssnano({
//        discardComments: false,
//    }
//    ))
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream());
}
// js
function scripts() {
    return src(path.src.js)
    .pipe(dest(path.build.js))
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

exports.browser_sync = browser_sync;
exports.html = html;
exports.scripts = scripts;
exports.styles = styles;
exports.startwatch = startwatch;
exports.cleandest = cleandest;

exports.default = series(cleandest, parallel(styles, scripts, browser_sync, html,  startwatch));