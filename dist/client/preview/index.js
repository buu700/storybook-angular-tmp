"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forceReRender = exports.configure = exports.raw = exports.getStorybook = exports.clearDecorators = exports.addParameters = exports.addDecorator = exports.setAddon = exports.storiesOf = void 0;

var _client = require("@storybook/core/client");

require("./globals");

var _render = _interopRequireDefault(require("./render"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _start = (0, _client.start)(_render.default),
    clientApi = _start.clientApi,
    configApi = _start.configApi,
    forceReRender = _start.forceReRender;

exports.forceReRender = forceReRender;
var storiesOf = clientApi.storiesOf,
    setAddon = clientApi.setAddon,
    addDecorator = clientApi.addDecorator,
    addParameters = clientApi.addParameters,
    clearDecorators = clientApi.clearDecorators,
    getStorybook = clientApi.getStorybook,
    raw = clientApi.raw;
exports.raw = raw;
exports.getStorybook = getStorybook;
exports.clearDecorators = clearDecorators;
exports.addParameters = addParameters;
exports.addDecorator = addDecorator;
exports.setAddon = setAddon;
exports.storiesOf = storiesOf;
var configure = configApi.configure;
exports.configure = configure;