import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  layout: hbs`
    <span class="child-state">{{high}}</span>
    <button class="btn-down" onclick={{down}}>down</button>
  `
});
