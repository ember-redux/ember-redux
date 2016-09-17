import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';

const stateToComputed = (state) => {
  return {
    foo: state.foo
  }
};

const dispatchToActions = (dispatch) => {
  return {
    bar: (id) => id
  }
};

const ReduxContainerComponent = Ember.component.extend({
  layout: hbs`
    {{yield foo (action 'bar')}}
  `
});

export default connect(stateToComputed, dispatchToActions)(ReduxContainerComponent);
