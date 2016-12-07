import Ember from 'ember';

const {
  computed,
  defineProperty,
  inject: { service },
  isEmpty,
  run,
  beginPropertyChanges,
  endPropertyChanges
} = Ember;

export default (stateToComputed=() => ({}), dispatchToActions=() => ({})) => {

  return Component => {

    return Component.extend({

      redux: service(),

      init() {
        const redux = this.get('redux');

        let props = stateToComputed(redux.getState(), this.getAttrs());

        Object.keys(props).forEach(name => {
          defineProperty(this, name, computed(() =>
            stateToComputed(redux.getState(), this.getAttrs())[name]
          ).property().readOnly());
        });

        if (!isEmpty(Object.keys(props))) {
          this.unsubscribe = redux.subscribe(() => {
            run(() => this.handleChange());
          });
        }

        this.actions = Object.assign({},
          this.actions, dispatchToActions(redux.dispatch.bind(redux))
        );

        this._super(...arguments);
      },

      handleChange() {
        const redux = this.get('redux');

        let props = stateToComputed(redux.getState(), this.getAttrs());

        beginPropertyChanges();
        Object.keys(props).forEach(name => {
          if (this.get(name) !== props[name]) {
            this.notifyPropertyChange(name);
          }
        });
        endPropertyChanges();
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
