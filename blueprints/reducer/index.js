/*jshint node:true*/

var fs       = require('fs');
var EOL      = require('os').EOL;
var recast   = require('recast');
var builders = require('recast').types.builders;
var chalk    = require('chalk');

module.exports = {
  description: 'Generates a reducer',

  reducerIndexPath: 'app/reducers/index.js',

  updateReducerIndex: function(updateAst) {
    var file;

    try {
      file = fs.readFileSync(this.reducerIndexPath, 'utf8');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;

      var error = new Error( 'Cannot find ' + this.reducerIndexPath +
        ' Try running: ember generate ember-redux default');

      this.ui.writeError(error);
      return;
    }

    this.ui.writeLine('updating ' + this.reducerIndexPath);
    var ast  = recast.parse(file);
    updateAst(ast);

    var code = recast.print(ast).code;
    fs.writeFileSync(this.reducerIndexPath, code);
  },

  afterInstall: function(options) {
    var reducerName = options.entity.name;

    this.updateReducerIndex(function(ast) {
      insertImport(reducerName, ast);
      insertExportProp(reducerName, ast);
      this._writeStatusToUI(chalk.green, 'add', reducerName);
    }.bind(this));
  },

  afterUninstall: function(options) {
    var reducerName = options.entity.name;

    this.updateReducerIndex(function(ast) {
      removeImport(reducerName, ast);
      removeExportProp(reducerName, ast);
      this._writeStatusToUI(chalk.red, 'remove', reducerName);
    }.bind(this));
  }
};

function insertImport(name, ast) {
  var imports     = findImports(ast);
  var foundImport = findImport(name, imports);

  if(!foundImport) {
    var newImport = builders.importDeclaration(
      [ builders.importDefaultSpecifier(builders.identifier(name)) ],
      builders.literal('./' + name));

      ast.program.body.splice(imports.length, 0, newImport);
  }
}

function removeImport(name, ast) {
  var imports     = findImports(ast);
  var foundImport = findImport(name, imports);

  if(foundImport) {
    ast.program.body.splice(foundImport.name, 1);
  }
}

function findImports(ast) {
  var imports = [];

  recast.visit(ast, {
    visitImportDeclaration: function(path) {
      imports.push(path);
      this.traverse(path);
    }
  });
  return imports;
}

function findImport(name, imports) {
  var foundPath;

  imports.forEach(function(path) {
    var importName = path.node.specifiers[0].local.name;
    if(importName === name) {
      foundPath = path;
    }
  });
  return foundPath;
}

function insertExportProp(name, ast) {
  var properties = getExportProperties(ast);
  var idx        = findExportProperty(name, properties);

  if(idx === undefined) {
    properties.push(builders.identifier(name));
  }
}

function removeExportProp(name, ast) {
  var properties = getExportProperties(ast);
  var idx        = findExportProperty(name, properties);

  if(idx !== undefined) {
    properties.splice(idx, 1);
  }
}

function getExportProperties(ast) {
  var properties;

  recast.visit(ast, {
    visitExportDefaultDeclaration: function(path) {
      properties = path.node.declaration.properties;
      return false;
    }
  });
  return properties;
}

function findExportProperty(property, properties) {
  var propertyIdx;

  properties.forEach(function(prop, idx) {
    if(prop.key.name === property) {
      propertyIdx = idx;
    }
  });
  return propertyIdx;
}
