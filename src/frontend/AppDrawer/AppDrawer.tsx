import React from 'react';
import { Link } from 'react-router-dom';

import { RouteDescriptor } from '../shared/types';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
});

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
                <List>
                    {
                        props.routes.map(route => (
                            <ListItem button key={route.path} component="a" href={route.path}>
                                <ListItemText primary={route.pageTitle} />
                            </ListItem>
                        ))
                    }
                </List>
            </div>
        </Drawer>
    );
}
