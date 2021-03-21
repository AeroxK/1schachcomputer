import React from 'react';
import { Link } from 'react-router-dom';

import { RouteDescriptor } from '../shared/types';

import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme: Theme) => createStyles({
    list: {
        width: 250,
    },
    toolbar: theme.mixins.toolbar,
}));

interface AppDrawerProps {
    onClose: Function;
    open: boolean;
    routes: RouteDescriptor[];
}

export default function AppDrawer (props: AppDrawerProps) {
    const classes = useStyles();

    return (
        <Drawer onClose={() => props.onClose()} open={props.open}>
            <div className={classes.list} role="presentation">
                <div className={classes.toolbar} />
                <Divider />
                <List>
                    {
                        props.routes.map(route => (
                            <ListItem button key={route.path} component="a" href={route.path}>
                                <ListItemIcon>
                                    <route.icon />
                                </ListItemIcon>
                                <ListItemText primary={route.pageTitle} />
                            </ListItem>
                        ))
                    }
                </List>
            </div>
        </Drawer>
    );
}
