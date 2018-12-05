// package: hagnix
// file: rotmg.proto

import * as rotmg_pb from "./rotmg_pb";
import {grpc} from "grpc-web-client";

type GameKickPlayer = {
  readonly methodName: string;
  readonly service: typeof Game;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rotmg_pb.KickRequest;
  readonly responseType: typeof rotmg_pb.Empty;
};

type GameListPlayers = {
  readonly methodName: string;
  readonly service: typeof Game;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rotmg_pb.Empty;
  readonly responseType: typeof rotmg_pb.ListPlayersResponse;
};

type GameGetPlayer = {
  readonly methodName: string;
  readonly service: typeof Game;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rotmg_pb.EmailRequest;
  readonly responseType: typeof rotmg_pb.Player;
};

type GameBanPlayer = {
  readonly methodName: string;
  readonly service: typeof Game;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rotmg_pb.EmailRequest;
  readonly responseType: typeof rotmg_pb.Empty;
};

type GamePardonPlayer = {
  readonly methodName: string;
  readonly service: typeof Game;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rotmg_pb.EmailRequest;
  readonly responseType: typeof rotmg_pb.Empty;
};

type GameLoggedPlayer = {
  readonly methodName: string;
  readonly service: typeof Game;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rotmg_pb.EmailRequest;
  readonly responseType: typeof rotmg_pb.Empty;
};

type GameAuthorizePlayer = {
  readonly methodName: string;
  readonly service: typeof Game;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rotmg_pb.EmailRequest;
  readonly responseType: typeof rotmg_pb.Empty;
};

type GameCreatePlayer = {
  readonly methodName: string;
  readonly service: typeof Game;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rotmg_pb.CreatePlayerRequest;
  readonly responseType: typeof rotmg_pb.Player;
};

type GameDeletePlayer = {
  readonly methodName: string;
  readonly service: typeof Game;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rotmg_pb.EmailRequest;
  readonly responseType: typeof rotmg_pb.Empty;
};

type GameChangePlayer = {
  readonly methodName: string;
  readonly service: typeof Game;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rotmg_pb.Player;
  readonly responseType: typeof rotmg_pb.Empty;
};

type GameServerInfo = {
  readonly methodName: string;
  readonly service: typeof Game;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rotmg_pb.Empty;
  readonly responseType: typeof rotmg_pb.Server;
};

export class Game {
  static readonly serviceName: string;
  static readonly KickPlayer: GameKickPlayer;
  static readonly ListPlayers: GameListPlayers;
  static readonly GetPlayer: GameGetPlayer;
  static readonly BanPlayer: GameBanPlayer;
  static readonly PardonPlayer: GamePardonPlayer;
  static readonly LoggedPlayer: GameLoggedPlayer;
  static readonly AuthorizePlayer: GameAuthorizePlayer;
  static readonly CreatePlayer: GameCreatePlayer;
  static readonly DeletePlayer: GameDeletePlayer;
  static readonly ChangePlayer: GameChangePlayer;
  static readonly ServerInfo: GameServerInfo;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: () => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: () => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: () => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class GameClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  kickPlayer(
    requestMessage: rotmg_pb.KickRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Empty|null) => void
  ): UnaryResponse;
  kickPlayer(
    requestMessage: rotmg_pb.KickRequest,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Empty|null) => void
  ): UnaryResponse;
  listPlayers(
    requestMessage: rotmg_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.ListPlayersResponse|null) => void
  ): UnaryResponse;
  listPlayers(
    requestMessage: rotmg_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.ListPlayersResponse|null) => void
  ): UnaryResponse;
  getPlayer(
    requestMessage: rotmg_pb.EmailRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Player|null) => void
  ): UnaryResponse;
  getPlayer(
    requestMessage: rotmg_pb.EmailRequest,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Player|null) => void
  ): UnaryResponse;
  banPlayer(
    requestMessage: rotmg_pb.EmailRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Empty|null) => void
  ): UnaryResponse;
  banPlayer(
    requestMessage: rotmg_pb.EmailRequest,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Empty|null) => void
  ): UnaryResponse;
  pardonPlayer(
    requestMessage: rotmg_pb.EmailRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Empty|null) => void
  ): UnaryResponse;
  pardonPlayer(
    requestMessage: rotmg_pb.EmailRequest,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Empty|null) => void
  ): UnaryResponse;
  loggedPlayer(
    requestMessage: rotmg_pb.EmailRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Empty|null) => void
  ): UnaryResponse;
  loggedPlayer(
    requestMessage: rotmg_pb.EmailRequest,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Empty|null) => void
  ): UnaryResponse;
  authorizePlayer(
    requestMessage: rotmg_pb.EmailRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Empty|null) => void
  ): UnaryResponse;
  authorizePlayer(
    requestMessage: rotmg_pb.EmailRequest,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Empty|null) => void
  ): UnaryResponse;
  createPlayer(
    requestMessage: rotmg_pb.CreatePlayerRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Player|null) => void
  ): UnaryResponse;
  createPlayer(
    requestMessage: rotmg_pb.CreatePlayerRequest,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Player|null) => void
  ): UnaryResponse;
  deletePlayer(
    requestMessage: rotmg_pb.EmailRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Empty|null) => void
  ): UnaryResponse;
  deletePlayer(
    requestMessage: rotmg_pb.EmailRequest,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Empty|null) => void
  ): UnaryResponse;
  changePlayer(
    requestMessage: rotmg_pb.Player,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Empty|null) => void
  ): UnaryResponse;
  changePlayer(
    requestMessage: rotmg_pb.Player,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Empty|null) => void
  ): UnaryResponse;
  serverInfo(
    requestMessage: rotmg_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Server|null) => void
  ): UnaryResponse;
  serverInfo(
    requestMessage: rotmg_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: rotmg_pb.Server|null) => void
  ): UnaryResponse;
}

