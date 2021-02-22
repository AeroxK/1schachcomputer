import { ChessGame, ActiveColor, Board, PieceCode } from '../../shared/types';

const FenSquares = [
    'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
    'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
    'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
    'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
    'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
    'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
    'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
    'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
]

enum FenPieceCode {
    BlackRook = 'r',
    BlackKnight = 'n',
    BlackBishop = 'b',
    BlackQueen = 'q',
    BlackKing = 'k',
    BlackPawn = 'p',
    WhiteRook = 'R',
    WhiteKnight = 'N',
    WhiteBishop = 'B',
    WhiteQueen = 'Q',
    WhiteKing = 'K',
    WhitePawn = 'P',
}

interface PieceCodeMap {
    fenCode: FenPieceCode,
    technicalCode: PieceCode
}

const PieceCodeMaps: PieceCodeMap[] = [
    { fenCode: FenPieceCode.BlackRook, technicalCode: PieceCode.BlackRook },
    { fenCode: FenPieceCode.BlackKnight, technicalCode: PieceCode.BlackKnight },
    { fenCode: FenPieceCode.BlackBishop, technicalCode: PieceCode.BlackBishop },
    { fenCode: FenPieceCode.BlackQueen, technicalCode: PieceCode.BlackQueen },
    { fenCode: FenPieceCode.BlackKing, technicalCode: PieceCode.BlackKing },
    { fenCode: FenPieceCode.BlackPawn, technicalCode: PieceCode.BlackPawn },
    { fenCode: FenPieceCode.WhiteRook, technicalCode: PieceCode.WhiteRook },
    { fenCode: FenPieceCode.WhiteKnight, technicalCode: PieceCode.WhiteKnight },
    { fenCode: FenPieceCode.WhiteBishop, technicalCode: PieceCode.WhiteBishop },
    { fenCode: FenPieceCode.WhiteQueen, technicalCode: PieceCode.WhiteQueen },
    { fenCode: FenPieceCode.WhiteKing, technicalCode: PieceCode.WhiteKing },
    { fenCode: FenPieceCode.WhitePawn, technicalCode: PieceCode.WhitePawn },
];

enum FenColor {
    White = 'w',
    Black = 'b'
}

enum FenCastlingCode {
    WhiteKingside = 'K',
    WhiteQueenside = 'Q',
    BlackKingside = 'k',
    BlackQueenside = 'q'
}

export function read(fen: string): ChessGame {
    let [
        fen_board,
        fen_active_color,
        fen_castling_availability,
        fen_en_passant_square,
        fen_halfmove_clock,
        fen_fullmove_number
    ] = fen.split(' ');

    const board = parseBoard(fen_board);

    const active_color = fen_active_color === FenColor.White ? ActiveColor.White : ActiveColor.Black;
    const castling_availability = {
        white: {
            kingside: fen_castling_availability.includes(FenCastlingCode.WhiteKingside),
            queenside: fen_castling_availability.includes(FenCastlingCode.WhiteQueenside)
        },
        black: {
            kingside: fen_castling_availability.includes(FenCastlingCode.BlackKingside),
            queenside: fen_castling_availability.includes(FenCastlingCode.BlackQueenside)
        }
    };
    const en_passant_square = FenSquares.indexOf(fen_en_passant_square) || -1;
    const halfmove_clock = parseInt(fen_halfmove_clock);
    const fullmove_number = parseInt(fen_fullmove_number);

    return {
        board, active_color, castling_availability, en_passant_square, halfmove_clock, fullmove_number
    }
}

export function write(game: ChessGame): string {
    return '';
}

function parseBoard(fen_board: string): Board {
    fen_board = fen_board.replace(/\//g, '');
    let board: Board = [];
    for (let i = 0; i < fen_board.length; i++) {
        const currentChar = fen_board.charAt(i);
        const emptySquares = parseInt(currentChar);
        if (isNaN(emptySquares)) {
            const technicalCode = PieceCodeMaps.find(
                map => map.fenCode === currentChar
                )?.technicalCode;
            board.push(technicalCode || PieceCode.EmptySquare);
        } else {
            for (let j = 0; j < emptySquares; j++) {
                board.push(PieceCode.EmptySquare);
            }
        }
    }

    return board;
}
