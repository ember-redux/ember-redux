function bumpLow(number) {
  return {
    type: 'UPP',
    number: number
  }
}

export function bumpTwice(number) {
  return function (dispatch, getState) {
    if (getState().low > 1) {
      return;
    }
    dispatch(bumpLow(number));
  }
}
