import React from 'react';

import TextField from '@material-ui/core/TextField';
import Form from '../Form/Form';
import { loginApiUrl } from '../../shared/api/config';

interface LoginFormProps {
    onLoggedIn: Function
}

class LoginForm extends React.Component<LoginFormProps, {}> {
    handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        fetch(loginApiUrl, { method: "POST" })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed')
                }
                this.props.onLoggedIn();
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
                <TextField
                    required
                    id="username"
                    label="Username"
                    variant="filled"
                    color="secondary"
                />
                <TextField
                    required
                    id="password"
                    label="Password"
                    type="password"
                    variant="filled"
                    color="secondary"
                />
            </Form>
        );
    }
}

export default LoginForm;
