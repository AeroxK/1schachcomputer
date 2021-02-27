import React from 'react';
import Typography from '@material-ui/core/Typography';

import ChessBoard from '../ChessBoard/chess-board';

import './chess-gui.scss';

export default class ChessGui extends React.Component {
    render() {
        return (
            <div className="chess-gui">
                <div className="headline">
                    <Typography variant="h5" component="h1" gutterBottom>
                        1schachcomputer
                    </Typography>
                </div>
                <div className="container">
                    <ChessBoard />
                </div>
            </div>
        )
    }
}
