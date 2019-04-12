"use strict";

var _forkTsCheckerWebpackPlugin = _interopRequireDefault(require("fork-ts-checker-webpack-plugin"));

var _ts_config = _interopRequireDefault(require("./ts_config"));

var _createForkTsCheckerPlugin = _interopRequireDefault(require("./create-fork-ts-checker-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line global-require
jest.mock('fs', () => require('../../../../__mocks__/fs'));
jest.mock('path', () => ({
  resolve: () => 'tsconfig.json'
}));

const setupFiles = files => {
  // eslint-disable-next-line no-underscore-dangle, global-require
  require('fs').__setMockFiles(files);
};

describe('create-fork-ts-checker-plugin.test', () => {
  it('should create a ForkTsCheckerWebpackPlugin instance', () => {
    setupFiles({
      'tsconfig.json': '{}'
    });
    const tsLoaderOptions = (0, _ts_config.default)('.foo');
    const instance = (0, _createForkTsCheckerPlugin.default)(tsLoaderOptions);
    expect(instance).toBeInstanceOf(_forkTsCheckerWebpackPlugin.default);
    expect(instance.tsconfig).toEqual(tsLoaderOptions.configFile);
  });
  it('should create a ForkTsCheckerWebpackPlugin instance without passing options', () => {
    const instance = (0, _createForkTsCheckerPlugin.default)({});
    expect(instance).toBeInstanceOf(_forkTsCheckerWebpackPlugin.default);
  });
});