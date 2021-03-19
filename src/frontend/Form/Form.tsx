import React, { FormEventHandler, ReactElement, ReactNode } from 'react';

import { withStyles, WithStyles as WithStylesProps, StyleRules } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

interface FormProps extends WithStylesProps<StyleRules> {
    action: string,
    children: ReactElement<typeof Grid>[],
    headline: string,
    method: "POST" | "GET",
    onSubmit: FormEventHandler<HTMLFormElement>,
    submitButtonLabel: string,
    subheadline: string,
}

class Form extends React.Component<FormProps, {}> {
    render() {
        return (
            <form onSubmit={this.props.onSubmit} action={this.props.action} method={this.props.method} autoComplete="off">
                <div className={this.props.classes.headlineWrapper}>
                    <Typography gutterBottom variant="h5" component="h1">
                        {this.props.headline}
                    </Typography>
                    <Typography gutterBottom variant="subtitle2" component="p">
                        {this.props.subheadline}
                    </Typography>
                </div>
                <Grid className={this.props.classes.gridRoot} container spacing={2}>{this.props.children}</Grid>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        {this.props.submitButtonLabel}
                    </Button>
                </div>
            </form>
        );
    }
}

const theme = createMuiTheme();

export default withStyles({
    headlineWrapper: {
        marginBottom: theme.spacing(2),
    },
    gridRoot: {
        marginBottom: theme.spacing(2),
    }
})(Form);
