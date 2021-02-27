import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FlipCameraAndroidIcon from '@material-ui/icons/FlipCameraAndroid';

import { GAME_API_URL, MOVE_API_URL } from '../../shared/config';
import { Board, Move, PieceCode } from '../../shared/types';

import './chess-board.css';

type ChessBoardProps = {
    flipped?: boolean
}

type ChessBoardState = {
    board: Board,
    flipped: boolean,
    highlightedSquares: number[],
    selectedSquare: number,
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

export default class ChessBoard extends React.Component<ChessBoardProps, ChessBoardState> {
    constructor(props: ChessBoardProps) {
        super(props);

        this.state = {
            board: [],
            flipped: this.props.flipped || false,
            highlightedSquares: [],
            selectedSquare: -1
        };

        this.handleFlipBoardClick = this.handleFlipBoardClick.bind(this);
    }

    getMoves(square: number) {
        fetch(`${MOVE_API_URL}?square=${square}`).then((res: Response) => res.json().then((data: number[]) => {
            if (data.length && (data[0] > 63 || data[0] < 0)) {
              alert('Promotion!');
            } else {
              this.setState({
                  highlightedSquares: data
              });
            }
        }));
    }

    handleFlipBoardClick() {
        this.setState({ flipped: !this.state.flipped });
    }

    handleSquareClick(square: number) {
        if (this.state.highlightedSquares.includes(square)) {
            const move: Move = { from: this.state.selectedSquare, to: square }
            fetch(MOVE_API_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(move)
            }).then((res: Response) => res.json().then(data => {
                this.setState({
                    board: data,
                    highlightedSquares: [],
                    selectedSquare: -1
                });
            }));
        } else if (this.state.board[square] !== 0) {
            this.getMoves(square);
            this.setState({
                selectedSquare: square
            });
        } else {
            this.setState({
                highlightedSquares: []
            });
        }
    }

    render() {
        const squares = this.state.board.map((pieceCode: PieceCode, i: number) => {
            const piece = PieceIconMaps.find(map => map.pieceCode === pieceCode);
            return (
                <button onClick={this.handleSquareClick.bind(this, i)} className={`square${this.state.highlightedSquares.includes(i) ? ' square--highlighted' : ''}`} key={i}>
                    { piece && <img src={piece.url} /> }
                </button>
            );
        })

        return (
            <div>
                <div className={`board-wrapper${this.state.flipped ? ' state-flipped' : ''}`}>
                    <div className="board">{ squares }</div>
                </div>
                <div className="toolbar">
                    <IconButton aria-label="Flip board" onClick={this.handleFlipBoardClick}>
                        <FlipCameraAndroidIcon />
                    </IconButton>
                </div>
            </div>
        );
    }
    
    componentDidMount() {
        fetch(GAME_API_URL).then((res: Response) => res.json().then((data: Board) => {
            this.setState({
                board: data
            });
        }));
    }
}
