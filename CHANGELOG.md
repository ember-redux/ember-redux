ember-redux Changelog
==============================

1.9.1
-----

* [REVERT]: undo the setProperties update (from PR #41)
  ([#50](https://github.com/toranb/ember-redux/pull/50))


1.9.0
-----

* [REFACTOR]: Use Ember.Object.setProperties to update props
  ([#41](https://github.com/toranb/ember-redux/pull/41))

* [TESTS]: updated rerender test to track notify via observer
  ([#42](https://github.com/toranb/ember-redux/pull/42))

* [DEPENDENCY]: upgraded to ember-cli@2.9.1
  ([#44](https://github.com/toranb/ember-redux/pull/44))


1.8.0
-----

* [PERFORMANCE]: Avoid unnecessary notifyPropertyChange work
  ([#38](https://github.com/toranb/ember-redux/pull/38))

* [BUG]: wrap handleChange callback with Ember.run
  ([#35](https://github.com/toranb/ember-redux/pull/35))

* [BUG]: Call super in component willDestroy
  ([#31](https://github.com/toranb/ember-redux/pull/31))

* [DOCS]: added yelp clone ember-twiddle example
  ([commit](https://github.com/toranb/ember-redux/commit/4f0160fde1a09f076fd89b7af6e6c8a017e450ed))


1.7.0
-----

* [FEATURE]: add option for middleware setup
  ([#25](https://github.com/toranb/ember-redux/pull/25))

* [TESTS]: wrote a full redux-saga example w/ middleware
  ([#26](https://github.com/toranb/ember-redux/pull/26))

* [DEPENDENCY]: upgraded to ember-cli@2.8.0
  ([#24](https://github.com/toranb/ember-redux/pull/24))


1.6.0
-----

* [PERFORMANCE]: only notifyPropertyChange when a value is diff between redux and component
  ([#23](https://github.com/toranb/ember-redux/pull/23))


1.5.3
-----

* [DOCS]: added twiddle link to the README
  ([commit](https://github.com/toranb/ember-redux/commit/84b8c0fb6402e39f681e763e63f95acc8e1978db))


1.5.2
-----

* [BUG]: properly explode args for route function
  ([#18](https://github.com/toranb/ember-redux/pull/18))


1.5.1
-----

* [DOCS]: added "how to time travel" to the readme
  ([commit](https://github.com/toranb/ember-redux/commit/fdd35041fb3c9be8f3b663ba36ac87705d45ad8d))


1.5.0
-----

* [FEATURE]: Create default blueprint
  ([#15](https://github.com/toranb/ember-redux/pull/15))


1.4.0
-----

* [FEATURE]: Ember.Route is provided by default for connected routes
  ([commit](https://github.com/toranb/ember-redux/commit/7219ed7dd1de42b89184f3ccb77fa3d1df4abcb9))


1.3.0
-----

* [FEATURE]: return dispatch value to allow model hook to wait for thunk promises
  ([#7](https://github.com/toranb/ember-redux/pull/7))

* [DEPENDENCY]: updated node version of ember-browserify
  ([commit](https://github.com/toranb/ember-redux/commit/321a1f2f5773ffb1e6784844d9f97da1294d4f71))


1.2.0
-----

* [FEATURE]: added support for both redux-thunk 1.x and 2.x
  ([commit](https://github.com/toranb/ember-redux/commit/2a70e1481b6759e1a88fcbea9adbbd7f3f72d55a))


1.1.0
-----

* [REFACTOR]: improved the optional reducer configuration test
  ([commit](https://github.com/toranb/ember-redux/commit/40d196e2d83231e40be9df305acfdc098ab8d32f))

* [FEATURE]: added support for custom enhancers
  ([commit](https://github.com/toranb/ember-redux/commit/602cce7bab56105f61ca2d10bbb34a2c8c7c1446))
