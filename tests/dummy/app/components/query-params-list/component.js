import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';

var stateToComputed = (state) => {
  return {
    queryParams: state.queryParams.all,
    transitionMsg: state.models.transition
  };
};

var QueryParamsListComponent = Ember.Component.extend({
  layout: hbs`
    {{#each queryParams as |queryParam|}}
      <div class="query-param-name">{{queryParam}}</div>
    {{/each}}
    {{outlet}}
  `
});

export default connect(stateToComputed)(QueryParamsListComponent);
