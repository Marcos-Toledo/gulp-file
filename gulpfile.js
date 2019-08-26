const { src, dest, parallel, series, watch } = require('gulp'),
      sass = require('gulp-sass'),
      rename = require('gulp-rename'),
      uglify = require('gulp-uglify'),
      concat = require('gulp-concat'),
      imagemin = require('gulp-imagemin'),
      uglifycss = require('gulp-uglifycss'),
      autoprefixer = require('gulp-autoprefixer'),
      browserSync = require('browser-sync').create();

const paths = {
  html: { watch: './app/*html' },
  style: {
    src: './app/src/scss/*.scss',
    watch: './app/src/scss/**/*.scss',
    dest: './app/assets/stylesheets/'
  },
  javascript: {
    src: [
      'node_modules/jquery/dist/jquery.min.js',
      './app/src/js/**/*.js'
    ],
    watch: './app/src/js/**/*.js',
    dest: './app/assets/javascripts'
  },
  images: {
    src: './app/src/img/*',
    dest: './app/assets/images'
  }
}

const style = () => {
  return src(paths.style.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 3 versions']
    }))
    .pipe(uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    }))
    .pipe(dest(paths.style.dest))
    .pipe(browserSync.stream())
}

const javascript = () => {
  return src(paths.javascript.src)
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(dest(paths.javascript.dest))
  .pipe(browserSync.stream())
}

const images = () => {
  return src('./app/src/img/*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(dest(paths.images.dest))
}

const server = () => {
  browserSync.init({
    server: {
      baseDir: './app'
    }
  });

  watch(paths.style.watch, style);
  watch(paths.javascript.watch, javascript);
  watch(paths.images.src, images);
  watch(paths.html.watch).on('change', browserSync.reload);
}

exports.default = series(style, javascript, images, server);