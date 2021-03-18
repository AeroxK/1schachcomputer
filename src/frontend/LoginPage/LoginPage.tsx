import React from 'react';

import { RoutePaths } from '../shared/config';

import { withStyles, WithStyles as WithStylesProps, StyleRules } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

interface LoginPageProps extends WithStylesProps<StyleRules> {}

interface LoginPageState {
    tabNumber: number;
}

class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
    constructor(props: LoginPageProps) {
        super(props);

        this.state = {
            tabNumber: 0
        }

        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
        this.setState({ tabNumber: newValue });
    }

    render () {
        return (
            <Box bgcolor="primary.main" color="primary.contrastText">
                <div className={this.props.classes.loginCardWrapper}>
                    <Container maxWidth="sm">
                        <Paper>
                            <Tabs className={this.props.classes.tabWrapper} centered value={this.state.tabNumber} onChange={this.handleTabChange}>
                                <Tab label="Sign In" />
                                <Tab label="Sign Up" />
                            </Tabs>
                            <div className={this.props.classes.tabContent}>

                                {
                                    this.state.tabNumber === 0 && (
                                        <form action="/login" method="POST" autoComplete="off">
                                            <Typography gutterBottom variant="h5" component="h1">
                                                Sign In
                                            </Typography>
                                            <Typography gutterBottom variant="subtitle2" component="p">
                                                Use an existing user account to log into the application.
                                            </Typography>
                                            <TextField required className={this.props.classes.textInput} id="username" label="Username" variant="filled" />
                                            <TextField required className={this.props.classes.textInput} id="password" label="Password" type="password" variant="filled" />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                            >
                                                Login
                                            </Button>
                                            <Button
                                                color="primary"
                                                href={ RoutePaths.ChessGamePage }
                                            >
                                                Forgot Password
                                            </Button>
                                        </form>
                                    )
                                }
                                {
                                    this.state.tabNumber === 1 && (
                                        <form action="/register" method="POST" autoComplete="off">
                                            <Typography gutterBottom variant="h5" component="h1">
                                                Sign Up
                                            </Typography>
                                            <Typography gutterBottom variant="subtitle2" component="p">
                                                Create a new account.
                                            </Typography>
                                            <TextField required className={this.props.classes.textInput} id="username" label="Username" variant="filled" />
                                            <TextField required className={this.props.classes.textInput} id="password" label="Password" type="password" variant="filled" />
                                            <TextField required className={this.props.classes.textInput} id="repeat-password" label="Repeat Password" type="password" variant="filled" />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                            >
                                                Register
                                            </Button>
                                        </form>
                                    )
                                }
                            </div>
                        </Paper>
                    </Container>
                </div>
            </Box>
        );
    };
}

const theme = createMuiTheme();

export default withStyles({
    loginCardWrapper: {
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: `20vh ${theme.spacing(2)}px 0`,
        width: '100vw',
        height: '100vh'
    },
    tabWrapper: {
        borderBottom: `1px solid ${theme.palette.divider}`
    },
    tabContent: {
        padding: theme.spacing(2),
    },
    textInput: {
        width: '100%',
        marginBottom: theme.spacing(2),
    }
})(LoginPage);
