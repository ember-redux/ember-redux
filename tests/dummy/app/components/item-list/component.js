import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';

var stateToComputed = (state) => {
  return {
    items: state.items.all,
    transitionMsg: state.models.transition
  };
};

var ItemListComponent = Component.extend({
  layout: hbs`
    <div id="after-model-transition">{{this.transitionMsg}}</div>
    {{#each this.items as |item|}}
      <div class="item-name">{{item.name}}</div>
      <LinkTo @route="items.detail" @model={{item.id}} class="item-detail-link">details</LinkTo>
    {{/each}}
    {{outlet}}
  `
});

export default connect(stateToComputed)(ItemListComponent);
