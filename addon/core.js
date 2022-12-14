import { join } from '@ember/runloop';
import { computed, getProperties, defineProperty } from '@ember/object';
import { bindActionCreators } from 'redux';

/**
  Returns a list of keys that have different values between the two objects.

  @method changedKeys
  @return {Array} keys that have changed
  @private
  */
function changedKeys(props, newProps) {
  return Object.keys(props).filter(key => {
    return props[key] !== newProps[key];
  });
}

/**
  Creates a read-only computed property for accessing redux state.

  @method computedReduxProperty
  @return {Function} an Ember computed property
  @private
  */
function computedReduxProperty(key, getProps) {
  return computed({
    get: () => getProps()[key],
    set: () => { throw new Error(`Cannot set redux property "${key}". Try dispatching a redux action instead.`); }
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
  @private
  */
function getAttrs(context) {
  const keys = Object.keys(context.attrs || {});
  return getProperties(context, keys);
}

/**
  Return a wrapped stateToComputed function that can be used
  regardless of whether the input function is a static selector
  or a factory.

  @method wrapStateToComputed
  @private
  */
function wrapStateToComputed(stateToComputed) {
  return function(...args) {
    const result = stateToComputed.call(this, ...args);
    if (typeof result === 'function') {
      stateToComputed = result;
      return stateToComputed.call(this, ...args);
    }
    return result;
  };
}

export function core(stateToComputed, dispatchToActions) {
  const redux = this.get('redux');

  if (stateToComputed) {
    const wrappedStateToComputed = wrapStateToComputed(stateToComputed);
    const getProps = () => wrappedStateToComputed.call(this, redux.getState(), getAttrs(this));

    let props = getProps();

    Object.keys(props).forEach(key => {
      defineProperty(this, key, computedReduxProperty(key, () => props))
    });

    this._handleChange = () => {
      const newProps = getProps();
      if (props === newProps) return;

      const notifyProperties = changedKeys(props, newProps);

      props = newProps;

      if (notifyProperties.length > 0) {
        join(() => {
          notifyProperties.forEach(name => this.notifyPropertyChange(name));
        });
      }
    };

    this.unsubscribe = redux.subscribe(() => {
      this._handleChange();
    });
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
}

export function update() {
  if (this._handleChange) {
    this._handleChange();
  }
}

export function destroy() {
  if (this.unsubscribe) {
    this.unsubscribe();
    this.unsubscribe = null;
  }
}
