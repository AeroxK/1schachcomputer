import { readFile } from 'fs';
import path from 'path';

import { read, write } from './fen-parser';
import { PieceCode } from '../../shared/types';

describe('read', () => {
    test('Read initial position', done => {
        readFile(path.join(__dirname, 'samples/starting-position.fen'), 'utf8', (err, data) => {
            if (err) throw err;
    
            const game = read(data);
    
            expect(game.active_color).toBe(1);
            expect(JSON.stringify(game.board)).toBe(JSON.stringify([
                PieceCode.BlackRook, PieceCode.BlackKnight, PieceCode.BlackBishop, PieceCode.BlackQueen, PieceCode.BlackKing, PieceCode.BlackBishop, PieceCode.BlackKnight, PieceCode.BlackRook,
                PieceCode.BlackPawn, PieceCode.BlackPawn, PieceCode.BlackPawn, PieceCode.BlackPawn, PieceCode.BlackPawn, PieceCode.BlackPawn, PieceCode.BlackPawn, PieceCode.BlackPawn,
                PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare,
                PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare,
                PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare,
                PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare,
                PieceCode.WhitePawn, PieceCode.WhitePawn, PieceCode.WhitePawn, PieceCode.WhitePawn, PieceCode.WhitePawn, PieceCode.WhitePawn, PieceCode.WhitePawn, PieceCode.WhitePawn,
                PieceCode.WhiteRook, PieceCode.WhiteKnight, PieceCode.WhiteBishop, PieceCode.WhiteQueen, PieceCode.WhiteKing, PieceCode.WhiteBishop, PieceCode.WhiteKnight, PieceCode.WhiteRook
            ]));
            expect(JSON.stringify(game.castling_availability)).toBe(JSON.stringify({
                white: {
                    kingside: true,
                    queenside: true
                },
                black: {
                    kingside: true,
                    queenside: true
                }
            }));
            expect(game.en_passant_square).toBe(-1);
            expect(game.fullmove_number).toBe(1);
            expect(game.halfmove_clock).toBe(0);
    
            done();
        });
    });
    
    test('Read Sicilian defense starting position', done => {
        readFile(path.join(__dirname, 'samples/sicilian-defense.fen'), 'utf8', (err, data) => {
            if (err) throw err;
    
            const game = read(data);
    
            expect(game.active_color).toBe(1);
            expect(JSON.stringify(game.board)).toBe(JSON.stringify([
                PieceCode.BlackRook, PieceCode.BlackKnight, PieceCode.BlackBishop, PieceCode.BlackQueen, PieceCode.BlackKing, PieceCode.BlackBishop, PieceCode.BlackKnight, PieceCode.BlackRook,
                PieceCode.BlackPawn, PieceCode.BlackPawn, PieceCode.EmptySquare, PieceCode.BlackPawn, PieceCode.BlackPawn, PieceCode.BlackPawn, PieceCode.BlackPawn, PieceCode.BlackPawn,
                PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare,
                PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.BlackPawn, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare,
                PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.WhitePawn, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare,
                PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare,
                PieceCode.WhitePawn, PieceCode.WhitePawn, PieceCode.WhitePawn, PieceCode.WhitePawn, PieceCode.EmptySquare, PieceCode.WhitePawn, PieceCode.WhitePawn, PieceCode.WhitePawn,
                PieceCode.WhiteRook, PieceCode.WhiteKnight, PieceCode.WhiteBishop, PieceCode.WhiteQueen, PieceCode.WhiteKing, PieceCode.WhiteBishop, PieceCode.WhiteKnight, PieceCode.WhiteRook
            ]));
            expect(JSON.stringify(game.castling_availability)).toBe(JSON.stringify({
                white: {
                    kingside: true,
                    queenside: true
                },
                black: {
                    kingside: true,
                    queenside: true
                }
            }));
            expect(game.en_passant_square).toBe(18);
            expect(game.fullmove_number).toBe(2);
            expect(game.halfmove_clock).toBe(0);
    
            done();
        });
    });
});
