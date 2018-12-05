// package: hagnix
// file: rotmg.proto

var rotmg_pb = require("./rotmg_pb");
var grpc = require("grpc-web-client").grpc;

var Game = (function () {
  function Game() {}
  Game.serviceName = "hagnix.Game";
  return Game;
}());

Game.KickPlayer = {
  methodName: "KickPlayer",
  service: Game,
  requestStream: false,
  responseStream: false,
  requestType: rotmg_pb.KickRequest,
  responseType: rotmg_pb.Empty
};

Game.ListPlayers = {
  methodName: "ListPlayers",
  service: Game,
  requestStream: false,
  responseStream: false,
  requestType: rotmg_pb.Empty,
  responseType: rotmg_pb.ListPlayersResponse
};

Game.GetPlayer = {
  methodName: "GetPlayer",
  service: Game,
  requestStream: false,
  responseStream: false,
  requestType: rotmg_pb.EmailRequest,
  responseType: rotmg_pb.Player
};

Game.BanPlayer = {
  methodName: "BanPlayer",
  service: Game,
  requestStream: false,
  responseStream: false,
  requestType: rotmg_pb.EmailRequest,
  responseType: rotmg_pb.Empty
};

Game.PardonPlayer = {
  methodName: "PardonPlayer",
  service: Game,
  requestStream: false,
  responseStream: false,
  requestType: rotmg_pb.EmailRequest,
  responseType: rotmg_pb.Empty
};

Game.LoggedPlayer = {
  methodName: "LoggedPlayer",
  service: Game,
  requestStream: false,
  responseStream: false,
  requestType: rotmg_pb.EmailRequest,
  responseType: rotmg_pb.Empty
};

Game.AuthorizePlayer = {
  methodName: "AuthorizePlayer",
  service: Game,
  requestStream: false,
  responseStream: false,
  requestType: rotmg_pb.EmailRequest,
  responseType: rotmg_pb.Empty
};

Game.CreatePlayer = {
  methodName: "CreatePlayer",
  service: Game,
  requestStream: false,
  responseStream: false,
  requestType: rotmg_pb.CreatePlayerRequest,
  responseType: rotmg_pb.Player
};

Game.DeletePlayer = {
  methodName: "DeletePlayer",
  service: Game,
  requestStream: false,
  responseStream: false,
  requestType: rotmg_pb.EmailRequest,
  responseType: rotmg_pb.Empty
};

Game.ChangePlayer = {
  methodName: "ChangePlayer",
  service: Game,
  requestStream: false,
  responseStream: false,
  requestType: rotmg_pb.Player,
  responseType: rotmg_pb.Empty
};

Game.ServerInfo = {
  methodName: "ServerInfo",
  service: Game,
  requestStream: false,
  responseStream: false,
  requestType: rotmg_pb.Empty,
  responseType: rotmg_pb.Server
};

exports.Game = Game;

function GameClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

GameClient.prototype.kickPlayer = function kickPlayer(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Game.KickPlayer, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

GameClient.prototype.listPlayers = function listPlayers(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Game.ListPlayers, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

GameClient.prototype.getPlayer = function getPlayer(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Game.GetPlayer, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

GameClient.prototype.banPlayer = function banPlayer(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Game.BanPlayer, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

GameClient.prototype.pardonPlayer = function pardonPlayer(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Game.PardonPlayer, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

GameClient.prototype.loggedPlayer = function loggedPlayer(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Game.LoggedPlayer, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

GameClient.prototype.authorizePlayer = function authorizePlayer(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Game.AuthorizePlayer, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

GameClient.prototype.createPlayer = function createPlayer(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Game.CreatePlayer, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

GameClient.prototype.deletePlayer = function deletePlayer(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Game.DeletePlayer, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

GameClient.prototype.changePlayer = function changePlayer(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Game.ChangePlayer, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

GameClient.prototype.serverInfo = function serverInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Game.ServerInfo, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.GameClient = GameClient;

