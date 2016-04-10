import thunk from 'npm:redux-thunk';

var resolved = thunk.default ? thunk.default : thunk;

export default [resolved];
