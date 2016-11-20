const initialState = {
  transition: 'notOk',
};

export default ((state=initialState, action) => { // jshint ignore:line
  if (action.type === 'AFTER_MODEL') {
    return Object.assign({}, state, {
      transition: action.transition
    });
  }
  return state;
});
