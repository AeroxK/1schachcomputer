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

export interface GameState {
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

export interface Promotion {
    move: Move,
    promote_to: PieceCode,
}

export type Direction = -2 | -1 | 0 | 1 | 2;

export interface Direction2D {
    horizontal_direction: Direction,
    vertical_direction: Direction
}

export enum Distance {
    Horizontal = 1,
    Vertical = 8
}
