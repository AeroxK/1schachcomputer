import React from 'react';
import Typography from '@material-ui/core/Typography';

import ChessBoard from '../ChessBoard/ChessBoard';

import './ChessGui.scss';

type ChessGuiProps = {};

export default class ChessGui extends React.Component<ChessGuiProps, {}> {
    COMPONENT_CSS_CLASS: string;

    constructor(props: ChessGuiProps) {
        super(props);

        this.COMPONENT_CSS_CLASS = 'o-chess-gui';
    }

    render() {
        return (
            <div className={`${this.COMPONENT_CSS_CLASS}`}>
                <div className={`${this.COMPONENT_CSS_CLASS}__headline`}>
                    <Typography variant="h5" component="h1" gutterBottom>
                        1schachcomputer
                    </Typography>
                </div>
                <div className={`${this.COMPONENT_CSS_CLASS}__board`}>
                    <ChessBoard />
                </div>
            </div>
        )
    }
}
