import React from 'react';
import io from 'socket.io-client';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import DeleteIcon from '@material-ui/icons/Delete';

import { Board, Move, PieceCode, Promotion } from '../../shared/types';
import { decodePromotions, encodePromotions } from '../../shared/util';
import { WebsocketEventNames } from '../../shared/api/config';
import { WebsocketEventDataInterfaces } from '../../shared/api/types';

import { concatClasses } from '../shared/util';

import './chess-board.scss';

type ChessBoardProps = {
    flipped?: boolean
}

type ChessBoardState = {
    board: Board,
    dragSquare: number,
    flipped: boolean,
    highlightedSquares: number[],
    promotions: Promotion[],
    selectedPromotionSquare: number,
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
    COMPONENT_CSS_CLASS: string;
    socket: SocketIOClient.Socket;
    
    constructor(props: ChessBoardProps) {
        super(props);

        this.state = {
            board: [],
            dragSquare: -1,
            flipped: this.props.flipped || false,
            highlightedSquares: [],
            promotions: [],
            selectedSquare: -1,
            selectedPromotionSquare: -1,
        };

        this.COMPONENT_CSS_CLASS = 'm-chess-board';
        this.handleDiscardGameClick = this.handleDiscardGameClick.bind(this);
        this.handleFlipBoardClick = this.handleFlipBoardClick.bind(this);
        this.handlePromotionDialogClose = this.handlePromotionDialogClose.bind(this);

        this.socket = io();

        this.socket.on(WebsocketEventNames.UpdateMoves, (
            { origin_square, possible_squares }: WebsocketEventDataInterfaces[WebsocketEventNames.UpdateMoves]) =>
            {
                if (possible_squares.length && (possible_squares[0] > 63 || possible_squares[0] < 0)) {
                    const promotionMoves = possible_squares.map((to: number) => { return { from : origin_square, to }; });
                    const promotions = decodePromotions(promotionMoves, this.state.board[origin_square]> 0 ? 1 : -1);
                    this.setState({
                        highlightedSquares: promotions.map(promotion => promotion.move.to),
                        promotions
                    });
                } else {
                    this.setState({
                        highlightedSquares: possible_squares
                    });
                }
            }
        );

        this.socket.on(WebsocketEventNames.UpdateBoard, (
            { board }: WebsocketEventDataInterfaces[WebsocketEventNames.UpdateBoard]) =>
            {
                this.setState({
                    board,
                    dragSquare: -1,
                    highlightedSquares: [],
                    promotions: [],
                    selectedSquare: -1
                });
            }
        );
    }

    getMoves(square: number) {
        const eventData: WebsocketEventDataInterfaces[WebsocketEventNames.GetMoves] = {
            piece_square: square,
            request_issuer: this.socket.id
        };
        this.socket.emit(WebsocketEventNames.GetMoves, eventData);
    }

    handleChoosePromotionPiece(promotion: Promotion) {
        const square = this.state.selectedSquare;
        this.makeMove({
            from: square,
            to: encodePromotions([promotion], this.state.board[square]> 0 ? 1 : -1)[0]
        });
        this.setState({ selectedPromotionSquare: -1 });
    }

    handleDiscardGameClick() {
        this.socket.emit(WebsocketEventNames.DiscardGame);
    }

    handleFlipBoardClick() {
        this.setState({ flipped: !this.state.flipped });
    }

    handlePromotionDialogClose() {
        this.setState({ selectedPromotionSquare: -1 });
    }

    handleSquareClick(square: number) {
        if (this.state.highlightedSquares.includes(square)) {
            if (this.state.promotions.map(promotion => promotion.move.to).includes(square)) {
                this.setState({ selectedPromotionSquare: square });
            } else {
                this.makeMove({
                    from: this.state.selectedSquare,
                    to: square
                });
            }
        } else if (this.state.board[square] !== 0) {
            this.getMoves(square);
            this.setState({
                selectedSquare: square
            });
        } else {
            this.setState({
                highlightedSquares: [],
                promotions: [],
            });
        }
    }

    makeMove(move: Move) {
        const eventData: WebsocketEventDataInterfaces[WebsocketEventNames.MakeMove] = {
            move
        };
        this.socket.emit(WebsocketEventNames.MakeMove, eventData);
    }

    render() {
        const squares = this.state.board.map((pieceCode: PieceCode, i: number) => {
            const piece = PieceIconMaps.find(map => map.pieceCode === pieceCode);
            const imageUrl = piece ? piece.url : '';
            return (
                <button
                    draggable={ Boolean(piece) } 
                    onClick={this.handleSquareClick.bind(this, i)}
                    onDragStart={() => {
                        this.setState({ dragSquare: i });
                        this.handleSquareClick(i);
                    }}
                    onDragOver={(ev) => { ev.dataTransfer.dropEffect = "move"; ev.preventDefault(); }}
                    onDrop={this.handleSquareClick.bind(this, i)} 
                    className={concatClasses([
                        `${this.COMPONENT_CSS_CLASS}__square`,
                        this.state.highlightedSquares.includes(i) ? `${this.COMPONENT_CSS_CLASS}__square--highlighted` : ''
                    ])}
                    key={i}
                >
                    { piece && <img className={ this.state.dragSquare === i ? 'hidden' : '' } src={imageUrl} /> }
                </button>
            );
        })

        return (
            <div className={concatClasses([
                `${this.COMPONENT_CSS_CLASS}`,
                this.state.flipped ? ` ${this.COMPONENT_CSS_CLASS}--flipped` : ''
            ])}>
                <div className={`${this.COMPONENT_CSS_CLASS}__board-wrapper`}>
                    <div className={`${this.COMPONENT_CSS_CLASS}__board`}>{ squares }</div>
                </div>
                <div className={`${this.COMPONENT_CSS_CLASS}__toolbar`}>
                    <Tooltip title="Flip board">
                        <IconButton aria-label="Flip board" color="primary" onClick={this.handleFlipBoardClick}>
                            <ImportExportIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Discard game">
                        <IconButton aria-label="Discard game" color="primary" onClick={this.handleDiscardGameClick}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <Dialog onClose={this.handlePromotionDialogClose} open={this.state.selectedPromotionSquare >= 0}>
                    <DialogTitle>Choose a Piece:</DialogTitle>
                    <div className={`${this.COMPONENT_CSS_CLASS}__promotion-button-wrapper`}>
                        {
                            this.state.promotions
                                .filter(promotion => promotion.move.to === this.state.selectedPromotionSquare)
                                .map(promotion => (
                                    <button
                                        onClick={this.handleChoosePromotionPiece.bind(this, promotion)}
                                        className={`${this.COMPONENT_CSS_CLASS}__promotion-button`}
                                    >
                                        <img src={
                                            PieceIconMaps.find(map => map.pieceCode === promotion.promote_to)?.url || ''
                                        } />
                                    </button>
                            ))
                        }
                    </div>
                </Dialog>
            </div>
        );
    }
}
