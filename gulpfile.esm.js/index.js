import { parallel, series } from 'gulp';
// import document from './document';
import copy from './copy';
import style from './style';
import script from './script';
import watch from './watch';

const build = parallel(copy, style, script);

export { build, copy, script, watch };

export default series(build, watch);
