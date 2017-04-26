import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';

var stateToComputed = (state) => {
  return {
    items: state.items.all,
    transitionMsg: state.models.transition
  };
};

var ItemListComponent = Ember.Component.extend({
  layout: hbs`
    <div id="after-model-transition">{{transitionMsg}}</div>
    {{#each items as |item|}}
      <div class="item-name">{{item.name}}</div>
      {{#link-to 'items.detail' item.id class='item-detail-link'}}details{{/link-to}}
    {{/each}}
    {{outlet}}
  `
});

export default connect(stateToComputed)(ItemListComponent);
