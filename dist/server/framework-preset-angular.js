"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.webpack = webpack;

var _path = _interopRequireDefault(require("path"));

var _webpack = require("webpack");

var _ts_config = _interopRequireDefault(require("./ts_config"));

var _createForkTsCheckerPlugin = _interopRequireDefault(require("./create-fork-ts-checker-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function webpack(config, {
  configDir
}) {
  const tsLoaderOptions = (0, _ts_config.default)(configDir);
  return Object.assign({}, config, {
    module: Object.assign({}, config.module, {
      rules: [...config.module.rules, {
        test: /\.tsx?$/,
        use: [{
          loader: require.resolve('ts-loader'),
          options: tsLoaderOptions
        }, require.resolve('angular2-template-loader')]
      }, {
        test: /[/\\]@angular[/\\]core[/\\].+\.js$/,
        parser: {
          system: true
        }
      }, {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: /\.async\.html$/
      }, {
        test: /\.s(c|a)ss$/,
        use: [require.resolve('raw-loader'), require.resolve('sass-loader')]
      }]
    }),
    resolve: Object.assign({}, config.resolve, {
      extensions: ['.ts', '.tsx', ...config.resolve.extensions]
    }),
    plugins: [...config.plugins, // See https://github.com/angular/angular/issues/11580#issuecomment-401127742
    new _webpack.ContextReplacementPlugin(/@angular(\\|\/)core(\\|\/)(fesm5|bundles)/, _path.default.resolve(__dirname, '..')), (0, _createForkTsCheckerPlugin.default)(tsLoaderOptions)]
  });
}