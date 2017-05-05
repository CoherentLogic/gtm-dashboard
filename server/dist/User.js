'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _app = require('../../app.config');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function () {
    function User(optsOrUsername) {
        _classCallCheck(this, User);

        self = this;

        self.connectionString = "mongodb://" + _app2.default.db.host + ":" + _app2.default.db.port + "/" + _app2.default.db.database;

        _mongodb2.default.connect(self.connectionString, function (err, db) {
            if (!err) {
                self.db = db;
                console.log("Connected to database " + self.connectionString);
            } else {
                throw new Error(err);
            }
        });

        self.userRecord = {};

        if (optsOrUsername) {
            switch (typeof optsOrUsername === 'undefined' ? 'undefined' : _typeof(optsOrUsername)) {
                case 'object':
                    {
                        optsOrUsername.user ? self.userRecord = Object.assign({}, optsOrUsername.user) : optsOrUsername.user = null;

                        break;
                    }
                case 'string':
                    {

                        self.open(optsOrUsername);
                        break;
                    }
            }
        } else {}
    }

    _createClass(User, [{
        key: 'open',
        value: function open(username) {
            self = this;
        }
    }, {
        key: 'authenticate',
        value: function authenticate(password, req, res) {}
    }]);

    return User;
}();

exports.default = User;