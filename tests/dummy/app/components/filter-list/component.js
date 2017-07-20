import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  layout: hbs`
    <button class="filter-list" onclick={{action filter value}}>filter</button>
  `
});
