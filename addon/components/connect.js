import Ember from 'ember';

/**
 * @module ember-redux/components
 */

const {
  computed,
  defineProperty,
  inject: { service },
  isEmpty,
  run
} = Ember;

/**
 * Return an object of properties to be added to the Ember Component.
 *
 * If this is specified, the component will subscribe to Redux store updates.
 * Any time it updates, `stateToComputed` will be called.
 *
 * The first argument is the current state.  If `attrs` is specified as the
 * second argument, its value will be the current attrs that were passed to
 * your component.
 *
 * For example, if the component is invoked like so:
 *
 * ```handlebars
 * {{item-detail itemId=123}}
 * ```
 *
 * Then the value of the `attrs` argument will be `{ itemId: 123 }`.
 *
 * You can use that to retrieve the part of state you need, for example:
 *
 * ```javascript
 * import getItemById from '../reducers';
 *
 * const stateToComputed = (state, attrs) => {
 *   return {
 *     item: getItemById(state, attrs.itemId)
 *   };
 * };
 * ```
 *
 * `stateToComputed` will be re-evaluated any time the attrs or the
 * state change.
 *
 * @callback stateToComputed
 * @param {Object} [state] - the current Redux state
 * @param {Object} [attrs] - attrs that were passed to the Ember Component
 * @returns {Object} the desired properties to be added to the Component
 */

/**
 * Return an object of actions to be added to the Ember Component.
 *
 * The actions provided by this function will be merged with any existing
 * actions the Component already has.
 *
 * For example, if you want to set up an action to delete an item:
 *
 * ```javascript
 * const dispatchToActions = (dispatch) => {
 *   return {
 *     delete(item) { dispatch({ type: 'DELETE_ITEM', item }) }
 *   };
 * };
 * ```
 *
 * @callback dispatchToActions
 * @param {function} [dispatch] - Redux dispatch
 * @returns {Object} the desired actions to be added to the Component
 */

/**
 * Connect an Ember component to a Redux store.
 *
 * It does not modify the component class passed to it.  Instead, it returns a
 * new, connected component class for you to use.
 *
 * ```javascript
 * // components/all-items.js
 *
 * import connect from 'ember-redux/components/connect';
 *
 * const stateToComputed = (state, attrs) => {
 *   return { allItems: state.items.all };
 * };
 * const dispatchToActions = (dispatch) => {
 *   return {
 *     delete(item) { dispatch({ type: 'DELETE_ITEM', item }) }
 *   };
 * };
 * const AllItemsComponent = Ember.Component.extend({
 *   layout: hbs`
 *     <ul>
 *       {{#each allItems as |item|}}
 *         <li>
 *           <h3>{{item.name}}</h3>
 *           <button {{action "delete" item}}>Remove</button>
 *         </li>
 *       {{/each}}
 *     </ul>
 *   `
 * });
 *
 * export default connect(stateToComputed, dispatchToActions)(ItemsComponent);
 * ```
 *
 * @function connect
 * @param {function} [stateToComputed] - a function that maps redux state and
 *   component attrs to an object of desired properties that will be added to
 *   the component
 * @param {function} [dispatchToActions] - a function that maps component actions
 *   to redux dispatch calls
 * @returns {function} a new function that accepts an Ember Component and
 *   returns it with mapped properties and actions
 */
export default (stateToComputed=() => ({}), dispatchToActions=() => ({})) => {

  return Component => {

    return Component.extend({

      redux: service(),

      /**
       * Prepare the connected component.
       *
       * Get the inital state from Redux and compute the desired properties and
       * actions.  If there are properties to add, subscribe to the Redux store
       * for future updates.
       *
       * @method init
       */
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

      /**
       * Re-evaluate `stateToComputed` and notify changes (if any).
       *
       * @method handleChange
       * @private
       */
      handleChange() {
        const redux = this.get('redux');

        let props = stateToComputed(redux.getState(), this.getAttrs());

        Object.keys(props).forEach(name => {
          if (this.get(name) !== props[name]) {
            this.notifyPropertyChange(name);
          }
        });
      },

      /**
       * Return an object of attrs passed to this Component.
       *
       * `Component.attrs` is an object that can look like this:
       *
       * ```javascript
       * {
       *   myAttr: {
       *     value: 'myValue'
       *   }
       * }
       * ```
       *
       * Ember provides that a `get` will return the value:
       *
       * ```javascript
       * this.get('myAttr') === 'myValue'
       * ```
       *
       * @method getAttrs
       * @private
       */
      getAttrs() {
        return this.getProperties(Object.keys(this.attrs || {}));
      },

      /**
       * Re-evaluate if attrs for this Component change.
       */
      didUpdateAttrs() {
        this._super(...arguments);
        this.handleChange();
      },

      /**
       * Unsubscribe from the Redux store.
       */
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
