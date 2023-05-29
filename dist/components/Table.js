"use strict";

require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Table;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/web.url.to-json.js");
require("core-js/modules/es.array.sort.js");
require("core-js/modules/es.array.reverse.js");
require("core-js/modules/es.string.trim.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.string.includes.js");
require("../style/Table.css");
var _Row = _interopRequireDefault(require("./Row"));
var _react = _interopRequireWildcard(require("react"));
var _arrow_down_ = _interopRequireDefault(require("../assets/arrow_down_2.png"));
var _dayjs = _interopRequireDefault(require("dayjs"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function Table(_ref) {
  let {
    data
  } = _ref;
  const [listElements, setListElements] = (0, _react.useState)(data);
  const [pages, setPages] = (0, _react.useState)([]);
  const [disclaimer, setDisclaimer] = (0, _react.useState)(false);
  const [displayingOption, setDisplayingOption] = (0, _react.useState)(2);
  const [selectedPage, setSelectedPage] = (0, _react.useState)(0);
  const [selectedFilter, setSelectedFilter] = (0, _react.useState)({
    column: 'initialize',
    type: 'initialize'
  });
  (0, _react.useEffect)(() => {
    setPages(dispatchElementByPages(listElements, displayingOption));
  }, [listElements, displayingOption]);

  ///utils method

  const checkForDate = () => {
    var customParseFormat = require('dayjs/plugin/customParseFormat');
    _dayjs.default.extend(customParseFormat);
    const myArray = [];
    listElements.forEach(obj => {
      const newObj = _objectSpread({}, obj);
      myArray.push(newObj);
    });
    myArray.forEach(obj => {
      for (let [key, value] of Object.entries(obj)) {
        if (value && (0, _dayjs.default)(value, 'YYYY-MM-DD').isValid()) {
          let date = new Date(value);
          obj[key] = date;
        }
      }
    });
    return myArray;
  };
  const parseDate = arr => {
    arr.forEach(obj => {
      for (let [key, value] of Object.entries(obj)) {
        if (value && value instanceof Date) {
          let date = value.toJSON();
          obj[key] = date;
        }
      }
    });
  };
  const columnFilter = e => {
    const columnName = e.currentTarget.dataset.column;
    const data = checkForDate();
    let sortedRow = [];
    if (selectedFilter.column === columnName && selectedFilter.type === "up") {
      sortedRow = data;
      setSelectedFilter({
        column: 'no',
        type: 'no'
      });
    } else if (selectedFilter.column === columnName) {
      sortedRow = data.sort(columnSorter(columnName));
      sortedRow = sortedRow.reverse();
      setSelectedFilter({
        column: columnName,
        type: 'up'
      });
    } else {
      sortedRow = data.sort(columnSorter(columnName));
      setSelectedFilter({
        column: columnName,
        type: 'down'
      });
    }
    parseDate(sortedRow);
    setListElements(sortedRow);
  };
  const columnSorter = columnName => {
    return function (a, b) {
      if (a[columnName] < b[columnName]) {
        return -1;
      }
      if (a[columnName] > b[columnName]) {
        return 1;
      }
      return 0;
    };
  };
  const formatColumnTitle = string => {
    const formatedString = string.charAt(0).toUpperCase() + string.slice(1);
    return formatedString;
  };
  const createSpaceBetweenWords = string => {
    const formatedString = string.replace(/[A-Z]/g, s => ' ' + s.toUpperCase()).trim();
    return formatedString;
  };
  const removeDuplicates = arr => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  };
  const dispatchElementByPages = (array, chunkCount) => {
    const chunks = [];
    const formatedChunks = [];
    const test = [...array];
    while (test.length) {
      chunks.push(test.splice(0, chunkCount));
    }
    chunks.forEach(chunk => {
      let rows = [];
      chunk.forEach(el => {
        const values = Object.values(el);
        rows.push(values);
      });
      formatedChunks.push(rows);
    });
    return formatedChunks;
  };

  /////

  /// Create columns method

  const columns = [];
  listElements.forEach(element => {
    const columnNames = Object.keys(element);
    columnNames.forEach(column => {
      columns.push(column);
    });
  });
  const columnIds = removeDuplicates(columns);
  let formatedColumns = removeDuplicates(columns);
  formatedColumns = formatedColumns.map(el => formatColumnTitle(el));
  formatedColumns = formatedColumns.map(el => createSpaceBetweenWords(el));

  ////////

  ///////// Search method

  const launchSearch = function launchSearch(event) {
    let elements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : listElements;
    const input = event.currentTarget.value.toUpperCase().trim();
    const disclaimer = document.querySelector('.disclaimer');
    if (input.length >= 3) {
      let results = [];
      const inputs = input.split(" ");
      elements.forEach(row => {
        let dataLine = Object.values(row);
        dataLine.every(element => {
          inputs.every(word => {
            if (element !== undefined && element.toUpperCase().includes(word)) {
              results.push(row);
              return false;
            }
            return true;
          });
          return true;
        });
      });
      results = removeDuplicates(results);
      setListElements(results);
      if (results.length === 0 && !disclaimer) {
        setDisclaimer(true);
      }
    } else if (input.length === 0) {
      setListElements(data);
      setDisclaimer(false);
    }
  };

  /////////////

  ////Displaying option method

  const initializeElementsPerPage = value => {
    setDisplayingOption(value);
    setSelectedPage(0);
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "main-container-table"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "displaying-options"
  }, /*#__PURE__*/_react.default.createElement("label", {
    for: "displaying-options"
  }, "Elements par page"), /*#__PURE__*/_react.default.createElement("select", {
    name: "nb-entries",
    id: "displaying-options",
    onChange: e => initializeElementsPerPage(e.currentTarget.value)
  }, /*#__PURE__*/_react.default.createElement("option", {
    value: "2"
  }, "2"), /*#__PURE__*/_react.default.createElement("option", {
    value: "4"
  }, "4"), /*#__PURE__*/_react.default.createElement("option", {
    value: "6"
  }, "6"), /*#__PURE__*/_react.default.createElement("option", {
    value: "10"
  }, "10"))), /*#__PURE__*/_react.default.createElement("div", {
    className: "search-bar-container"
  }, /*#__PURE__*/_react.default.createElement("label", {
    for: "query",
    id: "query"
  }), /*#__PURE__*/_react.default.createElement("input", {
    type: "search",
    name: "query",
    placeholder: "Entrez votre recherche",
    onKeyUp: e => launchSearch(e)
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "container-table"
  }, disclaimer ? /*#__PURE__*/_react.default.createElement("h2", {
    class: "disclaimer"
  }, "D\xE9sol\xE9, il n'y a aucun r\xE9sultat pour votre recherche") : null, /*#__PURE__*/_react.default.createElement("div", {
    className: "header-table"
  }, formatedColumns && formatedColumns.map((el, index) => /*#__PURE__*/_react.default.createElement("div", {
    className: "column",
    "data-column": columnIds[index],
    onClick: e => columnFilter(e)
  }, /*#__PURE__*/_react.default.createElement("div", null, el), columnIds[index] === selectedFilter.column ? /*#__PURE__*/_react.default.createElement("img", {
    src: _arrow_down_.default,
    alt: "arrow",
    className: selectedFilter.type === "up" ? "arrow-up" : "arrow-down"
  }) : null))), /*#__PURE__*/_react.default.createElement("div", {
    className: "container-table"
  }, pages[selectedPage] && pages.length > 0 ? pages[selectedPage].map(row => /*#__PURE__*/_react.default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/_react.default.createElement(_Row.default, {
    data: row
  }))) : null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "pagination"
  }, pages.length > 0 && pages.map((page, index) => /*#__PURE__*/_react.default.createElement("div", {
    className: "item",
    onClick: () => setSelectedPage(index)
  }, index + 1))));
}