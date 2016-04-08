import thunk from 'npm:redux-thunk';

// Thunk 2.x exports on a default key.
const resolvedThunk = thunk.__esModule ? thunk.default : thunk;

export default [thunk];
