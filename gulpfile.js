const { src, dest, parallel, watch } = require('gulp'),
      sass = require('gulp-sass'),
      rename = require('gulp-rename'),
      uglify = require('gulp-uglify'),
      concat = require('gulp-concat'),
      uglifycss = require('gulp-uglifycss'),
      autoprefixer = require('gulp-autoprefixer'),
      browserSync = require('browser-sync').create();

const style = () => {
  return src('./app/src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 3 versions']
    }))
    .pipe(uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    }))
    .pipe(dest('./app/assets/stylesheets/'))
    .pipe(browserSync.stream())
}

const javascript = () => {
  return src([
    'node_modules/jquery/dist/jquery.min.js',
    './app/src/js/**/*.js'
  ])
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(dest('./app/assets/javascripts'))
  .pipe(browserSync.stream())
}

const server = () => {
  browserSync.init({
    server: {
      baseDir: './app'
    }
  });

  watch('./app/src/scss/**/*.scss', style);
  watch('./app/src/js/**/*.js', javascript);
  watch('./app/*html').on('change', browserSync.reload);
}

exports.default = style;
exports.default = javascript;
exports.default = parallel(server, style, javascript);