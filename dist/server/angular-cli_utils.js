"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterOutStylingRules = filterOutStylingRules;
exports.isBuildAngularInstalled = isBuildAngularInstalled;
exports.getAngularCliParts = getAngularCliParts;
exports.normalizeAssetPatterns = normalizeAssetPatterns;

var _fs = _interopRequireDefault(require("fs"));

var _core = require("@angular-devkit/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isDirectory(assetPath) {
  try {
    return _fs.default.statSync(assetPath).isDirectory();
  } catch (e) {
    return false;
  }
}

function getAssetsParts(resolvedAssetPath, assetPath) {
  if (isDirectory(resolvedAssetPath)) {
    return {
      glob: '**/*',
      // Folders get a recursive star glob.
      input: assetPath // Input directory is their original path.

    };
  }

  return {
    glob: (0, _core.basename)(assetPath),
    // Files are their own glob.
    input: (0, _core.dirname)(assetPath) // Input directory is their original dirname.

  };
}

function isStylingRule(rule) {
  const {
    test
  } = rule;

  if (!test) {
    return false;
  }

  if (!(test instanceof RegExp)) {
    return false;
  }

  return test.test('.css') || test.test('.scss') || test.test('.sass');
}

function filterOutStylingRules(config) {
  return config.module.rules.filter(rule => !isStylingRule(rule));
}

function isBuildAngularInstalled() {
  try {
    require.resolve('@angular-devkit/build-angular');

    return true;
  } catch (e) {
    return false;
  }
}

function getAngularCliParts(cliWebpackConfigOptions) {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const ngCliConfigFactory = require('@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs');

  try {
    return {
      cliCommonConfig: ngCliConfigFactory.getCommonConfig(cliWebpackConfigOptions),
      cliStyleConfig: ngCliConfigFactory.getStylesConfig(cliWebpackConfigOptions)
    };
  } catch (e) {
    return null;
  }
}

function normalizeAssetPatterns(assetPatterns, dirToSearch, sourceRoot) {
  if (!assetPatterns || !assetPatterns.length) {
    return [];
  }

  return assetPatterns.map(assetPattern => {
    if (typeof assetPattern === 'object') {
      return assetPattern;
    }

    const assetPath = (0, _core.normalize)(assetPattern);
    const resolvedSourceRoot = (0, _core.resolve)(dirToSearch, sourceRoot);
    const resolvedAssetPath = (0, _core.resolve)(dirToSearch, assetPath);
    const parts = getAssetsParts(resolvedAssetPath, assetPath); // Output directory for both is the relative path from source root to input.

    const output = (0, _core.relative)(resolvedSourceRoot, (0, _core.resolve)(dirToSearch, parts.input)); // Return the asset pattern in object format.

    return Object.assign({}, parts, {
      output
    });
  });
}