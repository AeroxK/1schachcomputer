import React from 'react';
import ReactDOM from 'react-dom';
import '@fontsource/roboto';

import ChessGui from './ChessGui/chess-gui';

import './style.scss';

ReactDOM.render(<ChessGui />, document.getElementById('chess-gui'));
