import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';

var stateToComputed = (state) => {
  return {
    items: state.items.all
  };
};

var ItemListComponent = Ember.Component.extend({
  layout: hbs`
    {{#each items as |item|}}
      <div class="item-name">{{item.name}}</div>
      {{#link-to 'items.detail' item.id class='item-detail-link'}}details{{/link-to}}
    {{/each}}
    {{outlet}}
  `
});

export default connect(stateToComputed)(ItemListComponent);
