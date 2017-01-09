export default ((state=3, action) => {
  if(action.type === 'MORE') {
    return state + 1;
  }
  return state;
});
