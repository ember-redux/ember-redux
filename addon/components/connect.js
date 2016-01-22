import Ember from 'ember';

const { computed, defineProperty } = Ember;

var connect = function(mapStateToComputed, mapDispatchToActions) {
    var shouldSubscribe = Boolean(mapStateToComputed);
    var finalMapStateToComputed = mapStateToComputed || function() {return {};};
    var finalMapDispatchToActions = mapDispatchToActions || function() {return {};};
    return function wrapWithConnect(WrappedComponent) {
        var mapState = function(state) {
            var props = [];
            Object.keys(finalMapStateToComputed(state)).forEach(function(key) {
                props.push(key);
            });
            return props;
        };
        var mapDispatch= function(dispatch) {
            var actions = [];
            Object.keys(finalMapDispatchToActions(dispatch)).forEach(function(key) {
                actions.push(key);
            });
            return actions;
        };
        return WrappedComponent.extend({
            store: Ember.inject.service('redux'),
            init() {
                var component = this;
                component['actions'] = Ember.$.extend({}, component['actions']);
                var store = this.get('store');
                var props = mapState(store.getState());
                var dispatch = mapDispatch(store.dispatch);
                props.forEach(function(name) {
                    defineProperty(component, name, computed(function() {
                        return finalMapStateToComputed(store.getState())[name];
                    }).property());
                });
                dispatch.forEach(function(action) {
                    component['actions'][action] = finalMapDispatchToActions(store.dispatch)[action];
                });
                if (shouldSubscribe && !this.unsubscribe) {
                    this.unsubscribe = store.subscribe(() => {
                        props.forEach(function(name) {
                            component.notifyPropertyChange(name);
                        });
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
