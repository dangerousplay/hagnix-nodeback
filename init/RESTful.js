"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const User = __importStar(require("../rest_routes/User"));
const restful = require('node-restful');
const cors = require('cors');
restful.enableCors = function (resource, options) {
    const methods = ['get', 'post', 'put', 'delete'];
    for (const m in methods) {
        resource.before(m, options ? cors(options) : cors());
    }
};
function init(app) {
    User.route('/api/users', app);
}
exports.init = init;
