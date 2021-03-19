import React from 'react';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Form from '../Form/Form';
import { loginApiUrl } from '../../shared/api/config';

interface LoginFormProps {
    username: string,
    password: string,
    handleLogin: Function,
    handleInputChange: React.ChangeEventHandler<HTMLInputElement>
}

class LoginForm extends React.Component<LoginFormProps, {}> {
    handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        fetch(loginApiUrl, { method: "POST" })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed')
                }
                this.props.handleLogin();
            })
            .catch(err => {
                //TODO: Error Handling
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
