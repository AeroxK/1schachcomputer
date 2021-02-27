import { ActiveColor, Promotion, PieceCode, Direction2D, Distance } from './types';

export function calcOffset(direction: Direction2D):number {
    return direction.horizontal_direction * Distance.Horizontal + direction.vertical_direction * Distance.Vertical;
}

export function decodePromotions(encodedPromotions: number[], pawnSquare: number, active_color: ActiveColor): Promotion[] {
    return encodedPromotions.map(encodedPromotion => {
        let directionToLeftMostPromotionSquare: Direction2D = 
            { horizontal_direction: -2, vertical_direction: active_color > 0 ? -1 : 1 };
        let pieceCodePlusOffset = encodedPromotion / pawnSquare;
        let promotionSquare = pawnSquare + calcOffset(directionToLeftMostPromotionSquare);
        let squareEncodingOffset = active_color * 10;
    
        while (pieceCodePlusOffset > 10 || pieceCodePlusOffset < -10) {
            promotionSquare = promotionSquare + 1 * Distance.Horizontal;
            pieceCodePlusOffset = pieceCodePlusOffset - squareEncodingOffset;
        }

        return { promote_to: pieceCodePlusOffset, square: promotionSquare };
    });
}

export function encodePromotions(promotions: Promotion[], pawnSquare: number, active_color: ActiveColor): number[] {
    const moveDirection: Direction2D = { horizontal_direction: 0, vertical_direction: active_color > 0 ? -1 : 1 }
    return promotions.map((promotion, i) => {
        const pieceCodeOffset = active_color > 0 ? 10 : -10;
        const horizontal_offset = promotion.square - (pawnSquare + moveDirection.vertical_direction * Distance.Vertical); 
        return (promotion.promote_to + pieceCodeOffset * (horizontal_offset + 2)) * pawnSquare;
    });
}
