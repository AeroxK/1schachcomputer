import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { Server, Socket } from 'socket.io';

import { WebsocketEventNames } from '../shared/api/config';
import { WebsocketEventDataInterfaces } from '../shared/api/types';
import * as FenParser from './FenParser/fen-parser';
import { getLegalSquaresForPiece, makeMove } from './ChessRules/chess-rules';
import { GameState } from '../shared/types';

let game: GameState = FenParser.read('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

const app = express();
app.use(express.static('dist/assets'));
app.get(/\/[a-zA-Z0-9]+$/, (req: Request, res: Response) => res.sendFile(path.join(__dirname, '../assets/index.html')));

const httpServer = http.createServer(app);
const port = 3000;

const io = new Server(httpServer, {});

io.on(WebsocketEventNames.Connection, (socket: Socket) =>
    {
        socket.join('game');
        const eventData: WebsocketEventDataInterfaces[WebsocketEventNames.UpdateBoard] = {
            board: game.board
        };

        socket.on(WebsocketEventNames.GetMoves, (
            { piece_square, request_issuer }: WebsocketEventDataInterfaces[WebsocketEventNames.GetMoves]) =>
            {
                const squares: number[] = getLegalSquaresForPiece(game, piece_square)
                const eventData: WebsocketEventDataInterfaces[WebsocketEventNames.UpdateMoves] = {
                    origin_square: piece_square,
                    possible_squares: squares
                }
                io.to(request_issuer).emit(WebsocketEventNames.UpdateMoves, eventData);
            }
        );
        socket.on(WebsocketEventNames.MakeMove, (
            { move }: WebsocketEventDataInterfaces[WebsocketEventNames.MakeMove]) =>
            {
                game = makeMove(move, game);
                const eventData: WebsocketEventDataInterfaces[WebsocketEventNames.UpdateBoard] = {
                    board: game.board
                };
                io.to('game').emit(WebsocketEventNames.UpdateBoard, eventData);
            }
        );
        socket.on(WebsocketEventNames.DiscardGame, () => {
            game = FenParser.read('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
            const eventData: WebsocketEventDataInterfaces[WebsocketEventNames.UpdateBoard] = {
                board: game.board
            };
            io.to('game').emit(WebsocketEventNames.UpdateBoard, eventData);
        });

        io.to(socket.id).emit(WebsocketEventNames.UpdateBoard, eventData);
    }
);

httpServer.listen(port, () => {
    console.log(`1schachcomputer available at http://localhost:${port}`)
});
