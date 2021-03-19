import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';

import { connectDB } from './Database/database';
import ApiRouter from './Router/router';
import SocketServer from './SocketServer/socket-server';
import { logger, websocketEventLogger } from './Logger/logger';

connectDB()
    .then(() => logger.info('Database connection established'))
    .catch(err => logger.error(err));

const app = express();
app.use(express.json());
app.use(express.static('dist/assets'));
app.use('/', ApiRouter);
app.get(/\/[a-zA-Z0-9]+$/, (req: Request, res: Response) => res.sendFile(path.join(__dirname, '../assets/index.html')));

const httpServer = http.createServer(app);
const port = 3000;

const io = SocketServer(httpServer);
websocketEventLogger.info(`SocketServer listening at ${io.path()}`);

httpServer.listen(port, () => {
    logger.info(`1schachcomputer available at http://localhost:${port}`);
});
