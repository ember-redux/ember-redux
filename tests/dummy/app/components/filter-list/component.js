import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

export default Ember.Component.extend({
  layout: hbs`
    <button class="filter-list" onclick={{action filter value}}>filter</button>
  `
});
