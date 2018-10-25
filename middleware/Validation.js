"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateBody(validator) {
    //@ts-ignore
    return function (req, res, next) {
        const { error } = validator(req.body);
        if (error) {
            res.sendStatus(400);
            return error;
        }
        next();
    };
}
exports.validateBody = validateBody;
function validateParams(validator) {
    //@ts-ignore
    return function (req, res, next) {
        const { error } = validator(req.params);
        if (error) {
            res.sendStatus(400);
            return error;
        }
        next();
    };
}
exports.validateParams = validateParams;
