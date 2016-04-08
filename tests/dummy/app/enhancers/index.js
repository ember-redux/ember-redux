export default function(...funcs) {
  return (...args) => {
    window.executed = true;
    return funcs[funcs.length - 1](...args);
  };
}
