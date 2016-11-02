import Ember from 'ember';
import shallowEqual from '../-private/equal';

const { computed, defineProperty } = Ember;

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
                this._localState = state;
                Object.keys(state).forEach(key => {
                    defineProperty(component, key, computed(function() {
                        return this._localState[key];
                    }).readOnly());
                });

                if (shouldSubscribe && !this.unsubscribe) {
                    this.unsubscribe = redux.subscribe(() => this.handleChange());
                }

                this._super(...arguments);
            },

            handleChange() {
                const redux = this.get('redux');
                const oldState = this._localState;
                const newState = finalMapStateToComputed(redux.getState());

                if (!shallowEqual(oldState, newState)) {
                  this.updateProps(newState);
                  this._localState = newState;
                }
            },

            updateProps(newState) {
                Object.keys(newState).forEach(key => {
                    this.notifyPropertyChange(key);
                });
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
