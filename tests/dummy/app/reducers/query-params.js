var initialState = {
  all: []
};

export default ((state, action) => {
  if(action.type === 'SET_QUERY_PARAMS') {
    return {
      all: action.queryParams
    };
  }
  return state || initialState;
});
