export default ((state=0, action) => {
  if(action.type === 'UP') {
    return state + 1;
  }
  return state;
});
