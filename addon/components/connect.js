import Ember from 'ember';
import { bindActionCreators } from 'redux';

const {
  assert,
  computed,
  defineProperty,
  inject: { service },
  run
} = Ember;

/**
  Creates a read-only computed property for accessing redux state.

  @method computedReduxProperty
  @return {Function} an Ember computed property
  @private
*/
function computedReduxProperty(key, getProps) {
  return computed({
    get: () => getProps()[key],
    set: () => assert(`Cannot set redux property "${key}". Try dispatching a redux action instead.`)
  });
}

export default (stateToComputed, dispatchToActions=() => ({})) => {
  return Component => {
    return Component.extend({
      redux: service(),

      init() {
        const redux = this.get('redux');

        if (stateToComputed) {
          const getProps = () => stateToComputed.call(this, redux.getState(), this.getAttrs());
          let props = getProps();

          Object.keys(props).forEach(key => {
            defineProperty(this, key, computedReduxProperty(key, () => props))
          });

          this._handleChange = () => {
            const newProps = getProps();
            if (props === newProps) return;

            const notifyProperties = Object.keys(props).filter(name => {
              return props[name] !== newProps[name];
            });

            props = newProps;

            if (notifyProperties.length > 0) {
              run.join(() => {
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

        this._super(...arguments);
      },

      handleChange() {
        Ember.warn(
          'The ember-redux `handleChange` method is private and may be removed in a future version.',
          false,
          { id: 'ember-redux.no-public-handle-change' }
        );

        if (this._handleChange) {
          return this._handleChange();
        }
      },

      /**
       * Return an object of attrs passed to this Component.
       *
       * `Component.attrs` is an object that can look like this:
       *
       *   {
       *     myAttr: {
       *       value: 'myValue'
       *     }
       *   }
       *
       * Ember provides that a `get` will return the value:
       *
       *   this.get('myAttr') === 'myValue'
       *
       * @method getAttrs
       * @private
       */
      getAttrs() {
        return this.getProperties(Object.keys(this.attrs || {}));
      },

      didUpdateAttrs() {
        this._super(...arguments);
        if (this._handleChange) {
          this._handleChange();
        }
      },

      willDestroy() {
        this._super(...arguments);
        if (this.unsubscribe) {
          this.unsubscribe();
          this.unsubscribe = null;
        }
      }
    });
  };
};
