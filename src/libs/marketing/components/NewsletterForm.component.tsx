import React, { FormEvent } from 'react';
import {
  Button,
  Paper,
  TextField,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { compose } from 'recompose';
import classNames from 'classnames';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import { MaterialStyleType } from '../../../utils/types';

interface OwnProps {
  onSubmit: (email: string, firstName: string, lastName: string) => void;
}

type Props = OwnProps & {
  t: TFunction;
} & MaterialStyleType<ReturnType<typeof styles>>;

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
          className={classNames([classes.marginTop, classes.fullWidth])}
          onSubmit={this.onSubmit}
        >
          <TextField
            className={classes.fullWidth}
            variant="outlined"
            placeholder={t('')}
            label={t('newsletter.form.email')}
            value={this.state.email}
            required
            onChange={(ev) => this.setState({ email: ev.target.value })}
            type="email"
          />

          <TextField
            className={classNames([classes.marginTop, classes.fullWidth])}
            variant="outlined"
            placeholder={t('')}
            label={t('newsletter.form.firstName')}
            value={this.state.firstName}
            required
            onChange={(ev) => this.setState({ firstName: ev.target.value })}
            type="text"
          />

          <TextField
            className={classNames([classes.marginTop, classes.fullWidth])}
            variant="outlined"
            placeholder={t('')}
            label={t('newsletter.form.lastName')}
            value={this.state.lastName}
            onChange={(ev) => this.setState({ lastName: ev.target.value })}
            type="text"
          />

          <Button
            className={classNames([
              classes.marginTop,
              classes.fullWidth,
              classes.btnHeight,
            ])}
            variant="contained"
            type="submit"
            color="primary"
          >
            {t('newsletter.form.validate')}
          </Button>
        </form>
      </Paper>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    maxWidth: 450,
    minWidth: 450,
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

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation('marketing'),
)(NewsletterFormComponent);
