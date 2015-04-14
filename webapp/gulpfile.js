'use strict';

var gulp = require('gulp');

var babelify = require("babelify");

var browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    rename = require('gulp-rename'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass');

var jade_path = "./src/views/**/*.jade";
var jsx_path = "src/jsx/**/*.jsx";
var sass_path = "src/scss/**/*.scss";

gulp.task('build', ['browserify', 'jade', 'sass'], function() {
    return;
});

gulp.task('browserify', function () {
    var bundler = browserify({
        entries: ['./src/jsx/app.jsx'],
        paths: ['./node_modules', './src/jsx'],
        debug: true
    });

    bundler.transform( babelify );

    var bundle = function() {
        return bundler
            .bundle( )
            .pipe( source( 'app.jsx' ) )
            .pipe( rename( 'app.js' ) )
            .pipe( gulp.dest( './dist/js/' ) );
    };

    return bundle();
});

gulp.task('jade', function() {
    return gulp.src( jade_path )
        .pipe( jade({ pretty: true }) )
        .pipe( gulp.dest( "./dist/" ) );
});

gulp.task('sass', function() {
    return gulp.src( sass_path )
        .pipe( sass({ errLogToConsole: true }) )
        .pipe( gulp.dest( "./dist/css/" ) );
});
