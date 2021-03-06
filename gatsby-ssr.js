"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _minimatch = require("minimatch");

var _react2 = require("@builder.io/partytown/react");

exports.onRenderBody = function (_ref, pluginOptions) {
  var setHeadComponents = _ref.setHeadComponents,
      setPostBodyComponents = _ref.setPostBodyComponents;
  if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") return null;
  var gtagConfig = pluginOptions.gtagConfig || {};
  var pluginConfig = pluginOptions.pluginConfig || {};
  var origin = pluginConfig.origin || "https://www.googletagmanager.com"; // Lighthouse recommends pre-connecting to google tag manager

  setHeadComponents([/*#__PURE__*/_react.default.createElement("link", {
    rel: "preconnect",
    key: "preconnect-google-gtag",
    href: origin
  }), /*#__PURE__*/_react.default.createElement("link", {
    rel: "dns-prefetch",
    key: "dns-prefetch-google-gtag",
    href: origin
  })]); // Prevent duplicate or excluded pageview events being emitted on initial load of page by the `config` command
  // https://developers.google.com/analytics/devguides/collection/gtagjs/#disable_pageview_tracking

  gtagConfig.send_page_view = false;
  var firstTrackingId = pluginOptions.trackingIds && pluginOptions.trackingIds.length ? pluginOptions.trackingIds[0] : "";
  var excludeGtagPaths = [];

  if (typeof pluginConfig.exclude !== "undefined") {
    pluginConfig.exclude.map(function (exclude) {
      var mm = new _minimatch.Minimatch(exclude);
      excludeGtagPaths.push(mm.makeRe());
    });
  }

  var setComponents = pluginConfig.head ? setHeadComponents : setPostBodyComponents;

  var renderHtml = function renderHtml() {
    return "\n      " + (excludeGtagPaths.length ? "window.excludeGtagPaths=[" + excludeGtagPaths.join(",") + "];" : "") + "\n      " + (typeof gtagConfig.anonymize_ip !== "undefined" && gtagConfig.anonymize_ip === true ? "function gaOptout(){document.cookie=disableStr+'=true; expires=Thu, 31 Dec 2099 23:59:59 UTC;path=/',window[disableStr]=!0}var gaProperty='" + firstTrackingId + "',disableStr='ga-disable-'+gaProperty;document.cookie.indexOf(disableStr+'=true')>-1&&(window[disableStr]=!0);" : "") + "\n      if(" + (pluginConfig.respectDNT ? "!(navigator.doNotTrack == \"1\" || window.doNotTrack == \"1\")" : "true") + ") {\n        window.dataLayer = window.dataLayer || [];\n        window.gtag = function gtag(){window.dataLayer && window.dataLayer.push(arguments);}\n        gtag('js', new Date());\n\n        " + pluginOptions.trackingIds.map(function (trackingId) {
      return "gtag('config', '" + trackingId + "', " + JSON.stringify(gtagConfig) + ");";
    }).join("") + "\n      }\n      ";
  };

  return setComponents([/*#__PURE__*/_react.default.createElement(_react2.Partytown, {
    key: "partytown-gtag",
    forward: ['gtag']
  }), /*#__PURE__*/_react.default.createElement("script", {
    type: "text/partytown",
    key: "gatsby-plugin-google-gtag-partytown",
    async: true,
    src: origin + "/gtag/js?id=" + firstTrackingId
  }), /*#__PURE__*/_react.default.createElement("script", {
    type: "text/partytown",
    key: "gatsby-plugin-google-gtag-partytown-config",
    dangerouslySetInnerHTML: {
      __html: renderHtml()
    }
  })]);
};