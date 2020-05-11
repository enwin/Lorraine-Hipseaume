import { dest, src } from 'gulp';
import sass from 'gulp-sass';
import Fiber from 'fibers';
import compiler from 'sass';
import postcss from 'gulp-postcss';
import clean from 'postcss-clean';
// import autoprefixer from 'autoprefixer';

sass.compiler = compiler;

const style = () => {
  return src('./src/*.scss')
    .pipe(sass({ fiber: Fiber }).on('error', sass.logError))
    .pipe(
      postcss([
        // autoprefixer(),
        clean({
          restructuring: false,
        }),
      ]),
    )
    .pipe(dest('./.dist'));
};

export default style;
