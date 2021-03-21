import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

import { WebsocketEventNames } from '../../../shared/api/config';
import { WebsocketEventDataInterfaces, WebsocketController } from '../../../shared/api/types';
import { ActiveColor } from '../../../shared/types';
import { GameState } from '../../../shared/types';
import { getLegalSquaresForPiece, makeMove } from '../../ChessRules/chess-rules';
import { gameEventLogger } from '../../Logger/logger';
import * as FenParser from '../../FenParser/fen-parser';

let game: GameState = FenParser.read('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

export default class ChessGameController implements WebsocketController {
    io:Server;
    socket:Socket;

    constructor(io:Server, socket: Socket) {
        this.io = io;
        this.socket = socket;
        socket.join('game');
        this.emitBoardUpdate(game);
    }

    public bindEvents() {
        this.socket.on(WebsocketEventNames.GetMoves, this.handleGetMoves.bind(this));
        this.socket.on(WebsocketEventNames.MakeMove, this.handleMakeMove.bind(this));
        this.socket.on(WebsocketEventNames.DiscardGame, this.handleDiscardGame.bind(this));
    }

    private handleGetMoves({
            piece_square,
            request_issuer
        }: WebsocketEventDataInterfaces[WebsocketEventNames.GetMoves]) {

            const squares: number[] = getLegalSquaresForPiece(game, piece_square)
            const eventData: WebsocketEventDataInterfaces[WebsocketEventNames.UpdateMoves] = {
                origin_square: piece_square,
                possible_squares: squares
            }
            this.io.to(request_issuer).emit(WebsocketEventNames.UpdateMoves, eventData);
    }

    private handleMakeMove({
            move,
            usertoken
        }: WebsocketEventDataInterfaces[WebsocketEventNames.MakeMove]) {
        const { username } = jwt.decode(usertoken, { json: true }) || {};
        if (username) {
            gameEventLogger.info(`${username} (${ActiveColor[game.active_color]}) moved from ${move.from} to ${move.to}`)
            game = makeMove(move, game);
            this.emitBoardUpdate(game);
        }
    }

    private handleDiscardGame() {
        gameEventLogger.info(`Game was discarded!`);
        game = FenParser.read('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        this.emitBoardUpdate(game);
    }

    private emitBoardUpdate(newGameState: GameState) {
        const eventData: WebsocketEventDataInterfaces[WebsocketEventNames.UpdateBoard] = {
            board: newGameState.board
        };
        this.io.to(this.socket.id).emit(WebsocketEventNames.UpdateBoard, eventData);
    }
}
