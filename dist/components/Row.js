"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Row;
require("../style/Table.css");
var _dayjs = _interopRequireDefault(require("dayjs"));
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function Row(_ref) {
  let {
    data
  } = _ref;
  const getModififiedStringDate = el => {
    var customParseFormat = require('dayjs/plugin/customParseFormat');
    _dayjs.default.extend(customParseFormat);
    const getTvalue = value => value === "T";
    if ((0, _dayjs.default)(el, 'YYYY-MM-DD').isValid()) {
      el = el.split("");
      let index = el.findIndex(getTvalue);
      el = el.slice(0, index).join("");
    }
    return el;
  };
  return data.map((el, index) => /*#__PURE__*/_react.default.createElement("p", {
    className: "row-element",
    key: index
  }, getModififiedStringDate(el)));
}