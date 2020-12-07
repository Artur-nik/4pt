const { src, dest, parallel, series, watch } = require('gulp');
const sass          = require('gulp-sass');
const browserSync   = require('browser-sync').create();
const del           = require('del');
const gcmq          = require('gulp-group-css-media-queries');
const autoprefixer  = require('gulp-autoprefixer');
const fileinclude   = require('gulp-file-include');
const cssnano       = require('gulp-cssnano');


let way = "/";

let path = {
    build: {
        html:          "app/",
        css:           "app/css/",
        js:            "app/js/",
    },
    src: {
        html:           [
                            "src/template/*.html", 
                            '!' + "src/template/**/_*.html"
                        ],
        scss:           "src/scss/mobile-first/*.scss",
        js:             "src/js/*.js",
    },
    watch: {
        html:           [
                            "src/template/*.html", 
                            "src/template/**/_*.html"
                        ],
        scss:           "src/scss/**/*.scss",
        js:             "src/js/**/*.js",
    },
    clean: [
        "app/*",
        "app/css/",
        "app/js/"
    ],
    cleanimg: "app/images/*",
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
        overrideBrowserslist: [
                            '>1%',
                            'last 4 versions',
                            'not ie < 11', 
                            'not ie_mob > 0'                           
                        ]}))
    .pipe(gcmq())       // сбор медиа запросов
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