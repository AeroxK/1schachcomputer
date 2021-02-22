import React from 'react';

import { API_URL } from '../../shared/config';
import { Board, PieceCode } from '../../shared/types';

import './chess-board.css';
import BlackRook from './icons/black-rook.svg';
import BlackKnight from './icons/black-knight.svg';
import BlackBishop from './icons/black-bishop.svg';
import BlackQueen from './icons/black-queen.svg';
import BlackKing from './icons/black-king.svg';
import BlackPawn from './icons/black-pawn.svg';
import WhiteRook from './icons/white-rook.svg';
import WhiteKnight from './icons/white-knight.svg';
import WhiteBishop from './icons/white-bishop.svg';
import WhiteQueen from './icons/white-queen.svg';
import WhiteKing from './icons/white-king.svg';
import WhitePawn from './icons/white-pawn.svg';

type ChessBoardState = {
    board: Board
}

type PieceIconMap = {
    pieceCode: PieceCode,
    url: string
}

const PieceIconMaps: PieceIconMap[] = [
    { pieceCode: PieceCode.BlackRook, url: BlackRook },
    { pieceCode: PieceCode.BlackBishop, url: BlackBishop },
    { pieceCode: PieceCode.BlackKnight, url: BlackKnight },
    { pieceCode: PieceCode.BlackQueen, url: BlackQueen },
    { pieceCode: PieceCode.BlackKing, url: BlackKing },
    { pieceCode: PieceCode.BlackPawn, url: BlackPawn },
    { pieceCode: PieceCode.WhiteRook, url: WhiteRook },
    { pieceCode: PieceCode.WhiteBishop, url: WhiteBishop },
    { pieceCode: PieceCode.WhiteKnight, url: WhiteKnight },
    { pieceCode: PieceCode.WhiteQueen, url: WhiteQueen },
    { pieceCode: PieceCode.WhiteKing, url: WhiteKing },
    { pieceCode: PieceCode.WhitePawn, url: WhitePawn },
];

export default class ChessBoard extends React.Component<{}, ChessBoardState> {

    state: ChessBoardState = { board: [] };

    render() {
        const squares = this.state.board.map((pieceCode: PieceCode, i: number) => {
            const piece = PieceIconMaps.find(map => map.pieceCode === pieceCode);
            return (
                <button className="square" key={i}>
                    { piece && <img src={piece.url} /> }
                </button>
            );
        })

        return (<div className="board-wrapper"><div className="board">{ squares }</div></div>);
    }
    
    componentDidMount() {
        fetch(API_URL).then((res: Response) => res.json().then((data: Board) => {
            this.setState({
                board: data
            });
        }));
    }
}
