import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import AppBar from '../AppBar/AppBar';
import AppDrawer from '../AppDrawer/AppDrawer';
const ChessGui = lazy(() => import('../ChessGui/ChessGui'));
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';

import { RoutePaths } from '../shared/config';
import { RouteDescriptor } from '../shared/types';

interface LoggedInAreaState {
    appDrawerOpen: boolean;
    showSnackbar: boolean;
}

interface LoggedInAreaProps {
    username: string,
    handleLogout: () => void
}

export default class LoggedInArea extends React.Component<LoggedInAreaProps, LoggedInAreaState> {
    routes: RouteDescriptor[];

    constructor(props: LoggedInAreaProps) {
        super(props);

        this.state = {
            appDrawerOpen: false,
            showSnackbar: false,
        };

        this.routes = [
            {
                path: RoutePaths.ChessGamePage,
                pageTitle: 'PlayZone',
                icon: SportsEsportsIcon,
                render: () => <ChessGui handleLogout={this.props.handleLogout} />
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

    componentDidMount() {
        this.setState({ showSnackbar: true });
    }

    render() {
        return (
            <div>
                <AppBar
                    username={this.props.username}
                    handleMenuClick={this.openDrawer}
                    handleLogout={this.props.handleLogout}
                    routes={this.routes}
                />
                <AppDrawer onClose={this.closeDrawer} open={this.state.appDrawerOpen} routes={this.routes} />
                <main>
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
                </main>
                <Snackbar
                    open={this.state.showSnackbar}
                    autoHideDuration={2000}
                    onClose={() => this.setState({showSnackbar: false})}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        severity="success"
                        onClose={() => this.setState({showSnackbar: false})}
                    >
                        Logged in as {this.props.username}
                    </MuiAlert>
                </Snackbar>
            </div>
        );
    }
}
