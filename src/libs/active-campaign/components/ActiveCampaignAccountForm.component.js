// @flow

import React from 'react';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

type Props = {
  open: boolean,
  t: TFunction,
  classes: Object,
  account: Account,
  updateAccount: (data: any) => void,
  onCancel: () => void,
};

export class ActiveCampaignAccountFormDialog extends React.Component<
  Props,
  State,
> {
  state = {
    token:
      this.props.account && this.props.account.token
        ? this.props.account.token
        : null,
    api_url:
      this.props.account && this.props.account.api_url
        ? this.props.account.api_url
        : null,
  };

  onCancel = () => {
    this.setState({
      token: null,
      api_url: null,
    });
    this.props.onCancel();
  };

  componentDidUpdate(prevProps) {
    if (this.props.open !== prevProps.open) {
      // eslint-disable-next-line
      this.setState({
        token:
          this.props.account && this.props.account.token
            ? this.props.account.token
            : null,
        api_url:
          this.props.account && this.props.account.api_url
            ? this.props.account.api_url
            : null,
      });
    }
  }

  render() {
    const { open, t, classes, updateAccount } = this.props;
    return (
      <Dialog open={open}>
        <DialogTitle id="dialog-title">
          {t('active_campaign.account.dialogTitle')}
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              updateAccount({
                api_url: this.state.api_url,
                token: this.state.token,
              });
              this.onCancel();
            }}
          >
            <div className={classes.container}>
              <TextField
                value={this.state.api_url}
                onChange={(ev) =>
                  this.setState({
                    api_url: ev.target.value,
                  })
                }
                helperText="API url"
                placeholder="https://bsport-example.api-us1.com"
              />
              <TextField
                value={this.state.token}
                onChange={(ev) =>
                  this.setState({
                    token: ev.target.value,
                  })
                }
                className={classes.textField}
                placeholder="7b5709a81f9b78089f3fc9e0ee189332"
                helperText={t('active_campaign.account.token')}
              />
            </div>
            <DialogActions>
              <Button color="secondary" onClick={this.onCancel}>
                {t('active_campaign.cancel')}
              </Button>
              <Button type="submit" color="primary">
                {t('active_campaign.submit')}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  textField: {
    marginTop: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['settings']),
)(ActiveCampaignAccountFormDialog);
