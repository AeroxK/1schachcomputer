import express from 'express';
import http from 'http';

import { connectDB } from './Database/database';
import SocketServer from './SocketServer/socket-server';
import { logger, websocketEventLogger } from './Logger/logger';

connectDB()
    .then(() => logger.info('Database connection established'))
    .catch(err => logger.error(err));

const app = express();
app.use(express.static('dist/assets'));

const httpServer = http.createServer(app);
const port = 3000;

const io = SocketServer(httpServer);
websocketEventLogger.info(`SocketServer listening at ${io.path()}`);

httpServer.listen(port, () => {
    logger.info(`1schachcomputer available at http://localhost:${port}`);
});
