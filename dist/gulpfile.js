var gulp = require('gulp');
var connect = require('gulp-connect');
var markdownToJson = require('gulp-markdown-to-json');
var rename = require('gulp-rename');
var wrap = require('gulp-wrap');
var htmlmin = require("gulp-htmlmin");
var imagemin = require("gulp-imagemin");

var paths = {
    articles: 'src/**/*.md',
    articleTemplate: 'src/articles/_template.html',
    assets: ['src/**/*', '!src/**/*.md', '!src/articles/_template.html'],
    html: "src/*.html",
    img: "src/**/*.*",
    dist: {
        html: "dist/*.html",
        img: "src/**/*.*"
    }
};

// Compile articles
gulp.task('articles', function () {
    return gulp.src(paths.articles)
        .pipe(markdownToJson())
        .pipe(wrap({
            src: './src/articles/_template.html'
        }))
        .pipe(rename({
            basename: 'index',
            extname: '.html'
        }))
        .pipe(connect.reload())
        .pipe(gulp.dest('dist'));
});

// Copy static assets
gulp.task('assets', function () {
    return gulp.src(paths.assets)
        .pipe(connect.reload())
        .pipe(gulp.dest('dist'));
});

// Common build task
gulp.task("build", ["articles", "assets", "build-html", "build-img"]);

gulp.task("build-html", function() {
    gulp.src(paths.html)
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(paths.dist.html));
});

gulp.task("build-img", function() {
    gulp.src(paths.img)
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(paths.dist.img));
});

// Track file changes
gulp.task('watch', function () {
    gulp.watch([paths.articles, paths.articleTemplate], ['articles']);
    gulp.watch(paths.assets, ['assets']);
});

// Start a local server
gulp.task('start', ['build'], function () {
    connect.server({
        root: 'dist',
        livereload: true,
        port: 8080
    });
});

gulp.task('default', ['build', 'watch', 'start']);