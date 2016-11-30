import Ember from 'ember';

const {
  computed,
  defineProperty,
  inject: { service },
  isEmpty,
  run
} = Ember;

export default (stateToComputed=() => ({}), dispatchToActions=() => ({})) => {

  return Component => {

    return Component.extend({

      redux: service(),

      init() {
        const redux = this.get('redux');

        let props = stateToComputed(redux.getState());

        Object.keys(props).forEach(name => {
          defineProperty(this, name, computed(() =>
            stateToComputed(redux.getState())[name]
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

        let props = stateToComputed(redux.getState());

        Object.keys(props).forEach(name => {
          if (this.get(name) !== props[name]) {
            this.notifyPropertyChange(name);
          }
        });
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
