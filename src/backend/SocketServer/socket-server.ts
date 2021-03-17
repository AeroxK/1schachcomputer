import http from 'http';
import { Server, Socket } from 'socket.io';

import { WebsocketEventNames } from '../../shared/api/config';
import { websocketEventLogger } from '../Logger/logger';
import ChessGameController from './controller/chess-game.controller';

let io:Server;

export default function SocketServer(httpServer: http.Server):Server {
    if (io === undefined) {
        io = new Server(httpServer, {});
        io.on(WebsocketEventNames.Connection, (socket: Socket) =>
            {
                websocketEventLogger.info(`New connection from: ${socket.handshake.address}`);
                new ChessGameController(io, socket).bindEvents();
            }
        );
    }
    return io;
}
