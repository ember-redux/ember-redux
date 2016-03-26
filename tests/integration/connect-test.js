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
    this.$('.btn-up').trigger('click');
    assert.equal($parent.text(), 1);
    assert.equal($child.text(), 9);
    this.$('.btn-up').trigger('click');
    assert.equal($parent.text(), 2);
    assert.equal($child.text(), 9);
    this.$('.btn-down').trigger('click');
    assert.equal($parent.text(), 2);
    assert.equal($child.text(), 8);
    this.$('.btn-down').trigger('click');
    assert.equal($parent.text(), 2);
    assert.equal($child.text(), 7);
});

test('the component should truly be extended meaning actions map over as you would expect', function(assert) {
    this.render(hbs`{{count-list}}`);
    let $random = this.$('.random-state');
    assert.equal($random.text(), '');
    this.$('.btn-random').trigger('click');
    assert.equal($random.text(), 'blue');
});

test('each computed is truly readonly', function(assert) {
    assert.expect(1);
    this.render(hbs`{{count-list}}`);
    try {
        this.$('.btn-alter').trigger('click');
    } catch (e) {
        assert.ok(e.message.indexOf('Cannot set read-only property') > -1);
    }
});
