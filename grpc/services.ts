import {GameClient} from "./generated/rotmg_pb_service";
import {EmailRequest} from "./generated/rotmg_pb";


function init(){
    const server = new GameClient("localhost:50051");
    const req = new EmailRequest();

    req.setEmail("teste")

    server.authorizePlayer(req, ((error, responseMessage) => {}))

}