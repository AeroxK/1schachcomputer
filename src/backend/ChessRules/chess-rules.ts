import { ActiveColor, GameState, Move, PieceCode, Direction2D, Distance, Promotion } from "../../shared/types";
import { calcOffset, decodePromotions, encodePromotions, isMovePromotion } from "../../shared/util";

interface MovePatternFunction {
    (game: GameState, square: number): number[]
}

type PieceMovePatternMap = {
    move_pattern_fn: MovePatternFunction,
    piece_codes: PieceCode[]
}

function isFriendlyPiece(my_square: number, other_square: number, game: GameState):boolean {
    const my_piece_code = game.board[my_square];
    const other_piece_code = game.board[other_square];

    return other_piece_code !== 0 && other_piece_code > 0 === my_piece_code > 0;
}

function isEnemyPiece(my_square: number, other_square: number, game: GameState):boolean {
    const my_piece_code = game.board[my_square];
    const other_piece_code = game.board[other_square];

    return other_piece_code !== 0 && other_piece_code > 0 !== my_piece_code > 0;
}

function isEdgeInDirection(square: number, direction: Direction2D) {
    return (
        direction.horizontal_direction < 0 && (square % 8 === 0) ||
        direction.horizontal_direction > 0 && (square % 8 === 7) ||
        direction.vertical_direction < 0 && (square >= 0 && square <= 7) ||
        direction.vertical_direction > 0 && (square >= 56 && square <= 63)
    );
}

