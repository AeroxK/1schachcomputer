import { PieceCode } from '../../shared/types';
import { getLegalSquaresForPiece } from './chess-rules';
import { startingPosition } from './samples/positions';

describe('Test Piece Moves', () => {

    test('Rook Moves', () => {
        let game = startingPosition;
        let squares = getLegalSquaresForPiece(game, 56);
        expect(squares.length).toBe(0);
        
        game.board[16] = PieceCode.WhiteRook;
        squares = getLegalSquaresForPiece(game, 16);
        expect(squares.sort()).toEqual([8,17,18,19,20,21,22,23,24,32,40].sort());
    });

    /*
    test('Knight Moves', () => {
        let squares = getLegalSquaresForPiece(startingPosition, 57);
        expect(squares).toEqual([40, 42]);

        squares = getLegalSquaresForPiece(knightOnC6, 18);
        expect(squares).toEqual([1, 3, 8, 12, 24, 28, 33, 35]);
    });
    */

    test('Bishop Moves', () => {
        let game = startingPosition;
        let squares = getLegalSquaresForPiece(game, 58);
        expect(squares.length).toBe(0);

        game.board[16] = PieceCode.WhiteBishop;
        squares = getLegalSquaresForPiece(game, 16);
        expect(squares.sort()).toEqual([9, 25, 34, 43].sort());
    });

    test('Queen Moves', () => {
        let game = startingPosition;
        let squares = getLegalSquaresForPiece(game, 59);
        expect(squares.length).toBe(0);

        game.board[16] = PieceCode.WhiteQueen;
        squares = getLegalSquaresForPiece(game, 16);
        expect(squares.sort()).toEqual([8,17,18,19,20,21,22,23,24,32,40, 9, 25, 34, 43].sort());
    });

});
