var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  livereload = require('gulp-livereload'),
  concat = require('gulp-concat'),
  nodemon = require('gulp-nodemon'),
  jade = require('gulp-jade'),
  csslint = require('gulp-csslint'),
  bower = require('gulp-bower'),
  map = require('map-stream'),
  rimraf = require('gulp-rimraf'),
  watch = require('gulp-watch');



gulp.task('dev-server', function() {
  nodemon({
      script: './bin/www',
      env: {
        'NODE_ENV': 'development'
      }
    })
    .on('restart');
});

var paths = {
  jade: ['./views/**/*.jade'],
  public: ['public/**/*.*'],
  js: ['./public/javascripts/**/*.js'],
  styles: './public/stylesheets/*.css'
};

gulp.task('scripts', function() {
  gulp.src(paths.js)
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./public/server/'));
});

gulp.task('del:scripts', function() {
  return gulp.src('./public/server/index.js', {
      read: false
    }) // much faster 
    .pipe(rimraf());
});

gulp.task('styles', function() {
  gulp.src('./public/stylesheets/*.css')
    .pipe(csslint())
    .pipe(csslint.reporter());
});

gulp.task('jade', function() {
  gulp.src(paths.jade)
    .pipe(jade())
    .on('error', function(err) {
      console.log(err.message);
    })
    .pipe(gulp.dest('./public/views/'))
    .pipe(livereload());
});

gulp.task('refresh', ['jade'], function() {
  livereload.changed();
  console.log('LiveReload is triggered');
});

gulp.task('refresh:scripts', ['scripts'], function() {
  livereload.changed();
  console.log('scripts is triggered');
});

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('public/lib/'));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(paths.js, ['del:scripts', 'scripts', 'refresh:scripts']).on('change', livereload.changed);

  gulp.watch(paths.jade, ['jade', 'refresh']).on('change', livereload.changed);

});


gulp.task('build', ['bower', 'del:scripts', 'scripts', 'jade', 'styles']);
gulp.task('production', ['build']);
gulp.task('default', ['dev-server', 'del:scripts', 'build', 'scripts', 'jade', 'styles', 'watch']);
gulp.task('heroku:production', ['build']);
