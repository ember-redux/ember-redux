import Ember from 'ember';

const {
    computed: { readOnly },
    defineProperty,
    inject: { service },
    run
} = Ember;

export default function connect(mapStateToComputed = () => ({}), mapDispatchToActions = () => ({})) {

    return function wrapWithConnect(WrappedComponent) {

        const mapDispatch = function(dispatch) {
            let actions = [];
            Object.keys(mapDispatchToActions(dispatch)).forEach(function(key) {
                actions.push(key);
            });
            return actions;
        };

        return WrappedComponent.extend({

            redux: service(),

            /**
             * Prepare the wrapped component.
             *
             * Get the initial state from redux and compute the desired properties.
             * Transform the resulting object to private properties that we can
             * update internally, then create public "read-only" aliases for the
             * user to use.
             */
            init() {
                const redux = this.get('redux');

                // Compute and set private properties based on current state
                const props = this.updateProps(redux.getState());

                // Set public read-only aliases for the private component properties
                Object.keys(props).forEach(key => {
                    defineProperty(this, key, readOnly(this.getPrivateKey(key)));
                });

                // If we have added properties, subscribe to future updates
                if (Object.keys(props).length > 0 && !this.unsubscribe) {
                    this.unsubscribe = redux.subscribe(() => {
                        run(() => {
                            this.updateProps(redux.getState());
                        });
                    });
                }

                // Set up actions
                this['actions'] = Ember.$.extend({}, this['actions']);
                const dispatch = mapDispatch(redux.dispatch.bind(redux));
                dispatch.forEach(action => {
                    this['actions'][action] = mapDispatchToActions(redux.dispatch.bind(redux))[action];
                });

                this._super(...arguments);
            },

            /**
             * Transform a key into it's private equivalent by prepending an underscore.
             */
            getPrivateKey(key) {
                return `_${key}`;
            },

            /**
             * Transform properties' state into a private component state object.
             *
             * Example:
             *
             * transformPropsToPrivate({ users: [] }) => { _users: [] }
             */
            transformPropsToPrivate(props) {
                // Transform object to new object with private keys
                return Object.keys(props).reduce((privateState, key) => {
                    return Object.assign(privateState, {
                        [this.getPrivateKey(key)]: props[key]
                    });
                }, {});
            },

            /**
             * Update the (private) properties with the given state.
             *
             * The provided state is run through the user-provided `mapStateToComputed`
             * function.  The resulting props object is then transformed into its
             * "private" equavalent and set on the component as private properties.
             *
             * Returns the props object.
             */
            updateProps(state) {
                const props = mapStateToComputed(state);
                this.setProperties(this.transformPropsToPrivate(props));
                return props;
            },

            /**
             * Unsubscribe from redux updates.
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
}
