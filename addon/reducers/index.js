// please write your own index.js that exports legit reducers
//
// import { combineReducers } from 'redux';
// const foobar = (state, action) => {
//   //reducer code here
// };
//
// export default combineReducers({
//   foobar
// })
import { warn } from '@ember/debug';

export default function(state) {
  warn(`You haven't created a reducer yet. Place the root reducer in "app/reducers/index.js"`, null, { id: 'ember-redux.default-reducer' });

  return state;
}
