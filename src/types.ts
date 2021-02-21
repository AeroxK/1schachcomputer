export enum PieceCode {
    EmptySquare = 0,
    Pawn = 1,
    Knight = 3,
    Bishop = 4,
    Rook = 5,
    Queen = 9,
    King = 99
}

export type Board = PieceCode[];

export interface ChessGame {
    board: Board;
    active_color: boolean;
}
