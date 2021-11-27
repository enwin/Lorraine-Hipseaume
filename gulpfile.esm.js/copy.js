import { src, dest } from 'gulp';

const copy = () => {
  return src(['./src/**/*.{html,woff,woff2}', './src/root/**/*']).pipe(
    dest('./dist'),
  );
};

export default copy;
