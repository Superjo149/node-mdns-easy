'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Emitter) {
  _inherits(_class, _Emitter);

  function _class(mdns, mdnsType) {
    var serviceType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

    _this.mdnsType = mdnsType;
    _this.ready = false;

    if (_this.mdnsType === 'mdnsjs') {
      _this.browser = mdns.createBrowser(serviceType);
      _this.browser.on('ready', function () {
        _this.ready = true;
      });
    } else {
      var sequence = [mdns.rst.DNSServiceResolve(), // eslint-disable-line
      'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo() : mdns.rst.getaddrinfo({ families: [0] }), // eslint-disable-line
      mdns.rst.makeAddressesUnique()];
      try {
        _this.browser = mdns.createBrowser(serviceType, { resolverSequence: sequence });
        _this.browser.on('error', function (e) {
          console.error(e);
        }); // eslint-disable-line no-console
        _this.ready = true;
      } catch (e) {
        console.error(e); // eslint-disable-line no-console
      }
    }
    return _this;
  }

  _createClass(_class, [{
    key: 'browse',
    value: function browse() {
      if (!this.ready) {
        return this.once('ready', this.browse.bind(this));
      }
      if (this.mdnsType === 'mdnsjs') {
        this.browser.discover();
        this.browser.on('update', this.serviceUp.bind(this));
      } else if (this.mdnsType === 'mdns') {
        this.browser.on('serviceUp', this.serviceUp.bind(this));
        this.browser.on('serviceDown', this.serviceDown.bind(this));
        this.browser.start();
      }
    }
  }, {
    key: 'serviceUp',
    value: function serviceUp(service) {
      if (service.name || service.fullname) {
        this.emit('serviceUp', this._normalizeService(service));
      }
    }
  }, {
    key: 'serviceDown',
    value: function serviceDown(service) {
      if (service.name || service.fullname) {
        this.emit('serviceDown', this._normalizeService(service));
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.browser.stop();
    }
  }, {
    key: '_normalizeService',
    value: function _normalizeService(service) {
      var normalized = {
        addresses: service.addresses,
        fullname: service.fullname,
        interfaceIndex: service.interfaceIndex,
        networkInterface: service.networkInterface,
        port: service.port
      };
      normalized.name = service.name || service.fullname.substring(0, service.fullname.indexOf('.'));
      normalized.txtRecord = service.txtRecord || function () {
        var records = {};
        (service.txt || []).forEach(function (item) {
          var key = item.substring(0, item.indexOf('='));
          var value = item.substring(item.indexOf('=') + 1);
          records[key] = value;
        });
        return records;
      }();
      return normalized;
    }
  }, {
    key: 'ready',
    get: function get() {
      return this._ready || false;
    },
    set: function set(newReady) {
      this._ready = newReady;
      if (newReady) {
        this.emit('ready');
      }
    }
  }]);

  return _class;
}(_events2.default);

exports.default = _class;