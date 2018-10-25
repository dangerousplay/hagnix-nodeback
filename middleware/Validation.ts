export function validateBody(validator: Function) : Error | any {

    //@ts-ignore
    return function (req, res, next) {
        const {error} = validator(req.body);

        if(error) {
            res.sendStatus(400);
            return error;
        }

        next();
    }
}

export function validateParams(validator: Function) : Error | any {

    //@ts-ignore
    return function (req, res, next) {
        const {error} = validator(req.params);

        if(error) {
            res.sendStatus(400);
            return error;
        }

        next();
    }
}