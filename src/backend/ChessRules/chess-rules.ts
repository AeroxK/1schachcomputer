import { ActiveColor, ChessGame, Move, PieceCode } from "../../shared/types";

interface MovePatternFunction {
    (game: ChessGame, square: number): number[]
}

type PieceMovePatternMap = {
    move_pattern_fn: MovePatternFunction,
    piece_codes: PieceCode[]
}

type Direction2D = {
    horizontal_direction: -2 | -1 | 0 | 1 | 2,
    vertical_direction: -2 | -1 | 0 | 1 | 2
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
        direction.horizontal_direction < 0 && (square % 8 === 0) ||
        direction.horizontal_direction > 0 && (square % 8 === 7) ||
        direction.vertical_direction < 0 && (square > 0 && square < 7) ||
        direction.vertical_direction > 0 && (square > 56 && square < 63)
    );
}

function findSquaresInDirection(game: ChessGame, square: number, direction: Direction2D, maxSteps: number = -1): number[] {
    if (isEdgeInDirection(square, direction)) return [];
    let next_square = square + (direction.vertical_direction * Distance.Vertical + direction.horizontal_direction * Distance.Horizontal);
    let squares: number[] = [];
    let pieceCaptured = false;
    let onEdge = false;

    while (isInBounds(next_square) && !(isFriendlyPieceOn(next_square, game) || pieceCaptured || onEdge || maxSteps === 0)) {
        squares.push(next_square);
        pieceCaptured = game.board[next_square] !== 0;
        onEdge = isEdgeInDirection(next_square, direction);
        maxSteps = maxSteps - 1;
        next_square = next_square + (direction.vertical_direction * Distance.Vertical + direction.horizontal_direction * Distance.Horizontal);
    }

    return squares;
}

let diagonalMoves: MovePatternFunction;
let straightMoves: MovePatternFunction;
let knightMoves: MovePatternFunction;
let kingMoves: MovePatternFunction;
let pawnMoves: MovePatternFunction;
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

knightMoves = (game, square) => {
    const directions: Direction2D[] = [
        { horizontal_direction: 1, vertical_direction: -2 },
        { horizontal_direction: 2, vertical_direction: -1 },
        { horizontal_direction: 2, vertical_direction: 1 },
        { horizontal_direction: 1, vertical_direction: 2 },
        { horizontal_direction: -1, vertical_direction: 2 },
        { horizontal_direction: -2, vertical_direction: 1 },
        { horizontal_direction: -2, vertical_direction: -1 },
        { horizontal_direction: -1, vertical_direction: -2 },
    ];

    return directions.filter(direction => {
            if (isEdgeInDirection(square, direction)) return false;
            
            const offset = Math.abs(direction.horizontal_direction) === 2 ?
            direction.horizontal_direction / 2 * Distance.Horizontal :
            direction.vertical_direction / 2 * Distance.Vertical;
            return !isEdgeInDirection(square + offset, direction);
        })
        .map(direction => square + direction.horizontal_direction * Distance.Horizontal + direction.vertical_direction * Distance.Vertical)
        .filter(square => !isFriendlyPieceOn(square, game) && isInBounds(square));
}

kingMoves = (game, square) => {
    const directions: Direction2D[] = [
        { horizontal_direction: 1, vertical_direction: 1 },
        { horizontal_direction: 1, vertical_direction: -1 },
        { horizontal_direction: -1, vertical_direction: -1 },
        { horizontal_direction: -1, vertical_direction: 1 },
        { horizontal_direction: 0, vertical_direction: 1 },
        { horizontal_direction: 1, vertical_direction: 0 },
        { horizontal_direction: 0, vertical_direction: -1 },
        { horizontal_direction: -1, vertical_direction: 0 }
    ];

    let squares: number[] = [];
    
    directions.forEach(direction => {
        squares = squares.concat(findSquaresInDirection(game, square, direction, 1));
    });

    return squares;
}

pawnMoves = (game, square) => {
    const pieceCode = game.board[square];
    const isWhite = pieceCode > 0;
    const moveDirection: Direction2D = { horizontal_direction: 0, vertical_direction: isWhite ? -1 : 1 }
    const captureDirections: Direction2D[] = [
        { horizontal_direction: -1, vertical_direction: isWhite ? -1 : 1 },
        { horizontal_direction: 1, vertical_direction: isWhite ? -1 : 1 }
    ];

    let squares: number[] = [];

    let front_square = square + moveDirection.vertical_direction * Distance.Vertical;
    if (game.board[front_square] === 0) {
        squares.push(front_square);
    }
    front_square = front_square + moveDirection.vertical_direction * Distance.Vertical;
    if (game.board[front_square] === 0 && ((isWhite && square > 47 && square < 56) || (!isWhite && square > 7 && square < 16))) {
        squares.push(front_square);
    }
    squares = squares.concat(captureDirections
        .map(direction => square + direction.horizontal_direction * Distance.Horizontal + direction.vertical_direction * Distance.Vertical)
        .filter(capture_square => isWhite ? game.board[capture_square] < 0 : game.board[capture_square] > 0));

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
    },
    {
        move_pattern_fn: knightMoves,
        piece_codes: [
            PieceCode.WhiteKnight,
            PieceCode.BlackKnight
        ]
    },
    {
        move_pattern_fn: pawnMoves,
        piece_codes: [
            PieceCode.WhitePawn,
            PieceCode.BlackPawn
        ]
    },
    {
        move_pattern_fn: kingMoves,
        piece_codes: [
            PieceCode.WhiteKing,
            PieceCode.BlackKing
        ]
    }
]

getLegalSquaresForPiece = (game, square) => {
    const piece_code: PieceCode = game.board[square];
    if (piece_code === 0 || !(game.active_color > 0 === piece_code > 0)) return [];
    return movePatterns
        .filter(pattern => pattern.piece_codes.includes(piece_code))
        .map(pattern => pattern.move_pattern_fn(game, square))
        .reduce((allSquares, currSquares) => allSquares.concat(currSquares), []);
}

function makeMove(move: Move, game: ChessGame): ChessGame {
    game.board[move.to] = game.board[move.from];
    game.board[move.from] = PieceCode.EmptySquare;
    const blackMoved = game.active_color < 0;
    game.active_color = blackMoved ? ActiveColor.White : ActiveColor.Black;
    game.fullmove_number = blackMoved ? game.fullmove_number + 1 : game.fullmove_number;
    return game;
}

export { getLegalSquaresForPiece, makeMove };
