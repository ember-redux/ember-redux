/* jshint node: true */
'use strict';

var path = require('path');
var mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-redux',

  included: function(app) {
    // Import UMD redux and redux-thunk
    // transform to named AMD that we can import
    app.import('vendor/redux.js', {
      using: [{ transformation: 'amd', as: 'redux' }]
    });
    app.import('vendor/redux-thunk.js', {
      using: [{ transformation: 'amd', as: 'redux-thunk' }]
    });
    // If developing the addon itself, add redux-saga
    if (this.parent.pkg.name === 'ember-redux') {
      app.import('vendor/redux-saga.js', {
        using: [{ transformation: 'amd', as: 'redux-saga' }]
      });
    }
  },

  treeForVendor: function() {
    // Grab the UMD distributions of redux and redux-thunk
    var trees = [
      path.join(path.dirname(require.resolve('redux')), '..', 'dist'),
      path.join(path.dirname(require.resolve('redux-thunk')), '..', 'dist'),
    ];
    // If developing the addon itself, add redux-saga
    if (this.parent.pkg.name === 'ember-redux') {
      trees.push(
        path.join(path.dirname(require.resolve('redux-saga')), '..', 'dist')
      );
    }
    return mergeTrees(trees);
  }
};
