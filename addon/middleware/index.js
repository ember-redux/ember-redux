import thunk from 'redux-thunk';

var resolved = thunk.default ? thunk.default : thunk;

export default [ resolved ];
