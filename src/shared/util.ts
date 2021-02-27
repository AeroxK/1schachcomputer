import { ActiveColor, Promotion, Move, Direction2D, Distance } from './types';

const PROMOTION_OFFSET = 51;

export function calcOffset(direction: Direction2D):number {
    return direction.horizontal_direction * Distance.Horizontal + direction.vertical_direction * Distance.Vertical;
}

export function decodePromotions(promotionMoves: Move[], active_color: ActiveColor): Promotion[] {
    return promotionMoves.map(move => {
        let directionToLeftMostPromotionSquare: Direction2D = 
            { horizontal_direction: -2, vertical_direction: active_color > 0 ? -1 : 1 };
        let pieceCodePlusOffset = move.to - PROMOTION_OFFSET * active_color;
        let promotionSquare = move.from + calcOffset(directionToLeftMostPromotionSquare);
        let squareEncodingOffset = active_color * 10;
    
        while (pieceCodePlusOffset > 10 || pieceCodePlusOffset < -10) {
            promotionSquare = promotionSquare + 1 * Distance.Horizontal;
            pieceCodePlusOffset = pieceCodePlusOffset - squareEncodingOffset;
        }

        return { move: { from: move.from, to: promotionSquare }, promote_to: pieceCodePlusOffset };
    });
}

export function encodePromotions(promotions: Promotion[], active_color: ActiveColor): number[] {
    const moveDirection: Direction2D = { horizontal_direction: 0, vertical_direction: active_color > 0 ? -1 : 1 }
    return promotions.map((promotion, i) => {
        const pieceCodeOffset = 10 * active_color;
        const horizontal_offset = promotion.move.to - (promotion.move.from + moveDirection.vertical_direction * Distance.Vertical); 
        return promotion.promote_to + PROMOTION_OFFSET * active_color + pieceCodeOffset * (horizontal_offset + 2);
    });
}

export function isMovePromotion(move: Move): boolean {
    return move.to < 0 || move.to > 63;
}
