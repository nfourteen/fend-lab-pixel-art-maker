/**
 * Copyright © 2018 Nfourteen. All rights reserved.
 */

const pkg = require('./package.json');
const gulp = require('gulp');

const $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies'],
    lazy: true
});

const browserSync = $.browserSync.create();

const argv = $.yargs.argv;

const onError = (error) => {
    console.log(error);
};


//
// Tasks
//

gulp.task('scss', () => {
    $.fancyLog('Compiling SCSS');
    return gulp.src(pkg.paths.src.scss + pkg.vars.scssFileName)
        .pipe($.plumber({errorHandler: onError}))
        .pipe($.if(!argv.production, $.sourcemaps.init()))
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.cached('sass_compile'))
        .pipe($.autoprefixer())
        .pipe($.if(!argv.production, $.sourcemaps.write('.')))
        .pipe(gulp.dest(pkg.paths.build.css))
});

gulp.task('css', ['scss'], () => {
    $.fancyLog('-> Building css');
    return gulp.src(pkg.globs.distCss)
        .pipe($.plumber({errorHandler: onError}))
        .pipe($.newer({dest: pkg.paths.dist.css + pkg.vars.siteCssFileName}))
        .pipe($.print.default())
        .pipe($.if(!argv.production, $.sourcemaps.init({loadMaps: true})))
        .pipe($.concat(pkg.vars.siteCssFileName))
        .pipe($.cssnano({
            discardComments: {
                removeAll: true
            },
            discardDuplicates: true,
            discardEmpty: true,
            minifyFontValues: true,
            minifySelectors: true
        }))
        .pipe($.if(!argv.production, $.sourcemaps.write()))
        .pipe(gulp.dest(pkg.paths.dist.css))
        .pipe($.filter('**/*.css'))
        .pipe(browserSync.stream());
});

// todo - pipe images through imagemin
gulp.task('copyImages', () => {
    $.fancyLog('-> Copying images to ' + pkg.paths.dist.images);
    return gulp.src(pkg.paths.src.images + "**/*.{png,jpg,jpeg,gif,svg}")
        .pipe($.plumber({errorHandler: onError}))
        .pipe(gulp.dest(pkg.paths.dist.images));
});

gulp.task('clean', function () {
    $.fancyLog('-> Cleaning build and public folders');
    return $.del([
        pkg.paths.build.base + '**/*',
        pkg.paths.dist.base + '**/*'
    ]);
});

gulp.task("js-babel", () => {
    $.fancyLog("-> Compiling Javascript via Babel...");
    return gulp.src(pkg.globs.babelJs)
        .pipe($.plumber({errorHandler: onError}))
        .pipe($.newer({dest: pkg.paths.build.js}))
        .pipe($.babel())
        .pipe(gulp.dest(pkg.paths.build.js));
});

// js task - minimize any distribution Javascript into the public js folder, and add our banner to it
gulp.task("js", ["js-babel"], () => {
    $.fancyLog("-> Building js");
    return gulp.src(pkg.globs.distJs)
        .pipe($.plumber({errorHandler: onError}))
        .pipe(gulp.dest(pkg.paths.dist.js))
        .pipe($.filter("**/*.js"))
        .pipe($.browserSync.reload({stream: true}));
});


gulp.task('serve', ['css', 'js'], () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch([pkg.paths.src.scss + '**/*.scss'], ['css']);
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch([pkg.paths.src.js + '**/*.js'], ['js']).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);

