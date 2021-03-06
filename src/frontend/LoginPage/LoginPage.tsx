import React from 'react';
import { Link } from 'react-router-dom';

import { RoutePaths } from '../shared/config';

export default class LoginPage extends React.Component {
    render() {
        return (
            <Link to={ RoutePaths.ChessGamePage }>Play!</Link>
        )
    }
}
