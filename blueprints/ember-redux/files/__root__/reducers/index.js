/**
 * This is the master reducer, it partitions the jobs amounts
 * one or more other reducers which take on responsibility for
 * a discrete part of the state tree.
 *
 * Use the "ember generate reducer [name]" command to create additional
 * reducers (and "ember destroy" to remove).
 *
 * Alternatively, if you have a very simple state model, you can just use
 * this file as the single reducer used by the store.
 *
 * Note: only VERY small applications should be managed by a single
 * reducer file.
 */
const defaultState = {};

const reducer = (state, action) => {
  return defaultState;
}
