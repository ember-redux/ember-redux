import {uniq} from 'dummy/utilities/array';

const initialState = {
  all: [],
  selected: null
};

export default ((state=initialState, action) => { // jshint ignore:line
  if (action.type === 'DESERIALIZE_ITEMS') {
    return Object.assign({}, state, {
      all: uniq(state.all, action.response)
    });
  }
  if (action.type === 'DESERIALIZE_ITEM') {
    return Object.assign({}, state, {
      all: uniq(state.all, action.response),
      selected: action.response
    });
  }
  if (action.type === 'ITEM_NAME_UPDATED') {
    var item = Object.assign({}, state.selected, {name: action.name});
    return Object.assign({}, state, {
      all: uniq(state.all, item),
      selected: item
    });
  }
  return state;
});
