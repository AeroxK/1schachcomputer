import React from 'react';

import { RoutePaths } from '../shared/config';

import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    buttonWrapper: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh'
    },
});

export default function LoginPage() {
    const classes = useStyles();
    return (
        <Box bgcolor="primary.main" color="primary.contrastText">
            <div className={classes.buttonWrapper}>
                <Typography gutterBottom variant="h5" component="h1">
                    1schachcomputer
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    href={ RoutePaths.ChessGamePage }
                >
                    Login
                </Button>
            </div>
        </Box>
    );
}
