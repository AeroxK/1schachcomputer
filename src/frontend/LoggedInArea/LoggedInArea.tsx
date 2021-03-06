import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import AppBar from '../AppBar/AppBar';
const ChessGui = lazy(() => import('../ChessGui/ChessGui'));
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

import { RoutePaths } from '../shared/config';
import { RouteDescriptor } from '../shared/types';

export default class LoggedInArea extends React.Component {
    routes: RouteDescriptor[];

    constructor(props: {}) {
        super(props);

        this.routes = [
            {
                path: RoutePaths.ChessGamePage,
                pageTitle: 'PlayZone',
                render: () => <ChessGui />
            }
        ];
    }

    render() {
        return (
            <div>
                <AppBar routes={ this.routes } />
                <Switch>
                    {
                        this.routes.map((route, i) => (
                            <Route
                                key={i}
                                exact={route.exact || false}
                                path={route.path}
                            >
                                <Suspense fallback={LoadingSpinner}>
                                    <route.render />
                                </Suspense>
                            </Route>
                        ))
                    }
                </Switch>
            </div>
        );
    }
}
