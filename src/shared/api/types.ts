import { Server, Socket } from 'socket.io';

import { Board, Move } from '../types';
import { WebsocketEventNames } from './config';

export interface ConnectionEventData {
    socket: Socket;
}

export interface MovesForPieceEventData {
    piece_square: number;
    request_issuer: string;
}

export interface MakeMoveEventData {
    move: Move;
}

export interface UpdateBoardEventData {
    board: Board;
}

export interface UpdateMovesEventData {
    origin_square: number;
    possible_squares: number[];
}

export interface WebsocketEventDataInterfaces {
    [WebsocketEventNames.GetMoves]: MovesForPieceEventData;
    [WebsocketEventNames.MakeMove]: MakeMoveEventData;
    [WebsocketEventNames.UpdateBoard]: UpdateBoardEventData;
    [WebsocketEventNames.UpdateMoves]: UpdateMovesEventData;
}

export interface WebsocketController {
    io: Server;
    socket: Socket;

    bindEvents: () => void;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface UserData {
    username: string;
    password: string;
}
