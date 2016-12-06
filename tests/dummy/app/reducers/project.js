const initialState = {
  name: 'Chores'
};

export default (state=initialState, action) => { // jshint ignore:line
  if (action.type === 'UPDATE_PROJECT') {
    return Object.assign(state, action.data);
  }
  return state;
};
