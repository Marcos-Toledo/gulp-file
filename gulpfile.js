const { src, dest, parallel, watch } = require('gulp');
const browserSync = require('browser-sync').create();

const server = () => {
  browserSync.init({
    server: {
      baseDir: './src'
    }
  });

  watch('./src/*html').on('change', browserSync.reload);
}

exports.default = parallel(server);