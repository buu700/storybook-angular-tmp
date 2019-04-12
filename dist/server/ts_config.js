"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _nodeLogger = require("@storybook/node-logger");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolveTsConfig(tsConfigPath) {
  if (!_fs.default.existsSync(tsConfigPath)) {
    return null;
  }

  _nodeLogger.logger.info('=> Found custom tsconfig.json');

  return tsConfigPath;
}

function _default(configDir) {
  const tsLoaderOptions = {
    transpileOnly: true
  };
  const configFilePath = resolveTsConfig(_path.default.resolve(configDir, 'tsconfig.json'));

  if (configFilePath) {
    tsLoaderOptions.configFile = configFilePath;
  }

  return tsLoaderOptions;
}