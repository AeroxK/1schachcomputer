import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemicon from '@material-ui/core/ListItemIcon';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { RouteDescriptor } from '../shared/types';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);

interface AppBarProps {
    handleMenuClick: Function;
    handleLogout: Function;
    routes: RouteDescriptor[];
    username: string;
}

export default function ChessAppBar(props: AppBarProps) {
    const [userMenuAnchor, setUserMenuAnchor] = React.useState<HTMLElement | null>(null);
    const classes = useStyles();

    const handleAvatarClick = (ev: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchor(ev.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchor(null);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton onClick={() => props.handleMenuClick()} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        <Switch>
                            {
                                props.routes.map((route, i) => (
                                    <Route
                                        key={i}
                                        path={route.path}
                                        exact={route.exact || false}
                                        children={route.pageTitle}
                                    />
                                ))
                            }
                        </Switch>
                    </Typography>
                    <IconButton
                        aria-controls="logout-menu"
                        aria-haspopup="true"
                        onClick={handleAvatarClick}
                    >
                        <Avatar>
                            {props.username.charAt(0)}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={userMenuAnchor}
                        open={Boolean(userMenuAnchor)}
                        onClose={handleUserMenuClose}
                    >
                        <MenuItem disabled>
                            <Typography variant="body1" component="p" >Signed in as {props.username}</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => props.handleLogout()}>
                            <ListItemicon>
                                <ExitToAppIcon />
                            </ListItemicon>
                            <Typography variant="body1" component="span">Logout</Typography>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </div>
    );
}
