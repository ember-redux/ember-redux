import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

const { Component } = Ember;

export default Component.extend({
  layout: hbs`
  <input class="project-name" value={{project.name}} oninput={{action (mut project.name) value="target.value"}}>
  `
});
