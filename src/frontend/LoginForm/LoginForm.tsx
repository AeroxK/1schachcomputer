import React from 'react';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Form from '../Form/Form';
import { loginApiUrl } from '../../shared/api/config';
import { LoginRequest, LoginResponse } from '../../shared/api/types';

interface LoginFormProps {
    username: string,
    password: string,
    handleLogin: (data:LoginResponse) => void,
    handleLoginFailed: (reason:string) => void,
    handleInputChange: React.ChangeEventHandler<HTMLInputElement>
}

interface LoginFormState {
    error: string
}

class LoginForm extends React.Component<LoginFormProps, {}> {
    constructor(props: LoginFormProps) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        const data:LoginRequest = {
            username: this.props.username,
            password: this.props.password
        };

        fetch(loginApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) {
                switch (response.status) {
                    case 404:
                        throw new Error('Username and/or password incorrect');
                }
            }
            response.json().then((json: LoginResponse) => this.props.handleLogin(json));
        })
        .catch((err: Error) => {
            this.props.handleLoginFailed(err.message);
        });
    }

    render() {
        return (
            <Form
                action={loginApiUrl}
                headline="Sign In"
                method="POST"
                subheadline="Use an existing user account to log into the application."
                onSubmit={this.handleSubmit}
                submitButtonLabel="Login"
            >
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        id="username"
                        name="username"
                        label="Username"
                        variant="filled"
                        color="secondary"
                        value={this.props.username}
                        onChange={this.props.handleInputChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        variant="filled"
                        color="secondary"
                        value={this.props.password}
                        onChange={this.props.handleInputChange}
                    />
                </Grid>
            </Form>
        );
    }
}

export default LoginForm;
