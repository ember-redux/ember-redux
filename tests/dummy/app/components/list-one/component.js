import Component from '@ember/component';
import ajax from 'dummy/utilities/ajax';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';
import filterRating from 'dummy/utilities/filter';

var stateToComputed = (state) => {
  return {
    items: filterRating(state.list.all, state.list.filter),
    fake: state.list.fake,
    contextt: state.list.contextt
  };
};

var dispatchToActions = function(dispatch) {
  var component = this;
  return {
    filter: (filter) => dispatch({type: 'FILTER_LIST', filter: filter}),
    refresh: () => ajax('/api/lists', 'GET').then(response => dispatch({type: 'TRANSFORM_LIST', response: response})),
    update: () => dispatch({type: 'UNRELATED_UPDATE'}),
    random: () => dispatch({type: 'RANDOM_UPDATE'}),
    faked: () => dispatch({type: 'FAKE_UPDATE'}),
    context: () => dispatch({type: 'THIS_CONTEXT_EXAMPLE', value: component.get('valuee')})
  };
};

var ListOneComponent = Component.extend({
  valuee: 'abc123',
  layout: hbs`
    {{yield this.items this.fake this.contextt (action "filter") (action "refresh") (action "update") (action "random") (action "faked") (action "context")}}
  `
});

export default connect(stateToComputed, dispatchToActions)(ListOneComponent);
