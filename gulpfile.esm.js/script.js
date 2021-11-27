import { dest, src } from 'gulp';

const script = () => {
  return src('./src/**/*.js')
    .pipe(dest('./dist'))
};

export default script;
