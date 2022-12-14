import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  layout: hbs`
    <button class="refresh-list" onclick={{action this.refresh}}>refresh</button>
  `
});
