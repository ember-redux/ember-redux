import { uniq } from 'dummy/utilities/array';

const initialState = {
  all: [],
  selected: null
};

export default ((state=initialState, action) => {
  if (action.type === 'DESERIALIZE_USERS') {
    return Object.assign({}, state, {
      all: uniq(state.all, action.response)
    });
  }
  if (action.type === 'DESERIALIZE_USER') {
    return Object.assign({}, state, {
      all: uniq(state.all, action.response),
      selected: action.response
    });
  }
  return state;
});
