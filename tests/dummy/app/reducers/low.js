export default ((state=0, action) => {
  if(action.type === 'UP') {
    return state + 1;
  }
  if(action.type === 'UPP') {
    return state + action.number;
  }
  return state;
});
