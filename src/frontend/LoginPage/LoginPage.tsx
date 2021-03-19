import React from 'react';

import { withStyles, WithStyles as WithStylesProps, StyleRules } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';

interface LoginPageProps extends WithStylesProps<StyleRules> {
    handleLogin: Function
}

interface LoginPageState {
    tabNumber: number;
    inputs: {
        [name: string]: string
    }
}

class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
    constructor(props: LoginPageProps) {
        super(props);

        this.state = {
            tabNumber: 0,
            inputs: {
                username: '',
                password: '',
                repeatedPassword: '',
            }
        }

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
        this.setState({ tabNumber: newValue });
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            inputs: Object.assign(this.state.inputs, { [name]: value })
        });
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
                                        <LoginForm
                                            username={this.state.inputs.username}
                                            password={this.state.inputs.password}
                                            handleLogin={this.props.handleLogin}
                                            handleInputChange={this.handleInputChange}
                                        />
                                    )
                                }
                                {
                                    this.state.tabNumber === 1 && (
                                        <RegisterForm
                                            username={this.state.inputs.username}
                                            password={this.state.inputs.password}
                                            repeatedPassword={this.state.inputs.repeatedPassword}
                                            handleLogin={this.props.handleLogin}
                                            handleInputChange={this.handleInputChange}
                                        />
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
        padding: '20vh 0',
        width: '100vw',
        minHeight: '100vh'
    },
    tabWrapper: {
        borderBottom: `1px solid ${theme.palette.divider}`
    },
    tabContent: {
        padding: `${theme.spacing(4)}px ${theme.spacing(2)}px ${theme.spacing(2)}px`,
    },
})(LoginPage);
