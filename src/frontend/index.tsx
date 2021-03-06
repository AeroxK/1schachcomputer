import React from 'react';
import ReactDOM from 'react-dom';
import '@fontsource/roboto';

import ChessApp from './ChessApp/ChessApp';

import './style.scss';

ReactDOM.render(<ChessApp />, document.getElementById('chess-gui'));
