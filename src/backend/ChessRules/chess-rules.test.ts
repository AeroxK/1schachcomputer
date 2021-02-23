import { PieceCode } from '../../shared/types';
import { getLegalSquaresForPiece } from './chess-rules';
import { startingPosition, scandinavian, e4e5 } from './samples/positions';

describe('Test Make Move', () => {

});

describe('Test Piece Moves', () => {

    test('Rook Moves', () => {
        let game = JSON.parse(JSON.stringify(startingPosition));
        let squares = getLegalSquaresForPiece(game, 56);
        expect(squares.length).toBe(0);
        
        game.board[16] = PieceCode.WhiteRook;
        squares = getLegalSquaresForPiece(game, 16);
        expect(squares.sort()).toEqual([8,17,18,19,20,21,22,23,24,32,40].sort());
    });

    test('Knight Moves', () => {
        let game = JSON.parse(JSON.stringify(startingPosition));
        let squares = getLegalSquaresForPiece(game, 57);
        expect(squares.sort()).toEqual([40, 42].sort());

        game.board[16] = PieceCode.WhiteKnight;
        squares = getLegalSquaresForPiece(game, 16);
        expect(squares.sort()).toEqual([1, 10, 26, 33].sort());
    });

    test('Bishop Moves', () => {
        let game = JSON.parse(JSON.stringify(startingPosition));
        let squares = getLegalSquaresForPiece(game, 58);
        expect(squares.length).toBe(0);

        game.board[16] = PieceCode.WhiteBishop;
        squares = getLegalSquaresForPiece(game, 16);
        expect(squares.sort()).toEqual([9, 25, 34, 43].sort());
    });

    test('Queen Moves', () => {
        let game = JSON.parse(JSON.stringify(startingPosition));
        let squares = getLegalSquaresForPiece(game, 59);
        expect(squares.length).toBe(0);

        game.board[16] = PieceCode.WhiteQueen;
        squares = getLegalSquaresForPiece(game, 16);
        expect(squares.sort()).toEqual([8,17,18,19,20,21,22,23,24,32,40, 9, 25, 34, 43].sort());
    });

    test('King Moves', () => {
        let game = JSON.parse(JSON.stringify(startingPosition));
        let squares = getLegalSquaresForPiece(game, 60);
        expect(squares.length).toBe(0);

        game.board[35] = PieceCode.WhiteKing;
        squares = getLegalSquaresForPiece(game, 35);
        expect(squares.sort()).toEqual([26, 27, 28, 36, 44, 43, 42, 34].sort());
    });

    test('Pawn Moves', () => {
        let game = JSON.parse(JSON.stringify(startingPosition));
        let squares = getLegalSquaresForPiece(game, 51);
        expect(squares.sort()).toEqual([43, 35].sort());

        game = e4e5;
        squares = getLegalSquaresForPiece(game, 36);
        expect(squares.length).toBe(0);
        
        game = scandinavian;
        squares = getLegalSquaresForPiece(game, 36);
        expect(squares.sort()).toEqual([27,28].sort());
    });

});
