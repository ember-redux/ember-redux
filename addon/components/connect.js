import Ember from 'ember';

var connect = function(mapStateToComputed, mapDispatchToActions) {
    var shouldSubscribe = Boolean(mapStateToComputed);
    var finalMapStateToComputed = mapStateToComputed || function() {return {};};
    var finalMapDispatchToActions = mapDispatchToActions || function() {return {};};
    return function wrapWithConnect(WrappedComponent) {
        var mapDispatch = function(dispatch) {
            var actions = [];
            Object.keys(finalMapDispatchToActions(dispatch)).forEach(function(key) {
                actions.push(key);
            });
            return actions;
        };
        return WrappedComponent.extend({
            redux: Ember.inject.service('redux'),

            init() {
                var component = this;
                var redux = this.get('redux');

                // Set up actions.
                var dispatch = mapDispatch(redux.dispatch.bind(redux));
                component['actions'] = Ember.$.extend({}, component['actions']);
                dispatch.forEach(function(action) {
                    component['actions'][action] = finalMapDispatchToActions(redux.dispatch.bind(redux))[action];
                });

                // Set up properties.
                const state = finalMapStateToComputed(redux.getState());
                this.setProperties(state);

                if (shouldSubscribe && !this.unsubscribe) {
                    this.unsubscribe = redux.subscribe(() => {
                        const state = finalMapStateToComputed(redux.getState());
                        this.setProperties(state);
                    });
                }

                this._super(...arguments);
            },

            willDestroy() {
                if (this.unsubscribe) {
                    this.unsubscribe();
                    this.unsubscribe = null;
                }
            }
        });
    };
};

export default connect;
