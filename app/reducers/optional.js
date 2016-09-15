// WARNING: this has been deprecated; use state-initializers or middleware instead
export const defaultFunction = true;

export default function(combine) {
  return (state, action) => {
    return combine(state, action);
  };
};
