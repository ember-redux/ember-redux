import Ember from 'ember';

const { computed: { readOnly }, defineProperty, run } = Ember;

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
      redux: Ember.inject.service('redux'),
      init() {
        var component = this;
        component['actions'] = Ember.$.extend({}, component['actions']);
        var redux = this.get('redux');
        var props = mapState(redux.getState());
        var dispatch = mapDispatch(redux.dispatch.bind(redux));
        // Create a private object to hold private properties
        this.set('_props', Ember.Object.create());
        // Compute and set private properties based on current state
        this.updateProps(redux.getState());
        // Set public read-only aliases to the private properties
        props.forEach(function(name) {
          defineProperty(component, name, readOnly(`_props.${name}`));
        });
        dispatch.forEach(function(action) {
          component['actions'][action] = finalMapDispatchToActions(redux.dispatch.bind(redux))[action];
        });
        if (shouldSubscribe && !this.unsubscribe) {
          this.unsubscribe = redux.subscribe(() => {
            run(() => {
              this.updateProps(redux.getState());
            });
          });
        }
        this._super(...arguments);
      },
      updateProps(state) {
        var props = finalMapStateToComputed(state);
        this.get('_props').setProperties(props);
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

export default connect;
