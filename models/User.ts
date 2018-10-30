import {model, Schema, Document, Types} from "mongoose"
import * as bcrypt from 'bcrypt';
import {EmailREGEX} from "../config/constanst";
import {Roles} from "../middleware/Auth";

const {getRoles} = require('../middleware/Auth');
const config = require('config');

const salt = config.get('bcrypt-number');

export interface UserToken {
    identifier: String,
    refreshToken: boolean
    admin: boolean,
    roles: Array<Roles>
}

export interface UserSchema extends Document {
    id?: string
    name: string,
    CPF: string,
    CEP: string,
    bairro: string,
    street: string,
    password: string,
    house: string,
    admin: boolean,
    roles:Array<Roles>,
    email: string,
    login: {
        lastAttempt: Date,
        attempts: number,
        locked: boolean
    }

}

export const userSchema:Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        match: new RegExp(EmailREGEX),
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

    roles : {
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
        set: (v:String) => {return bcrypt.hashSync(v, bcrypt.genSaltSync(salt))}
    }
});

// userSchema.methods.getToken = function() : String {
//     return '';
// };

export const User = model('User', userSchema);
