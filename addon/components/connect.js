import Ember from 'ember';
import { bindActionCreators } from 'redux';

const {
  assert,
  computed,
  defineProperty,
  getProperties,
  guidFor,
  inject: { service },
  run
} = Ember;

/**
  Returns a list of keys that have different values between the two objects.

  @method changedKeys
  @return {Array} keys that have changed
  @private
*/
function changedKeys(state, newState) {
  return Object.keys(state).filter(key => {
    return state[key] !== newState[key];
  });
}

/**
  Creates a read-only computed property for accessing redux state.

  @method computedReduxProperty
  @return {Function} an Ember computed property
  @private
*/
function computedReduxProperty(key, getState) {
  return computed({
    get: () => getState()[key],
    set: () => assert(`Cannot set redux property "${key}". Try dispatching a redux action instead.`)
  });
}

/**
  Return an object of attrs passed to this Component.

  `Component.attrs` is an object that can look like this:

    {
      myAttr: {
        value: 'myValue'
      }
    }

  Ember provides that a `get` will return the value:

    this.get('myAttr') === 'myValue'

  @method getAttrs
  @return {Object} an object of key, value for each attr
  @private
*/
function getAttrs(context) {
  const attrKeys = Object.keys(context.attrs || {});
  return getProperties(context, attrKeys);
}

/**
  A hash that has keys that are guids for a particular component instance
  that stores the `handleChange` and `unsubscribe` methods for that
  component so that they can be used in the component's lifecycle hooks
  without exposing them to the wrapped component.

  @type {Object}
*/
const hooksForComponent = {};

export default (stateToComputed, dispatchToActions) => {
  return Component => {
    return Component.extend({
      redux: service(),

      init() {
        const redux = this.get('redux');

        if (stateToComputed) {
          const getState = () => stateToComputed.call(this, redux.getState(), getAttrs(this));

          let state = getState();

          Object.keys(state).forEach(key => {
            defineProperty(this, key, computedReduxProperty(key, () => state));
          });

          const handleChange = () => {
            const newState = getState();
            if (newState === state) return;

            const propsToNotify = changedKeys(state, newState);

            state = newState;

            if (propsToNotify.length > 0) {
              run.join(() => {
                propsToNotify.forEach(key => this.notifyPropertyChange(key));
              });
            }
          };

          const unsubscribe = redux.subscribe(handleChange);

          hooksForComponent[guidFor(this)] = { handleChange, unsubscribe };
        }

        if (typeof dispatchToActions === 'function') {
          this.actions = Object.assign({},
            this.actions, dispatchToActions.call(this, redux.dispatch.bind(redux))
          );
        }

        if (typeof dispatchToActions === 'object') {
          this.actions = Object.assign({},
            this.actions, bindActionCreators(dispatchToActions, redux.dispatch.bind(redux)));
        }

        this._super(...arguments);
      },

      didUpdateAttrs() {
        this._super(...arguments);

        const hooks = hooksForComponent[guidFor(this)];
        if (hooks) {
          hooks.handleChange();
        }
      },

      willDestroy() {
        this._super(...arguments);

        const hooks = hooksForComponent[guidFor(this)];
        if (hooks) {
          hooks.unsubscribe();
          delete hooksForComponent[guidFor(this)];
        }
      }
    });
  };
};
