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
import Ember from 'ember';

export default function(state) {
  Ember.warn(`You haven't created a reducer yet. Place the root reducer in "app/reducers/index.js"`, null, { id: 'ember-redux.default-reducer' });

  return state;
}
