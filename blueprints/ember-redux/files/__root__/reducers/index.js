import { combineReducers } from 'npm:redux';

/**
 * This is the master reducer, it partitions the jobs amounts
 * one or more other reducers which take on responsibility for
 * a discrete part of the state tree.
 *
 * Use the "ember generate reducer" command to create additional
 * reducers. Alternatively, if you have a very simple state model,
 * you can remove references to combineReducers and just have all
 * reducer types be handled here.
 */

// import foo from './foo';
// import bar from './bar';

export default combineReducers({
  //foo,
  //bar
});
