import { parallel, series } from 'gulp';
import document from './document';
import style from './style';
import script from './script';
import watch from './watch';

const build = parallel(document, style, script);

export { build, script, watch };

export default series(build, watch);
