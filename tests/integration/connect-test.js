import { connect } from 'ember-redux';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find, triggerEvent } from '@ember/test-helpers';
import Component from '@ember/component';
import { combineReducers } from 'redux';

var redux;

module('integration: connect test', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    redux = this.owner.lookup('service:redux');
  });

  test('should render parent component with one state and child component with another', async function(assert) {
    await render(hbs`{{count-list}}`);

    let $parent = find('.parent-state');
    let $child = find('.child-state');
    assert.equal($parent.textContent, 0);
    assert.equal($child.textContent, 9);

    await click('.btn-up');

    assert.equal($parent.textContent, 1);
    assert.equal($child.textContent, 9);

    await click('.btn-up');

    assert.equal($parent.textContent, 2);
    assert.equal($child.textContent, 9);

    await click('.btn-down');

    assert.equal($parent.textContent, 2);
    assert.equal($child.textContent, 8);

    await click('.btn-down');

    assert.equal($parent.textContent, 2);
    assert.equal($child.textContent, 7);
  });

  test('should render attrs', async function(assert) {
    assert.expect(2);

    this.set('myName', 'Dustin');
    await render(hbs`{{count-list name=myName}}`);

    assert.equal(find('.greeting').textContent, 'Welcome back, Dustin!', 'should render attrs provided to component');

    this.set('myName', 'Toran');

    assert.equal(find('.greeting').textContent, 'Welcome back, Toran!', 'should rerender component if attrs change');
  });

  test('stateToComputed will provide `this` context that is the component instance (when not using [phat]Arrow function)', async function(assert) {
    assert.expect(1);

    await render(hbs`{{count-list}}`);

    assert.equal(find('.serviced').textContent, 'true', 'should render the prop provided by component instance');
  });

  test('stateToComputed can be used with component level CP if notifyPropertyChange invoked during didUpdateAttrs', async function(assert) {
    assert.expect(2);

    this.set('dynoNameValue', 'Toran');
    await render(hbs`{{count-list dynoNameValue=dynoNameValue}}`);

    assert.equal(find('.dyno').textContent, 'name: Toran', 'should render the local component value');

    this.set('dynoNameValue', 'Tom');

    assert.equal(find('.dyno').textContent, 'name: Tom', 'should render new value when local component CP changed and notifyPropertyChange invoked');
  });

  test('stateToComputed is not invoked extraneously', async function(assert) {
    let callCount = 0;
    const stateToComputed = () => {
      callCount++;
      return { callCount };
    }
    this.owner.register('component:test-component', connect(stateToComputed)(Component.extend({
      layout: hbs`{{callCount}}`
    })));

    await render(hbs`{{test-component attr=attr}}`);
    assert.equal(this.element.textContent, '1');
    assert.equal(callCount, 1);

    this.set('attr', 'some-change');
    assert.equal(this.element.textContent, '2');
    assert.equal(callCount, 2);

    redux.dispatch({ type: 'FAKE-ACTION' });
    assert.equal(this.element.textContent, '3');
    assert.equal(callCount, 3);
  });

  test('the component should truly be extended meaning actions map over as you would expect', async function(assert) {
    await render(hbs`{{count-list}}`);

    let $random = find('.random-state');
    assert.equal($random.textContent, '');

    await click('.btn-random');

    assert.equal($random.textContent, 'blue');
  });

  test('each computed is truly readonly', async function(assert) {
    assert.expect(1);

    await render(hbs`{{count-list}}`);

    assert.expectAssertion(async () => {
      await click('.btn-alter');
    }, 'Assertion Failed: Cannot set redux property "low". Try dispatching a redux action instead.');
  });

  test('lifecycle hooks are still invoked', async function(assert) {
    assert.expect(3);

    this.owner.register('component:test-component', connect()(Component.extend({
      init() {
        assert.ok(true, 'init is invoked');
        this._super(...arguments);
      },

      didUpdateAttrs() {
        assert.ok(true, 'didUpdateAttrs should be invoked');
        this._super(...arguments);
      },

      willDestroy() {
        assert.ok(true, 'willDestroy is invoked');
        this._super(...arguments);
      }
    })));

    await render(hbs`{{test-component name=name}}`);

    this.set('name', 'Dustin');
  });

  test('lifecycle hooks are still invoked for es2015 class based components', async function(assert) {
    assert.expect(5);

    const stateToComputed = (state, attrs) => ({
      number: attrs.name
    });

    class FakeClazz extends Component {
      get layout() {
        return hbs`<span class="name">{{number}}</span>`;
      }

      constructor() {
        assert.ok(true, 'constructor is invoked');
        super(...arguments);
      }

      didUpdateAttrs() {
        assert.ok(true, 'didUpdateAttrs should be invoked');
        // super.didUpdateAttrs(...arguments);
      }

      willDestroy() {
        assert.ok(true, 'willDestroy is invoked');
        super.willDestroy(...arguments);
      }
    }

    this.owner.register('component:test-clazz', connect(stateToComputed)(FakeClazz));

    await render(hbs`{{test-clazz name=name}}`);
    assert.equal(find('.name').textContent, '');

    this.set('name', 'Toran');
    assert.equal(find('.name').textContent, 'Toran');
  });

  test('without didUpdateAttrs lifecycle defined connect will not throw runtime error', async function(assert) {
    assert.expect(2);

    const stateToComputed = (state, attrs) => ({
      number: attrs.name
    });

    class FakeClazz extends Component {
      get layout() {
        return hbs`<span class="name">{{number}}</span>`;
      }
    }

    this.owner.register('component:test-clazz', connect(stateToComputed)(FakeClazz));

    await render(hbs`{{test-clazz name=name}}`);
    assert.equal(find('.name').textContent, '');

    this.set('name', 'Christopher');
    assert.equal(find('.name').textContent, 'Christopher');
  });

  test('replaceReducer will update reducer for any connected component', async function(assert) {
    assert.expect(3);

    const stateToComputed = (state) => ({
      number: state.low
    });

    const dispatchToActions = (dispatch) => ({
      up: () => dispatch({type: 'UP'})
    });

    class FakeClazz extends Component {
      get layout() {
        return hbs`<button class="number" onclick={{action "up"}}>{{number}}</button>`;
      }
    }

    this.owner.register('component:test-clazz', connect(stateToComputed, dispatchToActions)(FakeClazz));

    await render(hbs`{{test-clazz}}`);
    assert.equal(find('.number').textContent, '0');

    await click('.number');
    assert.equal(find('.number').textContent, '1');

    const newReducer = (state, action) => {
      if (action.type === 'UP') {
        return state + 92;
      }
      return state || 0;
    }

    redux.replaceReducer(combineReducers({
      low: newReducer
    }));

    await click('.number');
    assert.equal(find('.number').textContent, '93');
  });

  test('connecting dispatchToActions only', async function(assert) {
    assert.expect(2);

    const dispatchToActions = () => {};

    this.owner.register('component:test-component-1', connect(null, dispatchToActions)(Component.extend({
      init() {
        this._super(...arguments);
        assert.ok(true, 'should be able to connect components passing `null` to stateToComputed');
      }
    })));

    this.owner.register('component:test-component-2', connect(undefined, dispatchToActions)(Component.extend({
      init() {
        this._super(...arguments);
        assert.ok(true, 'should be able to connect components passing `undefined` to stateToComputed');
      }
    })));

    await render(hbs`{{test-component-1}}`);
    await render(hbs`{{test-component-2}}`);
  });

  test('connecting dispatchToActions as object should dispatch action', async function(assert) {
    assert.expect(2);

    const dispatchToActions = {
      up() {
        assert.ok(true, 'should be able to pass object of functions to dispatchToActions');
        return {
          type: 'UP'
        };
      },
      down() {
        assert.ok(true, 'should be able to pass object of functions to dispatchToActions');
        return {
          type: 'DOWN'
        };
      }
    };

    this.owner.register('component:test-dispatch-action-object', connect(undefined, dispatchToActions)(Component.extend({
      init() {
        this._super(...arguments);
      },
      layout: hbs`
        <button class="btn-up" onclick={{action "up"}}>up</button>
        <button class="btn-down" onclick={{action "down"}}>up</button>
      `
    })));

    await render(hbs`{{test-dispatch-action-object}}`);

    await click('.btn-up');
    await click('.btn-down');
  });

  test('connect provides an Ember Component for you by default', async function(assert) {
    this.owner.register('template:components/foo-bar', hbs`{{name}}`);

    const stateToComputed = () => ({ name: 'byDefault?' });

    this.owner.register('component:foo-bar', connect(stateToComputed)());

    await render(hbs`{{foo-bar}}`);

    assert.equal(this.element.textContent, 'byDefault?');
  });

  test('stateToComputed supports a static function', async function(assert) {
    const stateToComputed = () => ({ id: 'static-selector' });

    this.owner.register('component:component-with-static-selector', connect(stateToComputed)(Component.extend({
      layout: hbs`{{id}}`
    })));

    await render(hbs`{{component-with-static-selector}}`);

    assert.equal(this.element.textContent, 'static-selector');
  });

  test('stateToComputed supports a factory function', async function(assert) {
    let createdCount = 0;
    const stateToComputedFactory = () => {
      createdCount++;
      return () => ({ id: `selector-${createdCount}` })
    }

    this.owner.register('component:component-with-selector-factory', connect(stateToComputedFactory)(Component.extend({
      layout: hbs`{{id}}`
    })));

    await render(hbs`{{component-with-selector-factory}} {{component-with-selector-factory}}`);

    assert.equal(createdCount, 2);
    assert.equal(this.element.textContent, 'selector-1 selector-2');
  });
});
