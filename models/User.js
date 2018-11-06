"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const constanst_1 = require("../config/constanst");
const { getRoles } = require('../middleware/Auth');
const config = require('config');
const salt = config.get('bcrypt-number');
exports.userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        match: new RegExp(constanst_1.EmailREGEX),
        unique: true
    },
    CPF: {
        type: String,
        required: true,
        match: /([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})/,
        unique: true
    },
    CEP: {
        type: String,
        required: true,
        match: /^([0-9]{5})+(-?)+[0-9]{3}$/
    },
    bairro: {
        type: String,
        required: true,
        minlength: 5
    },
    street: {
        type: String,
        required: true,
        minlength: 5
    },
    house: {
        type: String,
        required: true,
        match: /\d/
    },
    complement: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        //@ts-ignore
        enum: getRoles(),
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    login: {
        type: {
            lastAttempt: Date,
            attempts: Number,
            locked: Boolean
        },
        required: false
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
        set: (v) => { return bcrypt.hashSync(v, bcrypt.genSaltSync(salt)); }
    }
});
// userSchema.methods.getToken = function() : String {
//     return '';
// };
exports.User = mongoose_1.model('User', exports.userSchema);
