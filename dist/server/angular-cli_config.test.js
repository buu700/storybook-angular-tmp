"use strict";

var _angularCli_config = require("./angular-cli_config");

var _angular = _interopRequireDefault(require("../../../../examples/angular-cli/angular.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line global-require
jest.mock('fs', () => require('../../../../__mocks__/fs'));
jest.mock('path', () => ({
  join: () => 'angular.json',
  resolve: () => 'tsconfig.json'
}));

const setupFiles = files => {
  // eslint-disable-next-line no-underscore-dangle, global-require
  require('fs').__setMockFiles(files);
};

describe('angualr-cli_config', () => {
  describe('getAngularCliWebpackConfigOptions()', () => {
    it('should return have empty `buildOptions.sourceMap` and `buildOptions.optimization` by default', () => {
      setupFiles({
        'angular.json': JSON.stringify(_angular.default)
      });
      const config = (0, _angularCli_config.getAngularCliWebpackConfigOptions)('/');
      expect(config).toMatchObject({
        buildOptions: {
          sourceMap: {},
          optimization: {}
        }
      });
    });
  });
});