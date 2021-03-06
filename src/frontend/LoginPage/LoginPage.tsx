import React from 'react';
import { Link } from 'react-router-dom';

import { Routes } from '../shared/config';

export default class LoginPage extends React.Component {
    render() {
        return (
            <Link to={ Routes.ChessGamePage }>Play!</Link>
        )
    }
}
