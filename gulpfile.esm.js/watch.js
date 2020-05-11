import { watch } from 'gulp';
import document from './document';
import style from './style';
import script from './script';

const watcher = () => {
  watch('./src/**/*.html', document);
  watch('./src/**/*.scss', style);
  watch('./src/**/*.js', script);
};

export default watcher;
