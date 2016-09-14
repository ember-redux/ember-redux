// __name__ REDUCER

var reducer = (state, action) => {

  switch(action.type) {

    case 'ADD':
      return state + 1;
    case 'SUBTRACT':
      return state - 1;

    default:
      return state;
  } // end switch

};

export default reducer;
