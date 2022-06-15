import React from 'react';
import { compose } from 'recompose';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import ButtonBase from '@material-ui/core/ButtonBase';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import AddPersonIcon from '@material-ui/icons/PersonAdd';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { OptionCallback } from '../../../state/types';
import { AdditionalGuest } from '../types';
import { Offer } from '../../offer/types';

type OwnProps = {
  offer: Offer | null;
  disabled: boolean;
  onAddAdditionalGuest: (
    guest: AdditionalGuest,
    options?: OptionCallback,
  ) => void;
  additionalGuestList: Array<AdditionalGuest>;
  fullScreen: boolean;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

type State = {
  dialogOpen: boolean;
  first_name: string;
  last_name: string;
  email: string;
};

export class AdditionalGuestForm extends React.Component<Props, State> {
  state: State = {
    dialogOpen: false,
    first_name: '',
    last_name: '',
    email: '',
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.dialogOpen && !prevState.dialogOpen) {
      this.setState({
        first_name: '',
        last_name: '',
        email: '',
      });
    }
  }

  onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    this.setState({ dialogOpen: false });
    this.props.onAddAdditionalGuest({
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
    });
  };

  render() {
    const { t, classes } = this.props;

    return (
      <>
        <Dialog fullScreen={this.props.fullScreen} open={this.state.dialogOpen}>
          <form onSubmit={this.onSubmit}>
            <DialogContent>
              <div className={classes.inner}>
                <AddPersonIcon className={classes.bigIcon} />

                <TextField
                  value={this.state.first_name || ''}
                  label={t('guest.form.firstname.label')}
                  required
                  shrink
                  autoFocus
                  onChange={(v) => {
                    this.setState({
                      first_name: v.target?.value || '',
                    });
                  }}
                />
                <TextField
                  value={this.state.last_name || ''}
                  label={t('guest.form.lastname.label')}
                  shrink
                  onChange={(v) => {
                    this.setState({
                      last_name: v.target?.value || '',
                    });
                  }}
                />
                <TextField
                  value={this.state.email || ''}
                  label={t('guest.form.email.label')}
                  shrink
                  type="email"
                  onChange={(v) => {
                    this.setState({
                      email: v.target?.value || '',
                    });
                  }}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({ dialogOpen: false })}>
                {t('guest.form.actions.close')}
              </Button>
              <Button type="submit" color="primary">
                {t('guest.form.actions.submit')}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <ButtonBase
          disabled={this.props.disabled}
          className={classes.bookButtonInner}
          onClick={() => this.setState({ dialogOpen: true })}
        >
          <AddIcon className={classes.leftIcon} />
          <Typography
            variant="body1"
            align="left"
            color={this.props.disabled ? 'textSecondary' : 'primary'}
          >
            {t('guest.form.actions.addGuest')}
          </Typography>
        </ButtonBase>
        {this.props.disabled && (
          <Typography
            variant="caption"
            align="left"
            color="textSecondary"
            className={classes.alert}
          >
            {t('guest.form.actions.limitGuest')}
          </Typography>
        )}
      </>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    inner: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      '&>*': {
        marginBottom: theme.spacing(2),
      },
    },
    bookButtonInner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: theme.spacing(1),
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    bigIcon: {
      height: 64,
      width: 64,
    },
    alert: {
      marginLeft: theme.spacing(2),
      alignSelf: 'flex-start',
    },
  });

export default compose(
  withTranslation(['booking']),
  withStyles(styles),
  withMobileDialog(),
)(AdditionalGuestForm);
