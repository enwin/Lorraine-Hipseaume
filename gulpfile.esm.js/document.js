import { src, dest } from 'gulp';

const document = () => {
  return src('./src/**/*.html').pipe(dest('./.dist'));
};

export default document;
