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

export default function(combine) {
  return (state, action) => {
    return combine(state, action);
  };
}
