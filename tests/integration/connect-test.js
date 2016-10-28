import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('count-list', 'integration: connect test', {
    integration: true,
    setup() {
        this.inject.service('redux');
    }
});

test('should render parent component with one state and child component with another', function(assert) {
    this.render(hbs`{{count-list}}`);
    let $parent = this.$('.parent-state');
    let $child = this.$('.child-state');
    assert.equal($parent.text(), 0);
    assert.equal($child.text(), 9);
    Ember.run(() => {
        this.$('.btn-up').trigger('click');
    });
    assert.equal($parent.text(), 1);
    assert.equal($child.text(), 9);
    Ember.run(() => {
        this.$('.btn-up').trigger('click');
    });
    assert.equal($parent.text(), 2);
    assert.equal($child.text(), 9);
    Ember.run(() => {
        this.$('.btn-down').trigger('click');
    });
    assert.equal($parent.text(), 2);
    assert.equal($child.text(), 8);
    Ember.run(() => {
        this.$('.btn-down').trigger('click');
    });
    assert.equal($parent.text(), 2);
    assert.equal($child.text(), 7);
});

test('the component should truly be extended meaning actions map over as you would expect', function(assert) {
    this.render(hbs`{{count-list}}`);
    let $random = this.$('.random-state');
    assert.equal($random.text(), '');
    Ember.run(() => {
        this.$('.btn-random').trigger('click');
    });
    assert.equal($random.text(), 'blue');
});
