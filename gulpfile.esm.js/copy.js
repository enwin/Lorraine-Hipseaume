import { src, dest } from 'gulp';

const copy = () => {
  return src('./src/**/*.{html,woff,woff2}').pipe(dest('./.dist'));
};

export default copy;
