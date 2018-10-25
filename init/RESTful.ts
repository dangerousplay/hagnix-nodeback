import * as User from "../rest_routes/User";

const restful = require('node-restful');
const cors = require('cors');

restful.enableCors = function(resource: any, options: any){
    const methods = ['get', 'post', 'put', 'delete'];

    for(const m in methods){
        resource.before(m, options ? cors(options) : cors());
    }
};

export function init(app: Express.Application){
    User.route('/api/users', app);
}



