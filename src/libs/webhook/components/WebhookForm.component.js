// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';

import { compose } from 'recompose';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

type Props = {
  t: TFunction,
  webhook: Webhook,
  onCancel: () => void,
  classes: Object,
  open: boolean,
  updateWebhook: (data: any) => void,
  eventList: Array<string>,
};

const NO_EVENT = -1;

export class WebhookFormDialog extends Component<Props, state> {
  state = {
    url: '',
    event_type: NO_EVENT,
  };

  componentDidMount() {
    if (this.props.webhook) {
      this.setState({
        event_type: this.props.webhook.event_type,
        url: this.props.webhook.url,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.webhook !== prevProps.webhook) {
      if (this.props.webhook) {
        this.setState({
          url: this.props.webhook.url,
          event_type: this.props.webhook.event_type,
        });
      } else {
        this.setState({
          url: '',
          event_type: NO_EVENT,
        });
      }
    }
  }

  onCancel = () => {
    this.setState({
      url: '',
      event_type: NO_EVENT,
    });
    this.props.onCancel();
  };

  render() {
    const { t, open, classes } = this.props;
    return (
      <Dialog fullScreen={false} open={open}>
        <DialogTitle id="dialog-title">{t('webhook.createTitle')}</DialogTitle>
        <DialogContent>
          <div>
            <form
              onSubmit={(ev) => {
                ev.preventDefault();
                this.props.updateWebhook(
                  {
                    url: this.state.url,
                    event_type: this.state.event_type,
                  },
                  {
                    onSuccess: this.onCancel,
                  },
                );
              }}
            >
              <div className={classes.formControl}>
                <FormControl className={classes.formControl}>
                  <Select
                    className={classes.input}
                    required
                    value={this.state.event_type}
                    onChange={(ev) =>
                      this.setState({ event_type: ev.target.value })
                    }
                  >
                    <MenuItem value={NO_EVENT} disabled>
                      {this.props.t('webhook.selectEvent')}
                    </MenuItem>
                    {this.props.eventList.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <TextField
                value={this.state.url}
                fullWidth
                className={this.props.classes.textField}
                variant="outlined"
                label={t('url')}
                onChange={(ev) => this.setState({ url: ev.target.value })}
                helperText={this.props.t('webhook.urlHelper')}
                placeholder={this.props.t('webhook.urlPlaceHolder')}
              />
              <DialogActions>
                <Button color="secondary" onClick={this.onCancel}>
                  {t('webhook.cancel')}
                </Button>
                <Button
                  disabled={
                    this.state.event_type === NO_EVENT || !this.state.url
                  }
                  type="submit"
                  color="primary"
                >
                  {t('webhook.submit')}
                </Button>
              </DialogActions>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  textField: {
    marginTop: theme.spacing(2),
  },
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  memberField: {
    display: 'flex',
    marginTop: theme.spacing(2),
  },
  member: {
    color: 'red',
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['settings']),
)(WebhookFormDialog);
