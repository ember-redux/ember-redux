import Ember from 'ember';

const {
  computed: { readOnly },
  defineProperty,
  inject: { service },
  isEmpty,
  run
} = Ember;

/**
 * Modifies a Component by mapping redux state and dispatch to its properties
 * and actions respectively.
 *
 * ```javascript
 * const stateToComputed = (state) => {
 *   return { all: state.all };
 * }
 * const dispatchToActions = (dispatch) => {
 *   return { more: dispatch({ type: 'MORE' }) };
 * }
 * const MyComponent = Ember.Component.extend();
 *
 * export default connect(MyComponent, stateToComputed, dispatchToActions);
 * ```
 *
 * @function connect
 * @param {Ember.Component} Component the Ember component to be connected
 * @param {function} stateToComputed A function that maps redux state to an
 *   object of desired properties that will be added to the component
 * @param {function} dispatchToActions A function that maps component
 *   actions to redux dispatch
 * @returns {Ember.Component} The original component with mapped properties
 *   and actions
 */
export default function connect(Component, stateToComputed = () => ({}), dispatchToActions = () => ({})) {

  return Component.extend({

    redux: service(),

    /**
     * Prepare the wrapped the component.
     *
     * Get the initial state from redux and compute the desired properties.
     * Store the properties on a private `_props` property, then create
     * public read-only aliases for the user to use.
     *
     * @method init
     */
    init() {
      const redux = this.get('redux');

      // Create an empty private object to hold properties
      this.set('_props', Ember.Object.create());
      // Compute and set private properties based on current state
      let propNames = Object.keys(this.updateProps(redux.getState()));
      if (!isEmpty(propNames)) {
        // Set public read-only aliases to the private properties
        propNames.forEach(name => {
          defineProperty(this, name, readOnly(`_props.${name}`));
        });
        // Subscribe to future updates
        this.unsubscribe = redux.subscribe(() => {
          run(() => {
            this.updateProps(redux.getState());
          });
        });
      }

      // Set up actions
      this.actions = Object.assign({},
        this.actions, dispatchToActions(redux.dispatch.bind(redux))
      );

      this._super(...arguments);
    },

    /**
     * Update the private properties object with the given state.
     *
     * The state is run through the user-provided `stateToComputed` function.
     * The resulting properties are set on the components `_props` property.
     *
     * @method updateProps
     * @param {Object} state the current state of the application (ala redux)
     * @returns {Object} the properties that were set on the component
     */
    updateProps(state) {
      var props = stateToComputed(state);
      return this.get('_props').setProperties(props);
    },

    willDestroy() {
      this._super(...arguments);
      // Disconnect the redux subscription, if applicable
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
    }
  });
}
