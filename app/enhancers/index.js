export default function(...funcs) {
  return (...args) => {
    if (funcs.length === 0) {
      return args[0];
    }
    var last = funcs[funcs.length - 1];
    return last(...args);
  };
}
