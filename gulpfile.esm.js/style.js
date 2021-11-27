import { dest, src } from 'gulp';
import gulpSass from 'gulp-sass';
// import Fiber from 'fibers';
import compiler from 'sass';
import postcss from 'gulp-postcss';
import clean from 'postcss-clean';
// import autoprefixer from 'autoprefixer';

// sass.compiler = compiler;

const sass = gulpSass(compiler);

const style = () => {
  return src('./src/*.scss')
    .pipe(sass({
      precision: 10
    }).on('error', sass.logError))
    .pipe(
      postcss([
        // autoprefixer(),
        clean({
          restructuring: false,
        }),
      ]),
    )
    .pipe(dest('./dist'));
};

export default style;
