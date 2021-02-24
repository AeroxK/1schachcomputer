import { ActiveColor, ChessGame, Move, PieceCode } from "../../shared/types";
import { enPassantExpired } from "./samples/positions";

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

function isFriendlyPiece(pieceCode: PieceCode, game: ChessGame) {
    return pieceCode !== 0 && pieceCode > 0 === game.active_color > 0;
}

function isEnemyPiece(pieceCode: PieceCode, game: ChessGame) {
    return pieceCode !== 0 && pieceCode > 0 !== game.active_color > 0;
}

function offset(direction: Direction2D):number {
    return direction.horizontal_direction * Distance.Horizontal + direction.vertical_direction * Distance.Vertical;
}

function isFriendlyPieceOn(square: number, game: ChessGame):boolean {
    const pieceCode: PieceCode = game.board[square];
    return isFriendlyPiece(pieceCode, game);
}

function isEdgeInDirection(square: number, direction: Direction2D) {
    return (
        direction.horizontal_direction < 0 && (square % 8 === 0) ||
        direction.horizontal_direction > 0 && (square % 8 === 7) ||
        direction.vertical_direction < 0 && (square >= 0 && square <= 7) ||
        direction.vertical_direction > 0 && (square >= 56 && square <= 63)
    );
}

function findSquaresInDirection(game: ChessGame, square: number, direction: Direction2D, maxSteps: number = -1): number[] {
    if (isEdgeInDirection(square, direction)) return [];
    let next_square = square + (direction.vertical_direction * Distance.Vertical + direction.horizontal_direction * Distance.Horizontal);
    let squares: number[] = [];
    let pieceCaptured = false;
    let onEdge = false;

    while (!(isFriendlyPieceOn(next_square, game) || pieceCaptured || onEdge || maxSteps === 0)) {
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
let getActiveColorIndependentSquares: MovePatternFunction;

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
        .filter(square => !isFriendlyPieceOn(square, game));
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

    const pieceCode = game.board[square];
    const isWhite = pieceCode > 0;
    const castling = isWhite ? game.castling_availability.white : game.castling_availability.black;
    const enemyKing = isWhite ? PieceCode.BlackKing : PieceCode.WhiteKing;
    const enemyPieceSquares = game.board
        .map((pieceCode, square) => { return { pieceCode, square }; })
        .filter(el => isEnemyPiece(el.pieceCode, game) && el.pieceCode !== enemyKing)
        .map(el => el.square);

    if (castling.queenside) {
        const queensideSquares = findSquaresInDirection(game, square, { horizontal_direction: -1, vertical_direction: 0 });
        if (queensideSquares.length === 3 &&
            !queensideSquares
                .map(square => square + 1)
                .some(square => {
                    return enemyPieceSquares.some(enemyPiece => {
                        return getActiveColorIndependentSquares(game, enemyPiece).includes(square);
                    });
                }))
        {
            squares.push(square + offset({ horizontal_direction: -2, vertical_direction: 0 }));
        }
    }

    if (castling.kingside) {
        const kingsideSquares = findSquaresInDirection(game, square, { horizontal_direction: 1, vertical_direction: 0 });
        if (kingsideSquares.length === 2 &&
            !kingsideSquares
                .concat([square])
                .some(square => {
                    return enemyPieceSquares.some(enemyPiece => {
                        return getActiveColorIndependentSquares(game, enemyPiece).includes(square);
                    });
                }))
        {
            squares.push(square + offset({ horizontal_direction: 2, vertical_direction: 0 }));
        }
    }

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

        front_square = front_square + moveDirection.vertical_direction * Distance.Vertical;
        if (game.board[front_square] === 0 && ((isWhite && square > 47 && square < 56) || (!isWhite && square > 7 && square < 16))) {
            squares.push(front_square);
        }
    }
    squares = squares.concat(captureDirections
        .filter(direction => !isEdgeInDirection(square, direction))
        .map(direction => square + direction.horizontal_direction * Distance.Horizontal + direction.vertical_direction * Distance.Vertical)
        .filter(capture_square => capture_square === game.en_passant_square || (isWhite ? game.board[capture_square] < 0 : game.board[capture_square] > 0)));

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

getActiveColorIndependentSquares = (game, square) => {
    const piece_code: PieceCode = game.board[square];
    return movePatterns
        .filter(pattern => pattern.piece_codes.includes(piece_code))
        .map(pattern => pattern.move_pattern_fn(game, square))
        .reduce((allSquares, currSquares) => allSquares.concat(currSquares), []);
}

getLegalSquaresForPiece = (game, square) => {
    const piece_code: PieceCode = game.board[square];
    if (isEnemyPiece(piece_code, game)) return [];
    return getActiveColorIndependentSquares(game, square);
}

function manageCastlingAvailability(move: Move, game: ChessGame, blackMoved: boolean):ChessGame {
    const kingPieceCode = blackMoved ? PieceCode.BlackKing : PieceCode.WhiteKing;
    const rookPieceCode = blackMoved ? PieceCode.BlackRook : PieceCode.WhiteRook;
    const castling = blackMoved ? game.castling_availability.black : game.castling_availability.white;
    const queensideRookSquare = blackMoved ? 0 : 56;
    const kingsideRookSquare = blackMoved ? 7 : 63;
    if ((castling.kingside || castling.queenside) && game.board[move.from] === kingPieceCode) {
        castling.kingside = false;
        castling.queenside = false;
        if (move.from - move.to === 2) {
            game.board[queensideRookSquare] = PieceCode.EmptySquare;
            game.board[move.to + 1] = rookPieceCode;
        }
        if (move.from - move.to === -2) {
            game.board[kingsideRookSquare] = PieceCode.EmptySquare;
            game.board[move.to - 1] = rookPieceCode;
        }
    } else if (castling.queenside && move.from === queensideRookSquare) {
        castling.queenside = false;
    } else if (castling.kingside && move.from === kingsideRookSquare) {
        castling.kingside = false;
    }
    return game;
}

function manageHalfmoveClock(move: Move, game: ChessGame, blackMoved: boolean):ChessGame {
    const pawnPieceCode: PieceCode = blackMoved ? PieceCode.BlackPawn : PieceCode.WhitePawn;
    if (game.board[move.from] === pawnPieceCode || game.board[move.to] !== 0) {
        game.halfmove_clock = 0;
    } else {
        game.halfmove_clock = game.halfmove_clock + 1;
    }
    return game;
}

function manageFullmoveNumber(game: ChessGame, blackMoved: boolean):ChessGame {
    game.fullmove_number = blackMoved ? game.fullmove_number + 1 : game.fullmove_number;
    return game;
}

function manageActiveColor(game: ChessGame, blackMoved: boolean):ChessGame {
    game.active_color = blackMoved ? ActiveColor.White : ActiveColor.Black;
    return game;
}

function manageEnPassant(move: Move, game: ChessGame, blackMoved: boolean):ChessGame {
    const pawnPieceCode: PieceCode = blackMoved ? PieceCode.BlackPawn : PieceCode.WhitePawn;
    let direction: Direction2D = { horizontal_direction: 0, vertical_direction: blackMoved ? -1 : 1 };

    if (move.to === game.en_passant_square && game.board[move.from] === pawnPieceCode) {
        game.board[move.to + offset(direction)] = PieceCode.EmptySquare;
    }

    direction = { horizontal_direction: 0, vertical_direction: blackMoved ? 2 : -2 };

    if (
        game.board[move.from] === pawnPieceCode &&
        move.to - move.from === offset(direction)
        ) {
        direction.vertical_direction = blackMoved ? 1 : -1;
        game.en_passant_square = move.from + offset(direction);
    } else {
        game.en_passant_square = -1;
    }
    return game;
}

function makeMove(move: Move, game: ChessGame):ChessGame {

    const blackMoved = game.active_color < 0;

    game = manageCastlingAvailability(move, game, blackMoved);
    game = manageHalfmoveClock(move, game, blackMoved);
    game = manageFullmoveNumber(game, blackMoved);
    game = manageActiveColor(game, blackMoved);
    game = manageEnPassant(move, game, blackMoved);

    game.board[move.to] = game.board[move.from];
    game.board[move.from] = PieceCode.EmptySquare;

    return game;
}

export { getLegalSquaresForPiece, makeMove };
