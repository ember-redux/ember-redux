import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  layout: hbs`
    {{#each items as |item|}}
      <div class="item-name">{{item.name}}</div>
      {{#each item.reviews as |review|}}
        <span class="item-rating">{{review.rating}}</span>
      {{/each}}
    {{/each}}
    <span class="fake-value">{{fake}}</span>
  `
});
