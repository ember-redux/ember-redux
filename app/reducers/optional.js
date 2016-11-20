//this is a simple pass thru that offers an extension point

export default function(combine) {
  return (state, action) => {
    return combine(state, action);
  };
};
