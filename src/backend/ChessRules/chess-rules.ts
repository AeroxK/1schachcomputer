import { ActiveColor, ChessGame, PieceCode } from "../../shared/types";

interface MovePatternFunction {
    (game: ChessGame, square: number): number[]
}

type PieceMovePatternMap = {
    move_pattern_fn: MovePatternFunction,
    piece_codes: PieceCode[]
}

type Direction2D = {
    horizontal_direction: -1 | 0 | 1,
    vertical_direction: -1 | 0 | 1
}

enum Distance {
    Horizontal = 1,
    Vertical = 8
}

function isInBounds(square: number) {
    return square >= 0 && square < 64;
}

function isFriendlyPieceOn(square: number, game: ChessGame):boolean {
    const pieceCode: PieceCode = game.board[square];
    return pieceCode !== 0 && pieceCode > 0 === game.active_color > 0;
}

function isEdgeAt(square: number):boolean {
    return (square % 8 === 0) || (square % 8 === 7) || (square > 0 && square < 7) || (square > 56 && square < 63);
}

function isEdgeInDirection(square: number, direction: Direction2D) {
    return (
        direction.horizontal_direction === -1 && (square % 8 === 0) ||
        direction.horizontal_direction === 1 && (square % 8 === 7) ||
        direction.vertical_direction === -1 && (square > 0 && square < 7) ||
        direction.vertical_direction === 1 && (square > 56 && square < 63)
    );
}

function findSquaresInDirection(game: ChessGame, square: number, direction: Direction2D): number[] {
    if (isEdgeInDirection(square, direction)) return [];
    let next_square = square + (direction.vertical_direction * Distance.Vertical + direction.horizontal_direction * Distance.Horizontal);
    let squares: number[] = [];
    let pieceCaptured = false;
    let onEdge = false;

    while (isInBounds(next_square) && !(isFriendlyPieceOn(next_square, game) || pieceCaptured || onEdge)) {
        squares.push(next_square);
        pieceCaptured = game.board[next_square] !== 0;
        onEdge = isEdgeInDirection(next_square, direction);
        next_square = next_square + (direction.vertical_direction * Distance.Vertical + direction.horizontal_direction * Distance.Horizontal);
    }

    return squares;
}

let diagonalMoves: MovePatternFunction;
let straightMoves: MovePatternFunction;
let getLegalSquaresForPiece: MovePatternFunction;

diagonalMoves = (game, square) => {
    const directions: Direction2D[] = [
        { horizontal_direction: 1, vertical_direction: 1 },
        { horizontal_direction: 1, vertical_direction: -1 },
        { horizontal_direction: -1, vertical_direction: -1 },
        { horizontal_direction: -1, vertical_direction: 1 }
    ];

    let squares: number[] = [];
    
    directions.forEach(direction => {
        squares = squares.concat(findSquaresInDirection(game, square, direction));
    });


    return squares;
}

straightMoves = (game, square) => {
    const directions: Direction2D[] = [
        { horizontal_direction: 0, vertical_direction: 1 },
        { horizontal_direction: 1, vertical_direction: 0 },
        { horizontal_direction: 0, vertical_direction: -1 },
        { horizontal_direction: -1, vertical_direction: 0 }
    ];

    let squares: number[] = [];
    
    directions.forEach(direction => {
        squares = squares.concat(findSquaresInDirection(game, square, direction));
    });

    return squares;
}

const movePatterns: PieceMovePatternMap[] = [
    {
        move_pattern_fn: straightMoves,
        piece_codes: [
            PieceCode.WhiteRook,
            PieceCode.BlackRook,
            PieceCode.WhiteQueen,
            PieceCode.BlackQueen
        ]
    },
    {
        move_pattern_fn: diagonalMoves,
        piece_codes: [
            PieceCode.WhiteBishop,
            PieceCode.BlackBishop,
            PieceCode.WhiteQueen,
            PieceCode.BlackQueen
        ]
    }
]

getLegalSquaresForPiece = (game, square) => {
    const piece_code: PieceCode = game.board[square];
    // if (!isPieceActive(game, piece_code)) return [];
    return movePatterns
        .filter(pattern => pattern.piece_codes.includes(piece_code))
        .map(pattern => pattern.move_pattern_fn(game, square))
        .reduce((allSquares, currSquares) => allSquares.concat(currSquares), []);
}

export { getLegalSquaresForPiece };
