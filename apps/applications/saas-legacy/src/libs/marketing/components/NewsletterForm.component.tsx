import React, { FormEvent } from 'react';
import {
  Button,
  Paper,
  TextField,
  Typography,
  withStyles,
  createStyles,
  type Theme,
  type WithStyles,
} from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { compose } from 'recompose';
import clsx from 'clsx';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

type OwnProps = {
  onSubmit: (email: string, firstName: string, lastName: string) => void;
};

type Props = OwnProps & {
  t: TFunction;
} & WithStyles<typeof styles>;

interface State {
  email: string;
  firstName: string;
  lastName: string;
}

class NewsletterFormComponent extends React.PureComponent<Props, State> {
  state = {
    email: '',
    firstName: '',
    lastName: '',
  };

  onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, firstName, lastName } = this.state;
    this.props.onSubmit(email, firstName, lastName);
  };

  render() {
    const { classes } = this.props;
    const { t } = this.props;

    return (
      <Paper className={classes.container}>
        <MailOutlineIcon fontSize="large" />
        <Typography className={classes.marginTop} variant="h5">
          {t('newsletter.form.title')}
        </Typography>

        <form
          className={clsx([classes.marginTop, classes.fullWidth])}
          onSubmit={this.onSubmit}
        >
          <TextField
            required
            className={classes.fullWidth}
            label={t('newsletter.form.email')}
            onChange={(ev) => this.setState({ email: ev.target.value })}
            placeholder={t('')}
            type="email"
            value={this.state.email}
            variant="outlined"
          />

          <TextField
            required
            className={clsx([classes.marginTop, classes.fullWidth])}
            label={t('newsletter.form.firstName')}
            onChange={(ev) => this.setState({ firstName: ev.target.value })}
            placeholder={t('')}
            type="text"
            value={this.state.firstName}
            variant="outlined"
          />

          <TextField
            className={clsx([classes.marginTop, classes.fullWidth])}
            label={t('newsletter.form.lastName')}
            onChange={(ev) => this.setState({ lastName: ev.target.value })}
            placeholder={t('')}
            type="text"
            value={this.state.lastName}
            variant="outlined"
          />

          <Button
            className={clsx([
              classes.marginTop,
              classes.fullWidth,
              classes.btnHeight,
            ])}
            color="primary"
            type="submit"
            variant="contained"
          >
            {t('newsletter.form.validate')}
          </Button>
        </form>
      </Paper>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      maxWidth: 450,
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    marginTop: {
      marginTop: theme.spacing(2),
    },
    fullWidth: {
      width: '100%',
    },
    btnHeight: {
      height: 48,
    },
  });

export default compose<Props, OwnProps>(
  withStyles(styles),
  withTranslation('marketing'),
)(NewsletterFormComponent);