function findSquaresInDirection(game: GameState, square: number, direction: Direction2D, maxSteps: number = -1): number[] {
    if (isEdgeInDirection(square, direction)) return [];
    let next_square = square + (direction.vertical_direction * Distance.Vertical + direction.horizontal_direction * Distance.Horizontal);
    let squares: number[] = [];
    let pieceCaptured = false;
    let onEdge = false;

    while (!(isFriendlyPiece(square, next_square, game) || pieceCaptured || onEdge || maxSteps === 0)) {
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
        .filter(next_square => !isFriendlyPiece(square, next_square, game));
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
        .filter(el => isEnemyPiece(square, el.square, game) && el.pieceCode !== enemyKing)
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
            squares.push(square + calcOffset({ horizontal_direction: -2, vertical_direction: 0 }));
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
            squares.push(square + calcOffset({ horizontal_direction: 2, vertical_direction: 0 }));
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

    const isPromotion = (isWhite && square > 7 && square < 16) || (!isWhite && square > 47 && square < 56);
    if (isPromotion) {
        const promotionPieces: PieceCode[] = isWhite ?
            [PieceCode.WhiteKnight, PieceCode.WhiteBishop, PieceCode.WhiteRook, PieceCode.WhiteQueen] :
            [PieceCode.BlackKnight, PieceCode.BlackBishop, PieceCode.BlackRook, PieceCode.BlackQueen];
        const promotions: Promotion[] = squares
            .map(promotionSquare => promotionPieces.map(promote_to => { return { move: { from: square, to: promotionSquare }, promote_to }; }))
            .reduce((allPromotions: Promotion[], current: Promotion[]) => allPromotions.concat(current), []);
        return encodePromotions(promotions, isWhite ? ActiveColor.White : ActiveColor.Black);
    } else {
        return squares;
    }
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

function isActiveKingInCheck(game: GameState):boolean {
    const kingPieceCode = game.active_color > 0 ? PieceCode.WhiteKing : PieceCode.BlackKing;
    const kingPosition = game.board.indexOf(kingPieceCode);
    const enemyPieceSquares = game.board
        .map((pieceCode, square) => { return { pieceCode, square }; })
        .filter(el => isEnemyPiece(kingPosition, el.square, game))
        .map(el => el.square);
    
    return enemyPieceSquares.some(enemyPiece => {
        let squares = getActiveColorIndependentSquares(game, enemyPiece);
        if (squares.length && isMovePromotion({ from: enemyPiece, to: squares[0] })) {
            let promotions = decodePromotions(
                squares.map(square => { return { from: enemyPiece, to: square }; }),
                game.active_color > 0 ? -1 : 1
            );
            squares = promotions.map(promotion => promotion.move.to);
        }
        return squares.includes(kingPosition);
    });
}

getLegalSquaresForPiece = (game, square) => {
    const piece_code: PieceCode = game.board[square];
    if (piece_code === 0 || piece_code > 0 !== game.active_color > 0) return [];
    const next_squares = getActiveColorIndependentSquares(game, square);

    return next_squares.filter(next_square => {
        const game_clone = JSON.parse(JSON.stringify(game));
        game_clone.board[next_square] = game_clone.board[square];
        game_clone.board[square] = PieceCode.EmptySquare;
        return !isActiveKingInCheck(game_clone);
    });
}

function manageCastlingAvailability(move: Move, game: GameState, blackMoved: boolean):GameState {
    const kingPieceCode = blackMoved ? PieceCode.BlackKing : PieceCode.WhiteKing;
    const rookPieceCode = blackMoved ? PieceCode.BlackRook : PieceCode.WhiteRook;
    const castling = blackMoved ? game.castling_availability.black : game.castling_availability.white;
    const queensideRookSquare = blackMoved ? 0 : 56;
    const kingsideRookSquare = blackMoved ? 7 : 63;
    const castlingOpponent = blackMoved ? game.castling_availability.white : game.castling_availability.black;
    const queensideRookSquareOpponent = blackMoved ? 56 : 0;
    const kingsideRookSquareOpponent = blackMoved ? 63 : 7;
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
    } else if (castlingOpponent.kingside && move.to === kingsideRookSquareOpponent) {
        castlingOpponent.kingside = false;
    } else if (castlingOpponent.queenside && move.to === queensideRookSquareOpponent) {
        castlingOpponent.queenside = false;
    }
    return game;
}

function manageHalfmoveClock(move: Move, game: GameState, blackMoved: boolean):GameState {
    const pawnPieceCode: PieceCode = blackMoved ? PieceCode.BlackPawn : PieceCode.WhitePawn;
    if (game.board[move.from] === pawnPieceCode || game.board[move.to] !== 0) {
        game.halfmove_clock = 0;
    } else {
        game.halfmove_clock = game.halfmove_clock + 1;
    }
    return game;
}

function manageFullmoveNumber(game: GameState, blackMoved: boolean):GameState {
    game.fullmove_number = blackMoved ? game.fullmove_number + 1 : game.fullmove_number;
    return game;
}

function manageActiveColor(game: GameState, blackMoved: boolean):GameState {
    game.active_color = blackMoved ? ActiveColor.White : ActiveColor.Black;
    return game;
}

function manageEnPassant(move: Move, game: GameState, blackMoved: boolean):GameState {
    const pawnPieceCode: PieceCode = blackMoved ? PieceCode.BlackPawn : PieceCode.WhitePawn;
    let direction: Direction2D = { horizontal_direction: 0, vertical_direction: blackMoved ? -1 : 1 };

    if (move.to === game.en_passant_square && game.board[move.from] === pawnPieceCode) {
        game.board[move.to + calcOffset(direction)] = PieceCode.EmptySquare;
    }

    direction = { horizontal_direction: 0, vertical_direction: blackMoved ? 2 : -2 };

    if (
        game.board[move.from] === pawnPieceCode &&
        move.to - move.from === calcOffset(direction)
        ) {
        direction.vertical_direction = blackMoved ? 1 : -1;
        game.en_passant_square = move.from + calcOffset(direction);
    } else {
        game.en_passant_square = -1;
    }
    return game;
}

function managePromotions(move: Move, game: GameState, blackMoved: boolean): GameState {
    const promotion: Promotion = decodePromotions([move], blackMoved ? -1 : 1)[0];
    game.board[promotion.move.to] = promotion.promote_to;
    game.board[move.from] = PieceCode.EmptySquare;
    return game;
}

function makeMove(move: Move, game: GameState):GameState {

    const blackMoved = game.active_color < 0;

    game = manageCastlingAvailability(move, game, blackMoved);
    game = manageHalfmoveClock(move, game, blackMoved);
    game = manageFullmoveNumber(game, blackMoved);
    game = manageActiveColor(game, blackMoved);
    game = manageEnPassant(move, game, blackMoved);

    if (isMovePromotion(move)) {
        game = managePromotions(move, game, blackMoved);
    } else {
        game.board[move.to] = game.board[move.from];
        game.board[move.from] = PieceCode.EmptySquare;
    }

    return game;
}

export { getLegalSquaresForPiece, makeMove };
