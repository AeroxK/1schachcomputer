import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { LoginResponse } from '../../shared/api/types';

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
const LoginPage = lazy(() => import('../LoginPage/LoginPage'));
const LoggedInArea = lazy(() => import('../LoggedInArea/LoggedInArea'));

import { RoutePaths } from '../shared/config';

interface ChessAppState {
    usertoken: string,
    username: string,
}

export default class ChessApp extends React.Component<{}, ChessAppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            usertoken: localStorage.getItem('usertoken') || '',
            username: localStorage.getItem('username') || '',
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogin(data:LoginResponse) {
        localStorage.setItem('usertoken', data._id);
        localStorage.setItem('username', data.username);
        this.setState({
            usertoken: data._id,
            username: data.username
        });
    }

    handleLogout() {
        localStorage.removeItem('usertoken');
        localStorage.removeItem('username');
        this.setState({
            usertoken: '',
            username: ''
        });
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path={ RoutePaths.LoginPage }>
                        {
                            this.state.usertoken ?
                            <Redirect to="/play" /> :
                            (
                                <Suspense fallback={ <LoadingSpinner /> }>
                                    <LoginPage handleLogin={this.handleLogin} />
                                </Suspense>
                            )
                        }
                    </Route>
                    <Route path={ RoutePaths.LoggedInArea }>
                        {
                            !this.state.usertoken ?
                            <Redirect to="/" /> :
                            (
                                <Suspense fallback={ <LoadingSpinner /> }>
                                    <LoggedInArea username={this.state.username} handleLogout={this.handleLogout} />
                                </Suspense>
                            )
                        }
                    </Route>
                </Switch>
            </Router>
        );
    }
}
