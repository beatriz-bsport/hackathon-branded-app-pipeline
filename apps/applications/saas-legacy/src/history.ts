// @ts-expect-error error TS7016: Could not find a declaration file for module 'history'
import { createBrowserHistory, type Location } from 'history';
const history = createBrowserHistory();

export type { Location };

export default history;
