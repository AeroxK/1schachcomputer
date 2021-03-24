import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
const LoginPage = lazy(() => import('../LoginPage/LoginPage'));
const LoggedInArea = lazy(() => import('../LoggedInArea/LoggedInArea'));

import { RoutePaths, StorageKeys } from '../shared/config';

interface ChessAppState {
    usertoken: string,
    username: string,
}

export default class ChessApp extends React.Component<{}, ChessAppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            usertoken: localStorage.getItem(StorageKeys.Usertoken) || '',
            username: localStorage.getItem(StorageKeys.Username) || '',
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogin(username:string, token: string) {
        localStorage.setItem(StorageKeys.Usertoken, token);
        localStorage.setItem(StorageKeys.Username, username);
        this.setState({
            usertoken: token,
            username: username
        });
    }

    handleLogout() {
        localStorage.removeItem(StorageKeys.Usertoken);
        localStorage.removeItem(StorageKeys.Username);
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
