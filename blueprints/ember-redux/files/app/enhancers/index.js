import { compose } from 'redux';
var devtools = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f;
export default compose(devtools);
