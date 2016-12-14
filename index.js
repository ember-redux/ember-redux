/* jshint node: true */
'use strict';

var Rollup = require('broccoli-rollup');
var path = require('path');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var replace = require('rollup-plugin-replace');
var merge = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-redux',

  included: function() {
    this.app.import('vendor/redux.js');
    this.app.import('vendor/redux-thunk.js');
    if (this.app.env === 'test') {
      this.app.import('vendor/redux-saga.js');
    }
  },

  treeForVendor: function() {
    var runtimeDepTrees = ['redux', 'redux-thunk', 'redux-saga'].map(function(dep) {
      return new Rollup(path.dirname(require.resolve(dep + '/package.json')), {
        rollup: {
          entry: require(dep + '/package.json')['jsnext:main'],
          targets: [{
            dest: dep + '.js',
            format: 'amd',
            moduleId: dep
          }],
          plugins: [
            nodeResolve(),
            commonjs(),
            replace({
              'process.env.NODE_ENV': JSON.stringify('production')
            })
          ]
        }
      });
    });
    return merge(runtimeDepTrees);
  }
};
