import express from 'express';
import http from 'http';

import SocketServer from './SocketServer/socket-server';
import { logger, websocketEventLogger } from './Logger/logger';
 
const app = express();
app.use(express.static('dist/assets'));

const httpServer = http.createServer(app);
const port = 3000;

const io = SocketServer(httpServer);
websocketEventLogger.info(`SocketServer listening at ${io.path()}`);

httpServer.listen(port, () => {
    logger.info(`1schachcomputer available at http://localhost:${port}`);
});
