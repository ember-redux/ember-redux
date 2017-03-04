import Ember from 'ember';

const {
  computed,
  defineProperty,
  inject: { service },
  isEmpty,
  run
} = Ember;

export default (stateToComputed, dispatchToActions=() => ({})) => {

  if (!stateToComputed) {
    stateToComputed = () => ({});
  }

  return Component => {

    return Component.extend({

      redux: service(),

      init() {
        const redux = this.get('redux');

        let props = stateToComputed.call(this, redux.getState(), this.getAttrs());

        Object.keys(props).forEach(name => {
          defineProperty(this, name, computed(() =>
            props[name]
          ).property().readOnly());
        });

        if (!isEmpty(Object.keys(props))) {
          this.unsubscribe = redux.subscribe(() => {
            this.handleChange();
          });
        }

        this.actions = Object.assign({},
          this.actions, dispatchToActions.call(this, redux.dispatch.bind(redux))
        );

        this._super(...arguments);
      },

      handleChange() {
        const redux = this.get('redux');

        const props = stateToComputed.call(this, redux.getState(), this.getAttrs());

        const notifyProperties = Object.keys(props).filter(name => {
          return this.get(name) !== props[name];
        });

        if (notifyProperties.length > 0) {
          run.join(() => {
            notifyProperties.forEach(name => this.notifyPropertyChange(name));
          });
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
        this.handleChange();
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
