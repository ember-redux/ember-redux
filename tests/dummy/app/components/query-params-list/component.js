import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';

var stateToComputed = (state) => {
  return {
    queryParams: state.queryParams.all,
    transitionMsg: state.models.transition
  };
};

var QueryParamsListComponent = Component.extend({
  layout: hbs`
    {{#each this.queryParams as |queryParam|}}
      <div class="query-param-name">{{queryParam}}</div>
    {{/each}}
    {{outlet}}
  `
});

export default connect(stateToComputed)(QueryParamsListComponent);
