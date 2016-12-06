import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';

const { Component } = Ember;

const stateToComputed = state => {
  return {
    project: state.project
  };
};

const ProjectDetailComponent = Component.extend({
  layout: hbs`
  {{project-edit project=project}}
  `
});

export default connect(stateToComputed)(ProjectDetailComponent);
