import { watch } from 'gulp';
import copy from './copy';
import style from './style';
import script from './script';

const watcher = () => {
  watch('./src/**/*.{html,woff,woff2}', copy);
  watch('./src/**/*.scss', style);
  watch('./src/**/*.js', script);
};

export default watcher;
