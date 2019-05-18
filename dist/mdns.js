'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _browser = require('./browser');

var _browser2 = _interopRequireDefault(_browser);

var _advertisement = require('./advertisement');

var _advertisement2 = _interopRequireDefault(_advertisement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class() {
    _classCallCheck(this, _class);

    this.libraryName = null;
    this.library = this._findLibrary();
  }

  _createClass(_class, [{
    key: 'getLibrary',
    value: function getLibrary() {
      return this.library;
    }
  }, {
    key: 'createAdvertisement',
    value: function createAdvertisement(service, port) {
      return new _advertisement2.default(this.library, this.libraryName, service, port);
    }
  }, {
    key: 'createBrowser',
    value: function createBrowser(serviceType) {
      return new _browser2.default(this.library, this.libraryName, serviceType);
    }
  }, {
    key: '_findLibrary',
    value: function _findLibrary() {
      try {
        var mdns = require('mdns');
        this.libraryName = 'mdns';
        return mdns;
      } catch (e) {
        // who cares
      }
      try {
        var mdnsjs = require('mdns-js');
        this.libraryName = 'mdnsjs';
        return mdnsjs;
      } catch (e) {
        // who cares
      }
      return false;
    }
  }]);

  return _class;
}();

exports.default = _class;