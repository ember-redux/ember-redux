import { notifyPropertyChange, get, defineProperty } from '@ember/object';
import { inject } from '@ember/service';
import { bindActionCreators } from 'redux';
import { assert } from '@ember/debug';

function changedKeys(props, newProps) {
  return Object.keys(props).filter(key => {
    return props[key] !== newProps[key];
  });
}

function wrapStateToComputed(stateToComputed) {
  return function(...args) {
    const result = stateToComputed.call(this, ...args);
    if (typeof result === 'function') {
      return result.call(this, ...args);
    }
    return result;
  };
}


function createProperty(getProps, name) {
  let descriptor = {
    enumerable: true,
    configurable: false,
    set() {
      assert(`Cannot set redux property "${name}". Try dispatching a redux action instead.`);
    },
    get() {
      return getProps()[name];
    }
  };
  Object.defineProperty(this, name, descriptor);
}

export default function octaneConnect(stateToComputed, dispatchToActions, WrappedComponent) {

  defineProperty(WrappedComponent.prototype, 'redux', inject('redux'));

  return class Connect extends WrappedComponent {

    constructor() {
      super(...arguments);
      const redux = get(this, 'redux');

      if (stateToComputed) {
        const wrappedStateToComputed = wrapStateToComputed(stateToComputed);

        const getProps = () => wrappedStateToComputed.call(this, redux.getState(), this.args);

        let props = getProps();

        Object.keys(props).forEach(name => {
          createProperty.call(this, getProps, name);
        });

        this._handleChange = () => {
          let newProps = getProps();

          if (props === newProps) return;

          let notifyProperties = changedKeys(props, newProps);

          props = newProps;
          notifyProperties.forEach(name => notifyPropertyChange(this, name));
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
          this.actions, bindActionCreators(dispatchToActions, redux.dispatch.bind(redux))
        );
      }
    }

    willDestroy() {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
    }
  }
}
