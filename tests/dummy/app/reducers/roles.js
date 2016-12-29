import {uniq} from 'dummy/utilities/array';

const initialState = {
  all: []
};

export default ((state=initialState, action) => {
  if (action.type === 'ADD_ROLES') {
    return Object.assign({}, state, {
      all: uniq(state.all, action.roles)
    });
  }
  return state;
});
