import React from 'react';

import { registerApiUrl } from '../../shared/api/config';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Form from '../Form/Form';
import { LoginRequest, LoginResponse } from '../../shared/api/types';

interface RegisterFormProps {
    username: string,
    password: string,
    repeatedPassword: string,
    handleLogin: (data:LoginResponse) => void,
    handleLoginFailed: (reason:string) => void,
    handleInputChange: React.ChangeEventHandler<HTMLInputElement>
}

class RegisterForm extends React.Component<RegisterFormProps, {}> {
    constructor(props: RegisterFormProps) {
        super(props);

        this.state = {
            username: '',
            password: '',
            repeatedPassword: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        const data:LoginRequest = {
            username: this.props.username,
            password: this.props.password,
        }

        fetch(registerApiUrl, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                switch (response.status) {
                    case 409:
                        throw new Error('Username has already been claimed')
                }
            }
            response.json().then((json: LoginResponse) => this.props.handleLogin(json));
        })
        .catch((err:Error) => {
            this.props.handleLoginFailed(err.message);
        });
    }

    render() {
        return (
            <Form
                action={registerApiUrl}
                headline="Sign Up"
                method="POST"
                subheadline="Create a new account."
                onSubmit={this.handleSubmit}
                submitButtonLabel="Register"
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
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        id="repeat-password"
                        name="repeatedPassword"
                        label="Repeat Password"
                        type="password"
                        variant="filled"
                        color="secondary"
                        value={this.props.repeatedPassword}
                        inputProps={{ pattern: this.props.password }}
                        onChange={this.props.handleInputChange}
                    />
                </Grid>
            </Form>
        );
    }
}

export default RegisterForm;
