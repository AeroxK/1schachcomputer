import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import AppBar from '../AppBar/AppBar';
import LoadingSpinner from '../LoadingSpinner/loading-spinner';
const ChessGui = lazy(() => import('../ChessGui/ChessGui'));

import { RouteDescriptor } from '../shared/types';

export default class ChessApp extends React.Component {
    routes: RouteDescriptor[];

    constructor(props: {}) {
        super(props);

        this.routes = [
            {
                path: '/',
                exact: true,
                pageTitle: 'Home',
                render: () => (<div>Login<Link to="/play">Play!</Link></div>)
            },
            {
                path: '/play',
                pageTitle: 'PlayZone',
                render: () => (
                    <Suspense fallback={ <LoadingSpinner /> }>
                        <ChessGui />
                    </Suspense>
                )
            }
        ]
    }

    render() {
        return (
            <Router>
                <AppBar routes={ this.routes } />
                <Switch>
                    {
                        this.routes.map((route, i) => (
                            <Route
                                key={i}
                                path={route.path}
                                exact={route.exact || false}
                                children={<route.render />}
                            />
                        ))
                    }
                </Switch>
            </Router>
        );
    }
}
