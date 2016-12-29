export default ((state=9, action) => {
  if(action.type === 'DOWN') {
    return state - 1;
  }
  return state;
});
