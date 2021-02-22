import express, { Request, Response } from 'express';

import { API_URL } from '../shared/config';
import * as FenParser from './FenParser/fen-parser';

const app = express();
const port = 3000;

app.use(express.static('dist/assets'));

app.get(API_URL, (req: Request, res: Response) => {
    const game = FenParser.read('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    res.send(game.board);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
