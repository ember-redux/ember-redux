/*jshint node:true*/
'use strict';
const fs          = require('fs-extra');
const path        = require('path');
const chalk       = require('chalk');

module.exports = {
  description: 'Generates a reducer for Redux.',

  fileMapTokens: function() {
    const self = this;
    return {
      __root__: function(options) {
        if (!!self.project.config()['ember-redux'] && !!self.project.config()['ember-redux'].directory) {
          return self.project.config()['ember-redux'].directory;
        } else if (options.inAddon) {
          return path.join('tests', 'dummy', 'app');
        } else {
          return '/app';
        }
      }
    };
  },

  afterInstall: function(options) {
    updateStateInitializers.call(this, 'add', options);
  },
  afterUninstall: function(options) {
    updateStateInitializers.call(this, 'remove', options);
  }

};

function updateStateInitializers(action, options) {
  const name = options.entity.name;
  const fileContents = loadFile(findFile(options));
  const verb = action === 'add' ? 'adding ' : 'removing ';
  const color = action === 'add' ? 'green' : 'red';
  const modules = getModules(findDirectory(options));
  this.ui.writeLine( '  ' + chalk[color](verb) + '"' + chalk.bold(name) + '" to master state initializer file [' + chalk.grey('state-initializers/index.js') + ']');
  saveFile( findFile(options), fileContents.aboveFold + generateImports(modules) + generateExports(modules) );
}

function findFile(options) {
  return path.join(...getPathParts(options).concat(['index.js']));
}

function findDirectory(options) {
  return path.join(...getPathParts(options));
}

function saveFile(fileName, content) {
  console.log('FILE: ', fileName);
  console.log('FILE CONTENT\n', content);
}

function getPathParts(options) {
  let pathParts = [options.project.root];

  if (options.dummy && options.project.isEmberCLIAddon()) {
    pathParts = pathParts.concat(['tests', 'dummy', 'app', 'state-initializers']);
  } else {
    pathParts = pathParts.concat(['app', 'state-initializers']);
  }

  return pathParts;
}

function loadFile(fileName) {
  const contents = fs.readFileSync(fileName, 'utf-8');
  return {
    aboveFold: contents.split(' */')[0] + ' */',
    belowFold: contents.split(' */')[1]
  }
}

function getModules(directory) {
  return fs.readdirSync(directory, 'utf8').filter( f => f !== 'index.js' ).map( f => f.replace('.js', ''));
}

function generateImports(modules) {
  return '\n\n' + modules.map(m => {
    return `import ${m} as './${m}';\n`
  }).join();
}

function generateExports(modules) {
  const prolog = '\n\nexport default (context) => {\n';
  const epilog = '}';
  const content = modules.map(m => {
    return '  ' + m + ': ' + m +'(context),\n'
  });

  return prolog + content + epilog;
}
