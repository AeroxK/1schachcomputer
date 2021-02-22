import React from 'react';

import { API_URL } from '../../shared/config';
import { Board, PieceCode } from '../../shared/types';

import './chess-board.css';

type ChessBoardState = {
    board: Board
}

type PieceIconMap = {
    pieceCode: PieceCode,
    url: string
}

const PieceIconMaps: PieceIconMap[] = [
    { pieceCode: PieceCode.BlackRook, url: require('./icons/black-rook.svg') },
    { pieceCode: PieceCode.BlackBishop, url: require('./icons/black-bishop.svg') },
    { pieceCode: PieceCode.BlackKnight, url: require('./icons/black-knight.svg') },
    { pieceCode: PieceCode.BlackQueen, url: require('./icons/black-queen.svg') },
    { pieceCode: PieceCode.BlackKing, url: require('./icons/black-king.svg') },
    { pieceCode: PieceCode.BlackPawn, url: require('./icons/black-pawn.svg') },
    { pieceCode: PieceCode.WhiteRook, url: require('./icons/white-rook.svg') },
    { pieceCode: PieceCode.WhiteBishop, url: require('./icons/white-bishop.svg') },
    { pieceCode: PieceCode.WhiteKnight, url: require('./icons/white-knight.svg') },
    { pieceCode: PieceCode.WhiteQueen, url: require('./icons/white-queen.svg') },
    { pieceCode: PieceCode.WhiteKing, url: require('./icons/white-king.svg') },
    { pieceCode: PieceCode.WhitePawn, url: require('./icons/white-pawn.svg') },
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
