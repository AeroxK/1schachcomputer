import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import AppBar from '../AppBar/AppBar';
import AppDrawer from '../AppDrawer/AppDrawer';
const ChessGui = lazy(() => import('../ChessGui/ChessGui'));
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

import { RoutePaths } from '../shared/config';
import { RouteDescriptor } from '../shared/types';

interface LoggedInAreaState {
    appDrawerOpen: boolean;
}

export default class LoggedInArea extends React.Component<{}, LoggedInAreaState> {
    routes: RouteDescriptor[];

    constructor(props: {}) {
        super(props);

        this.state = {
            appDrawerOpen: false
        };

        this.routes = [
            {
                path: RoutePaths.ChessGamePage,
                pageTitle: 'PlayZone',
                render: () => <ChessGui />
            }
        ];

        this.closeDrawer = this.closeDrawer.bind(this);
        this.openDrawer = this.openDrawer.bind(this);
    }

    closeDrawer() {
        this.setState({ appDrawerOpen: false });
    }

    openDrawer() {
        this.setState({ appDrawerOpen: true });
    }

    render() {
        return (
            <div>
                <AppBar handleMenuClick={this.openDrawer} routes={this.routes} />
                <AppDrawer onClose={this.closeDrawer} open={this.state.appDrawerOpen} routes={this.routes} />
                <Switch>
                    {
                        this.routes.map((route, i) => (
                            <Route
                                key={i}
                                exact={route.exact || false}
                                path={route.path}
                            >
                                <Suspense fallback={<LoadingSpinner />}>
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