"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAngularCliWebpackConfigOptions = getAngularCliWebpackConfigOptions;
exports.applyAngularCliWebpackConfig = applyAngularCliWebpackConfig;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _nodeLogger = require("@storybook/node-logger");

var _tsconfigPathsWebpackPlugin = require("tsconfig-paths-webpack-plugin");

var _angularCli_utils = require("./angular-cli_utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTsConfigOptions(tsConfigPath) {
  const basicOptions = {
    options: {},
    raw: {},
    fileNames: [],
    errors: []
  };

  if (!_fs.default.existsSync(tsConfigPath)) {
    return basicOptions;
  }

  const tsConfig = JSON.parse(_fs.default.readFileSync(tsConfigPath, 'utf8'));
  const {
    baseUrl
  } = tsConfig.compilerOptions || {};

  if (baseUrl) {
    const tsConfigDirName = _path.default.dirname(tsConfigPath);

    basicOptions.options.baseUrl = _path.default.resolve(tsConfigDirName, baseUrl);
  }

  return basicOptions;
}

function getAngularCliWebpackConfigOptions(dirToSearch) {
  const fname = _path.default.join(dirToSearch, 'angular.json');

  if (!_fs.default.existsSync(fname)) {
    return null;
  }

  const angularJson = JSON.parse(_fs.default.readFileSync(fname, 'utf8'));
  const {
    projects,
    defaultProject
  } = angularJson;

  if (!projects || !Object.keys(projects).length) {
    throw new Error('angular.json must have projects entry.');
  }

  let project = projects[Object.keys(projects)[0]];

  if (defaultProject) {
    project = projects[defaultProject];
  }

  const {
    options: projectOptions
  } = project.architect.build;
  const normalizedAssets = (0, _angularCli_utils.normalizeAssetPatterns)(projectOptions.assets, dirToSearch, project.sourceRoot);

  const projectRoot = _path.default.resolve(dirToSearch, project.root);

  const tsConfigPath = _path.default.resolve(dirToSearch, projectOptions.tsConfig);

  const tsConfig = getTsConfigOptions(tsConfigPath);
  return {
    root: dirToSearch,
    projectRoot,
    tsConfigPath,
    tsConfig,
    supportES2015: false,
    buildOptions: Object.assign({
      sourceMap: {},
      optimization: {}
    }, projectOptions, {
      assets: normalizedAssets
    })
  };
}

function applyAngularCliWebpackConfig(baseConfig, cliWebpackConfigOptions) {
  if (!cliWebpackConfigOptions) {
    return baseConfig;
  }

  if (!(0, _angularCli_utils.isBuildAngularInstalled)()) {
    _nodeLogger.logger.info('=> Using base config because @angular-devkit/build-angular is not installed.');

    return baseConfig;
  }

  const cliParts = (0, _angularCli_utils.getAngularCliParts)(cliWebpackConfigOptions);

  if (!cliParts) {
    _nodeLogger.logger.warn('=> Failed to get angular-cli webpack config.');

    return baseConfig;
  }

  _nodeLogger.logger.info('=> Get angular-cli webpack config.');

  const {
    cliCommonConfig,
    cliStyleConfig
  } = cliParts; // Don't use storybooks styling rules because we have to use rules created by @angular-devkit/build-angular
  // because @angular-devkit/build-angular created rules have include/exclude for global style files.

  const rulesExcludingStyles = (0, _angularCli_utils.filterOutStylingRules)(baseConfig); // cliStyleConfig.entry adds global style files to the webpack context

  const entry = [...baseConfig.entry, ...Object.values(cliStyleConfig.entry).reduce((acc, item) => acc.concat(item), [])];
  const module = Object.assign({}, baseConfig.module, {
    rules: [...cliStyleConfig.module.rules, ...rulesExcludingStyles]
  }); // We use cliCommonConfig plugins to serve static assets files.

  const plugins = [...cliStyleConfig.plugins, ...cliCommonConfig.plugins, ...baseConfig.plugins];
  const resolve = Object.assign({}, baseConfig.resolve, {
    modules: Array.from(new Set([...baseConfig.resolve.modules, ...cliCommonConfig.resolve.modules])),
    plugins: [new _tsconfigPathsWebpackPlugin.TsconfigPathsPlugin({
      configFile: cliWebpackConfigOptions.buildOptions.tsConfig,
      // After ng build my-lib the default value of 'main' in the package.json is 'umd'
      // This causes that you cannot import components directly from dist
      // https://github.com/angular/angular-cli/blob/9f114aee1e009c3580784dd3bb7299bdf4a5918c/packages/angular_devkit/build_angular/src/angular-cli-files/models/webpack-configs/browser.ts#L68
      mainFields: [...(cliWebpackConfigOptions.supportES2015 ? ['es2015'] : []), 'browser', 'module', 'main']
    })]
  });
  return Object.assign({}, baseConfig, {
    entry,
    module,
    plugins,
    resolve,
    resolveLoader: cliCommonConfig.resolveLoader
  });
}