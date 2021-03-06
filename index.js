"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.OutboundLink = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _excluded = ["children"];

var OutboundLink = /*#__PURE__*/_react.default.forwardRef(function (_ref, ref) {
  var children = _ref.children,
      props = (0, _objectWithoutPropertiesLoose2.default)(_ref, _excluded);
  return /*#__PURE__*/_react.default.createElement("a", (0, _extends2.default)({
    ref: ref
  }, props, {
    onClick: function onClick(e) {
      if (typeof props.onClick === "function") {
        props.onClick(e);
      }

      var redirect = true;

      if (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented) {
        redirect = false;
      }

      if (props.target && props.target.toLowerCase() !== "_self") {
        redirect = false;
      }

      if (window.gtag) {
        window.gtag("event", "click", {
          event_category: "outbound",
          event_label: props.href,
          transport_type: redirect ? "beacon" : "",
          event_callback: function event_callback() {
            if (redirect) {
              document.location = props.href;
            }
          }
        });
      } else {
        if (redirect) {
          document.location = props.href;
        }
      }

      return false;
    }
  }), children);
});

exports.OutboundLink = OutboundLink;
OutboundLink.propTypes = {
  href: _propTypes.default.string,
  target: _propTypes.default.string,
  onClick: _propTypes.default.func
};