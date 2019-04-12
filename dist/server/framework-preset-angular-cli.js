"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.webpackFinal = webpackFinal;

var _nodeLogger = require("@storybook/node-logger");

var _angularCli_config = require("./angular-cli_config");

function webpackFinal(config) {
  const cwd = process.cwd();
  const cliWebpackConfigOptions = (0, _angularCli_config.getAngularCliWebpackConfigOptions)(cwd);

  if (cliWebpackConfigOptions) {
    _nodeLogger.logger.info('=> Loading angular-cli config.');
  }

  return (0, _angularCli_config.applyAngularCliWebpackConfig)(config, cliWebpackConfigOptions);
}