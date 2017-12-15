var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');

var app = {
    srcPath: 'src/',
    prdPath: 'dist/'
}

gulp.task('lib', function () {
    gulp.src('bower_components/**/*')
        .pipe(gulp.dest(app.prdPath + 'lib'))
        .pipe($.connect.reload());
})

gulp.task('html', function () {
    gulp.src(app.srcPath + '*.html')
        .pipe(gulp.dest(app.prdPath))
        .pipe($.connect.reload());
});

gulp.task('js', function () {
    gulp.src(app.srcPath + 'script/*.js')
        .pipe(gulp.dest(app.prdPath + 'script'))
        .pipe($.connect.reload());
})

gulp.task('css', function () {
    gulp.src(app.srcPath + 'style/*.css')
        .pipe(gulp.dest(app.prdPath + 'style'))
        .pipe($.connect.reload());
})

gulp.task('build', ['lib', 'html', 'js', 'css']);

gulp.task('clean', function () {
    gulp.src([app.prdPath])
        .pipe($.clean());
})

gulp.task('serve', ['build'], function () {
    $.connect.server({
        root: [app.prdPath],
        livereload: true,
        port: 5000
    })
    open('http://localhost:5000');
    //监控
    gulp.watch('bower_components/**/*', ['lib']);
    gulp.watch(app.srcPath + '*.html', ['html']);
    gulp.watch(app.srcPath + 'script/*.js', ['js']);
    gulp.watch(app.srcPath + 'style/*.css', ['css']);
})

gulp.task('default', ['serve']);
