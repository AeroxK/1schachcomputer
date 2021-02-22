import { ChessGame, PieceCode, ActiveColor } from '../../../shared/types'

export const startingPosition: ChessGame = {
    board: [
        PieceCode.BlackRook, PieceCode.BlackKnight, PieceCode.BlackBishop, PieceCode.BlackQueen, PieceCode.BlackKing, PieceCode.BlackBishop, PieceCode.BlackKnight, PieceCode.BlackRook,
        PieceCode.BlackPawn, PieceCode.BlackPawn, PieceCode.BlackPawn, PieceCode.BlackPawn, PieceCode.BlackPawn, PieceCode.BlackPawn, PieceCode.BlackPawn, PieceCode.BlackPawn,
        PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare,
        PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare,
        PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare,
        PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare, PieceCode.EmptySquare,
        PieceCode.WhitePawn, PieceCode.WhitePawn, PieceCode.WhitePawn, PieceCode.WhitePawn, PieceCode.WhitePawn, PieceCode.WhitePawn, PieceCode.WhitePawn, PieceCode.WhitePawn,
        PieceCode.WhiteRook, PieceCode.WhiteKnight, PieceCode.WhiteBishop, PieceCode.WhiteQueen, PieceCode.WhiteKing, PieceCode.WhiteBishop, PieceCode.WhiteKnight, PieceCode.WhiteRook
    ],
    active_color: ActiveColor.White,
    castling_availability: {
        white: { kingside: true, queenside: true },
        black: { kingside: true, queenside: true }
    },
    en_passant_square: -1,
    halfmove_clock: 0,
    fullmove_number: 1
};
