"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;

var _helpers = require("./angular/helpers");

function render(_ref) {
  var storyFn = _ref.storyFn,
      showMain = _ref.showMain;
  showMain();
  (0, _helpers.renderNgApp)(storyFn);
}