import React from 'react';

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
                <div className={`${this.COMPONENT_CSS_CLASS}__board`}>
                    <ChessBoard />
                </div>
            </div>
        )
    }
}
