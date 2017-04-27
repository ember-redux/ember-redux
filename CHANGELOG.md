ember-redux Changelog
==============================

2.4.0
-----

* [PERFORMANCE]: Only call stateToComputed once per state update
  ([#114](https://github.com/ember-redux/ember-redux/pull/114))


2.3.0
-----

* [DEPENDENCY]: upgraded to ember-cli v2.13.0-beta.4
  ([#111](https://github.com/ember-redux/ember-redux/pull/111))

* [FEATURE]: unlock action creators
  ([#107](https://github.com/ember-redux/ember-redux/pull/107))

* [DEPENDENCY]: upgraded to ember-cli v2.13.0-beta.3
  ([#106](https://github.com/ember-redux/ember-redux/pull/106))

* [BUILD]: upgrade to firefox 51
  ([#104](https://github.com/ember-redux/ember-redux/pull/104))

* [DOCS]: Fix Redux link
  ([#103](https://github.com/ember-redux/ember-redux/pull/103))


2.2.0
-----

* [FEATURE]: Support redux-devtools in browser
  ([#99](https://github.com/ember-redux/ember-redux/pull/99))

* [TESTS]: fixed readOnly assertion for ember 2.11.3
  ([commit](https://github.com/ember-redux/ember-redux/commit/7a0aea1e7ceb39ebb0e90937d5ef8868c29ffd1e))


2.1.0
-----

* [BUILD]: Optimize lodash
  ([#96](https://github.com/ember-redux/ember-redux/pull/96))

* [DOCS]: update twiddle in the docs to point at v2.0 and fixed devTools install
  ([#95](https://github.com/ember-redux/ember-redux/pull/95))

* [DOCS]: Improve Markdown structure and content in README
  ([#94](https://github.com/ember-redux/ember-redux/pull/94))


2.0.0
-----

* [DOCS]: new ember-twiddle for 2.0
  ([#92](https://github.com/ember-redux/ember-redux/pull/92))

* [DEPENDENCY]: upgraded redux/thunk shims in package.json
  ([#90](https://github.com/ember-redux/ember-redux/pull/90))

* [DOCS]: removed any mention of npm: from the docs/readme
  ([#81](https://github.com/ember-redux/ember-redux/pull/81))

* [REMOVAL]: killed the optional reducer api from 1x
  ([#80](https://github.com/ember-redux/ember-redux/pull/80))

* [BUILD]: Use Ember shims for redux packages instead of ember-browserify
  ([#63](https://github.com/ember-redux/ember-redux/pull/63))


1.11.0
-----

* [DEPENDENCY]: upgraded redux/redux-saga in the package.json
  ([#78](https://github.com/ember-redux/ember-redux/pull/78))

* [FEATURE]: the component instance is now available as `this` for non [phat]Arrow
  ([#60](https://github.com/ember-redux/ember-redux/pull/60))

* [BUILD]: upgraded to eslint from jshint
  ([#76](https://github.com/ember-redux/ember-redux/pull/76))

* [BUILD]: updated travis and code climate badges
  ([#75](https://github.com/ember-redux/ember-redux/pull/75))


1.10.0
-----

* [DEPENDENCY]: upgraded to ember-cli@2.10
  ([#66](https://github.com/ember-redux/ember-redux/pull/66))

* [PERFORMANCE]: Reduce the number of run loops created when state changes
  ([#69](https://github.com/ember-redux/ember-redux/pull/69))

* [TESTS]: improved runloop testing to confirm both run/and run.join work
  ([#70](https://github.com/ember-redux/ember-redux/pull/70))

* [BUILD]: Alphabetize dependencies
  ([#62](https://github.com/ember-redux/ember-redux/pull/62))

* [BUG]: Allow `null` stateToComputed argument
  ([#67](https://github.com/ember-redux/ember-redux/pull/67))

* [FEATURE] pass attrs to stateToComputed
  ([#56](https://github.com/ember-redux/ember-redux/pull/56))


1.9.2
-----

* [REFACTOR]: ES6ify connect
  ([#52](https://github.com/ember-redux/ember-redux/pull/52))

* [REFACTOR]: remove Ember.K in favor of () => {}
  ([#53](https://github.com/ember-redux/ember-redux/pull/53))

* [PERFORMANCE]: avoid multiple redux.getState() calls in connect
  ([#51](https://github.com/ember-redux/ember-redux/pull/51))


1.9.1
-----

* [REVERT]: undo the setProperties update (from PR #41)
  ([#50](https://github.com/ember-redux/ember-redux/pull/50))


1.9.0
-----

* [REFACTOR]: Use Ember.Object.setProperties to update props
  ([#41](https://github.com/ember-redux/ember-redux/pull/41))

* [TESTS]: updated rerender test to track notify via observer
  ([#42](https://github.com/ember-redux/ember-redux/pull/42))

* [DEPENDENCY]: upgraded to ember-cli@2.9.1
  ([#44](https://github.com/ember-redux/ember-redux/pull/44))


1.8.0
-----

* [PERFORMANCE]: Avoid unnecessary notifyPropertyChange work
  ([#38](https://github.com/ember-redux/ember-redux/pull/38))

* [BUG]: wrap handleChange callback with Ember.run
  ([#35](https://github.com/ember-redux/ember-redux/pull/35))

* [BUG]: Call super in component willDestroy
  ([#31](https://github.com/ember-redux/ember-redux/pull/31))

* [DOCS]: added yelp clone ember-twiddle example
  ([commit](https://github.com/ember-redux/ember-redux/commit/4f0160fde1a09f076fd89b7af6e6c8a017e450ed))


1.7.0
-----

* [FEATURE]: add option for middleware setup
  ([#25](https://github.com/ember-redux/ember-redux/pull/25))

* [TESTS]: wrote a full redux-saga example w/ middleware
  ([#26](https://github.com/ember-redux/ember-redux/pull/26))

* [DEPENDENCY]: upgraded to ember-cli@2.8.0
  ([#24](https://github.com/ember-redux/ember-redux/pull/24))


1.6.0
-----

* [PERFORMANCE]: only notifyPropertyChange when a value is diff between redux and component
  ([#23](https://github.com/ember-redux/ember-redux/pull/23))


1.5.3
-----

* [DOCS]: added twiddle link to the README
  ([commit](https://github.com/ember-redux/ember-redux/commit/84b8c0fb6402e39f681e763e63f95acc8e1978db))


1.5.2
-----

* [BUG]: properly explode args for route function
  ([#18](https://github.com/ember-redux/ember-redux/pull/18))


1.5.1
-----

* [DOCS]: added "how to time travel" to the readme
  ([commit](https://github.com/ember-redux/ember-redux/commit/fdd35041fb3c9be8f3b663ba36ac87705d45ad8d))


1.5.0
-----

* [FEATURE]: Create default blueprint
  ([#15](https://github.com/ember-redux/ember-redux/pull/15))


1.4.0
-----

* [FEATURE]: Ember.Route is provided by default for connected routes
  ([commit](https://github.com/ember-redux/ember-redux/commit/7219ed7dd1de42b89184f3ccb77fa3d1df4abcb9))


1.3.0
-----

* [FEATURE]: return dispatch value to allow model hook to wait for thunk promises
  ([#7](https://github.com/ember-redux/ember-redux/pull/7))

* [DEPENDENCY]: updated node version of ember-browserify
  ([commit](https://github.com/ember-redux/ember-redux/commit/321a1f2f5773ffb1e6784844d9f97da1294d4f71))


1.2.0
-----

* [FEATURE]: added support for both redux-thunk 1.x and 2.x
  ([commit](https://github.com/ember-redux/ember-redux/commit/2a70e1481b6759e1a88fcbea9adbbd7f3f72d55a))


1.1.0
-----

* [REFACTOR]: improved the optional reducer configuration test
  ([commit](https://github.com/ember-redux/ember-redux/commit/40d196e2d83231e40be9df305acfdc098ab8d32f))

* [FEATURE]: added support for custom enhancers
  ([commit](https://github.com/ember-redux/ember-redux/commit/602cce7bab56105f61ca2d10bbb34a2c8c7c1446))
