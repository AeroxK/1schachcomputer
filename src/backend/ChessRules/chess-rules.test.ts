import { ActiveColor, Move, PieceCode } from '../../shared/types';
import { getLegalSquaresForPiece, makeMove } from './chess-rules';
import { startingPosition, scandinavian, e4e5, enPassant, enPassantExpired } from './samples/positions';

describe('Test Make Move', () => {
    test('Move Pieces', () => {
        let game = JSON.parse(JSON.stringify(startingPosition));
        const move: Move = { from: 51, to: 35 }
        game = makeMove(move, game);

        expect(game.board[move.from]).toBe(PieceCode.EmptySquare);
        expect(game.board[move.to]).toBe(PieceCode.WhitePawn);
    });

    test('Manage Active Color', () => {
        let game = JSON.parse(JSON.stringify(startingPosition));
        game = makeMove({ from: 51, to: 35 }, game);
        expect(game.active_color).toBe(ActiveColor.Black);

        game = makeMove({ from: 11, to: 27 }, game);
        expect(game.active_color).toBe(ActiveColor.White);
    });

    test('Increment Full Move Number', () => {
        let game = JSON.parse(JSON.stringify(startingPosition));
        game = makeMove({ from: 51, to: 35 }, game);
        expect(game.fullmove_number).toBe(1);

        game = makeMove({ from: 11, to: 27 }, game);
        expect(game.fullmove_number).toBe(2);
    });

    test('Manage Half Move Clock', () => {
        let game = JSON.parse(JSON.stringify(startingPosition));
        game = makeMove({ from: 62, to: 45 }, game);
        expect(game.halfmove_clock).toBe(1);

        game = makeMove({ from: 11, to: 27 }, game);
        expect(game.halfmove_clock).toBe(0);
    });

    test('Manage En Passant Square', () => {
        let game = JSON.parse(JSON.stringify(startingPosition));
        game = makeMove({ from: 51, to: 35 }, game);
        expect(game.en_passant_square).toBe(43);

        game = makeMove({ from: 6, to: 21 }, game);
        expect(game.en_passant_square).toBe(-1);

        game = JSON.parse(JSON.stringify(enPassant));
        game = makeMove({ from: 28, to: 21 }, game);
        expect(game.board[29]).toBe(PieceCode.EmptySquare);
    });

    test('Manage castling availability', () => {
        let game = JSON.parse(JSON.stringify(startingPosition));
        game = makeMove({ from: 52, to: 36 }, game);
        game = makeMove({ from: 15, to: 31 }, game);
        game = makeMove({ from: 60, to: 52 }, game);
        
        expect(game.castling_availability.white.kingside).toBeFalsy();
        expect(game.castling_availability.white.queenside).toBeFalsy();
        
        game = makeMove({ from: 7, to: 23 }, game);

        expect(game.castling_availability.black.kingside).toBeFalsy();
        expect(game.castling_availability.black.queenside).toBeTruthy();
    });

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

        game.board[43] = PieceCode.WhiteKnight;
        squares = getLegalSquaresForPiece(game, 51);
        expect(squares.length).toBe(0);

        game.board[24] = PieceCode.WhitePawn;
        squares = getLegalSquaresForPiece(game, 24);
        expect(squares).toEqual([16]);

        game = JSON.parse(JSON.stringify(e4e5));
        squares = getLegalSquaresForPiece(game, 36);
        expect(squares.length).toBe(0);
        
        game = JSON.parse(JSON.stringify(scandinavian));
        squares = getLegalSquaresForPiece(game, 36);
        expect(squares.sort()).toEqual([27,28].sort());
        
        game = JSON.parse(JSON.stringify(enPassant));
        squares = getLegalSquaresForPiece(game, 28);
        expect(squares.sort()).toEqual([20,21].sort());

        game = JSON.parse(JSON.stringify(enPassantExpired));
        squares = getLegalSquaresForPiece(game, 28);
        expect(squares.sort()).toEqual([20].sort());
    });

});
