import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

export default Ember.Component.extend({
  layout: hbs`
    {{#each items as |item|}}
      <div class="item-name">{{item.name}}</div>
      {{#each item.reviews as |review|}}
        <span class="item-rating">{{review.rating}}</span>
      {{/each}}
    {{/each}}
  `
});
