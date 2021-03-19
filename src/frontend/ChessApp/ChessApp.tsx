import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
const LoginPage = lazy(() => import('../LoginPage/LoginPage'));
const LoggedInArea = lazy(() => import('../LoggedInArea/LoggedInArea'));

import { RoutePaths } from '../shared/config';

export default class ChessApp extends React.Component {

    handleLogin() {
        //TODO: Hande Login
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path={ RoutePaths.LoginPage }>
                        <Suspense fallback={ <LoadingSpinner /> }>
                            <LoginPage handleLogin={this.handleLogin} />
                        </Suspense>
                    </Route>
                    <Route path={ RoutePaths.LoggedInArea }>
                        <Suspense fallback={ <LoadingSpinner /> }>
                            <LoggedInArea />
                        </Suspense>
                    </Route>
                </Switch>
            </Router>
        );
    }
}
