// https://gulpjs.com/
// https://www.npmjs.com/package/gulp-sass
// https://www.npmjs.com/package/gulp-autoprefixer
// https://www.browsersync.io/docs/gulp
// https://github.com/fmarcia/UglifyCSS

const { src, dest, parallel, watch } = require('gulp'),
      sass = require('gulp-sass'),
      uglifycss = require('gulp-uglifycss'),
      autoprefixer = require('gulp-autoprefixer')
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
    .pipe(dest('./app/dest/assets/stylesheets/'))
    .pipe(browserSync.stream())
}

const server = () => {
  browserSync.init({
    server: {
      baseDir: './app'
    }
  });

  watch('./app/src/scss/**/*.scss', style);
  watch('./app/*html').on('change', browserSync.reload);
}

exports.default = style;
exports.default = parallel(server, style);