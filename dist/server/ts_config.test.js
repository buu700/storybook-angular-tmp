"use strict";

var _ts_config = _interopRequireDefault(require("./ts_config"));

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

describe('ts_config', () => {
  it('should return the config with the path to the tsconfig.json', () => {
    setupFiles({
      'tsconfig.json': '{}'
    });
    const config = (0, _ts_config.default)('.foo');
    expect(config).toEqual({
      transpileOnly: true,
      configFile: 'tsconfig.json'
    });
  });
  it('should return object with transpileOnly: true when there is no tsconfig.json', () => {
    setupFiles({});
    const config = (0, _ts_config.default)('.foo');
    expect(config).toEqual({
      transpileOnly: true
    });
  });
});