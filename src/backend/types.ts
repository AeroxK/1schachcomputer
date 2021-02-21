export enum PieceCode {
    BlackKing = -99,
    BlackQueen = -9,
    BlackRook = -5,
    BlackBishop = -4,
    BlackKnight = -3,
    BlackPawn = -1,
    EmptySquare = 0,
    WhitePawn = 1,
    WhiteKnight = 3,
    WhiteBishop = 4,
    WhiteRook = 5,
    WhiteQueen = 9,
    WhiteKing = 99
}

export enum ActiveColor {
    Black = -1,
    White = 1
}

export type Board = PieceCode[];

interface CastlingAvailability {
    white: {
        kingside: boolean,
        queenside: boolean
    };
    black: {
        kingside: boolean,
        queenside: boolean
    }
}

export interface ChessGame {
    board: Board;
    active_color: ActiveColor;
    castling_availability: CastlingAvailability,
    en_passant_square: number,
    halfmove_clock: number,
    fullmove_number: number
}

export interface Move {
    from: number,
    to: number
}
