import React, { lazy, Suspense } from 'react';
import SocketIOClient from 'socket.io-client';

// Material UI
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import DeleteIcon from '@material-ui/icons/Delete';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
const Dialog = lazy(() => import('@material-ui/core/Dialog'));

// Shared
import { Board, Move, PieceCode, Promotion } from '../../shared/types';
import { decodePromotions, encodePromotions } from '../../shared/util';
import { WebsocketEventNames } from '../../shared/api/config';
import { WebsocketEventDataInterfaces } from '../../shared/api/types';
import { concatClasses } from '../shared/util';

// Assets
import './ChessBoard.scss';
import BlackRookIcon from './icons/black-rook.svg';
import BlackKnightIcon from './icons/black-knight.svg';
import BlackBishopIcon from './icons/black-bishop.svg';
import BlackQueenIcon from './icons/black-queen.svg';
import BlackKingIcon from './icons/black-king.svg';
import BlackPawnIcon from './icons/black-pawn.svg';
import WhiteRookIcon from './icons/white-rook.svg';
import WhiteKnightIcon from './icons/white-knight.svg';
import WhiteBishopIcon from './icons/white-bishop.svg';
import WhiteQueenIcon from './icons/white-queen.svg';
import WhiteKingIcon from './icons/white-king.svg';
import WhitePawnIcon from './icons/white-pawn.svg';
import MoveAudio from './sounds/move.webm';
import { StorageKeys } from '../shared/config';
const moveAudio = new Audio(MoveAudio);

type ChessBoardProps = {
    flipped?: boolean,
    handleLogout: () => void,
}

type ChessBoardState = {
    board: Board,
    dragSquare: number,
    flipped: boolean,
    highlightedSquares: number[],
    processingMove: boolean,
    promotions: Promotion[],
    selectedPromotionSquare: number,
    selectedSquare: number,
}

type PieceIconMap = {
    pieceCode: PieceCode,
    url: string
}

const PieceIconMaps: PieceIconMap[] = [
    { pieceCode: PieceCode.BlackRook, url: BlackRookIcon },
    { pieceCode: PieceCode.BlackKnight, url: BlackKnightIcon },
    { pieceCode: PieceCode.BlackBishop, url: BlackBishopIcon },
    { pieceCode: PieceCode.BlackQueen, url: BlackQueenIcon },
    { pieceCode: PieceCode.BlackKing, url: BlackKingIcon },
    { pieceCode: PieceCode.BlackPawn, url: BlackPawnIcon },
    { pieceCode: PieceCode.WhiteRook, url: WhiteRookIcon },
    { pieceCode: PieceCode.WhiteKnight, url: WhiteKnightIcon },
    { pieceCode: PieceCode.WhiteBishop, url: WhiteBishopIcon },
    { pieceCode: PieceCode.WhiteQueen, url: WhiteQueenIcon },
    { pieceCode: PieceCode.WhiteKing, url: WhiteKingIcon },
    { pieceCode: PieceCode.WhitePawn, url: WhitePawnIcon },
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
            processingMove: false,
            promotions: [],
            selectedSquare: -1,
            selectedPromotionSquare: -1,
        };

        this.COMPONENT_CSS_CLASS = 'm-chess-board';
        this.handleDiscardGameClick = this.handleDiscardGameClick.bind(this);
        this.handleFlipBoardClick = this.handleFlipBoardClick.bind(this);
        this.handlePromotionDialogClose = this.handlePromotionDialogClose.bind(this);

        this.socket = SocketIOClient.io({ auth: { token: localStorage.getItem(StorageKeys.Usertoken) || '' } });
        this.socket.on(WebsocketEventNames.AuthRejected, this.props.handleLogout);

        this.socket.on(WebsocketEventNames.UpdateMoves, (
            { origin_square, possible_squares }: WebsocketEventDataInterfaces[WebsocketEventNames.UpdateMoves]) =>
            {
                if (possible_squares.length && (possible_squares[0] > 63 || possible_squares[0] < 0)) {
                    const promotionMoves = possible_squares.map((to: number) => { return { from : origin_square, to }; });
                    const promotions = decodePromotions(promotionMoves, this.state.board[origin_square]> 0 ? 1 : -1);
                    this.setState({
                        highlightedSquares: promotions.map(promotion => promotion.to),
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
		        if(this.state.board.length > 0) { moveAudio.play(); }

                this.setState({
                    board,
                    highlightedSquares: [],
                    processingMove: false,
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
            if (this.state.promotions.map(promotion => promotion.to).includes(square)) {
                this.setState({ selectedPromotionSquare: square });
            } else {
                this.setState({ processingMove: true });
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
            move,
            usertoken: localStorage.getItem(StorageKeys.Usertoken) || '',
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
                    onDragEnd={() => { this.setState({ dragSquare: -1 }); }}
                    onDragEnter={(ev) => { ev.currentTarget.classList.add('dragover'); }}
                    onDragLeave={(ev) => { ev.currentTarget.classList.remove('dragover'); }}
                    onDragOver={
                        this.state.highlightedSquares.includes(i) ?
                            (ev) => { ev.dataTransfer.dropEffect = "move"; ev.preventDefault(); } : () => {}
                    }
                    onDragStart={() => {
                        this.setState({ dragSquare: i });
                        this.handleSquareClick(i);
                    }}

                    onDrop={this.handleSquareClick.bind(this, i)} 
                    className={concatClasses([
                        `${this.COMPONENT_CSS_CLASS}__square`,
                        this.state.highlightedSquares.includes(i) ? `${this.COMPONENT_CSS_CLASS}__square--highlighted` : ''
                    ])}
                    key={i}
                >
                    { piece && <img className={ this.state.dragSquare === i || (this.state.selectedSquare === i && this.state.processingMove) ? 'hidden' : '' } src={imageUrl} /> }
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
                <Suspense fallback={ <LoadingSpinner /> }>
                    <Dialog onClose={this.handlePromotionDialogClose} open={this.state.selectedPromotionSquare >= 0}>
                        <DialogTitle>Choose a Piece:</DialogTitle>
                        <div className={`${this.COMPONENT_CSS_CLASS}__promotion-button-wrapper`}>
                            {
                                this.state.promotions
                                    .filter(promotion => promotion.to === this.state.selectedPromotionSquare)
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
                </Suspense>
            </div>
        );
    }
}
