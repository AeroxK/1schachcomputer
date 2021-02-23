import express, { Request, Response } from 'express';

import { GAME_API_URL, MOVE_API_URL } from '../shared/config';
import * as FenParser from './FenParser/fen-parser';
import { getLegalSquaresForPiece } from './ChessRules/chess-rules';

const app = express();
const port = 3000;

app.use(express.static('dist/assets'));

const game = FenParser.read('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

app.get(GAME_API_URL, (req: Request, res: Response) => {
    res.send(game.board);
});

app.get(`${MOVE_API_URL}`, (req: Request, res: Response) => {
    if (req.query.square && typeof req.query.square === "string" && !isNaN(parseInt(req.query.square))) {
        res.send(getLegalSquaresForPiece(game, parseInt(req.query.square)));
    } else {
        res.sendStatus(400);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
