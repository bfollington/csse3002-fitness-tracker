(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Body = require("Body.jsx").Body;

window.app = { domRoot: document.getElementById("mount") };

var render = function (component) {
    return React.render(component, window.app.domRoot);
};

render(React.createElement(Body, null));

},{"Body.jsx":2}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Body = exports.Body = (function (_React$Component) {
    function Body() {
        _classCallCheck(this, Body);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Body, _React$Component);

    _createClass(Body, {
        render: {
            value: function render() {
                return React.createElement(
                    "div",
                    null,
                    "Hello there!"
                );
            }
        }
    });

    return Body;
})(React.Component);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvQmVuL1Byb2plY3RzL1B5dGhvbi9jc3NlMzAwMi93ZWJhcHAvc3JjL2pzeC9hcHAuanN4IiwiL1VzZXJzL0Jlbi9Qcm9qZWN0cy9QeXRob24vY3NzZTMwMDIvd2ViYXBwL3NyYy9qc3gvQm9keS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztJQ0FRLElBQUksV0FBTyxVQUFVLEVBQXJCLElBQUk7O0FBRVosTUFBTSxDQUFDLEdBQUcsR0FBRyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7O0FBRTNELElBQU0sTUFBTSxHQUFHLFVBQUMsU0FBUztXQUFLLEtBQUssQ0FBQyxNQUFNLENBQ3RDLFNBQVMsRUFDVCxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FDckI7Q0FBQSxDQUFDOztBQUVGLE1BQU0sQ0FBQyxvQkFBQyxJQUFJLE9BQUcsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7SUNUSixJQUFJLFdBQUosSUFBSTthQUFKLElBQUk7OEJBQUosSUFBSTs7Ozs7OztjQUFKLElBQUk7O2lCQUFKLElBQUk7QUFFYixjQUFNO21CQUFBLGtCQUFHO0FBQ0wsdUJBQ0k7Ozs7aUJBRU0sQ0FDUjthQUNMOzs7O1dBUlEsSUFBSTtHQUFTLEtBQUssQ0FBQyxTQUFTIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7Qm9keX0gZnJvbSAnQm9keS5qc3gnO1xuXG53aW5kb3cuYXBwID0geyBkb21Sb290OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW91bnQnKSB9O1xuXG5jb25zdCByZW5kZXIgPSAoY29tcG9uZW50KSA9PiBSZWFjdC5yZW5kZXIoXG4gICAgY29tcG9uZW50LFxuICAgIHdpbmRvdy5hcHAuZG9tUm9vdFxuKTtcblxucmVuZGVyKDxCb2R5IC8+KTtcblxuIiwiZXhwb3J0IGNsYXNzIEJvZHkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICBIZWxsbyB0aGVyZSFcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn1cbiJdfQ==
