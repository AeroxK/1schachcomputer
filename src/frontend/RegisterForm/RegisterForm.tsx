import React from 'react';

import { registerApiUrl } from '../../shared/api/config';
import TextField from '@material-ui/core/TextField';
import Form from '../Form/Form';

interface RegisterFormProps {
    onLoggedIn: Function,
}

class RegisterForm extends React.Component<RegisterFormProps, {}> {
    handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        fetch(registerApiUrl, { method: "POST" })
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
                action={registerApiUrl}
                headline="Sign Up"
                method="POST"
                subheadline="Create a new account."
                onSubmit={this.handleSubmit}
                submitButtonLabel="Register"
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
                <TextField
                    required
                    id="repeat-password"
                    label="Repeat Password"
                    type="password"
                    variant="filled"
                    color="secondary"
                />
            </Form>
        );
    }
}

export default RegisterForm;
