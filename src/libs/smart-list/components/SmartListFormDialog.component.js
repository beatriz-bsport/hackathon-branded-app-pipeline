// @flow

import React, { Component } from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';

import { compose } from 'recompose';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM } from '#components/analytics/segment';
import type { OptionCallback } from '../../../state/types';
import type { SmartList } from '../types';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

type Props = {
  t: TFunction,
  smartlist: SmartList,
  onCancel: () => void,
  updateSmartList: (
    params: { name: string, description: string },
    options: OptionCallback,
  ) => void,
  classes: Object,
  open: boolean,
};

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.SMARTLIST,
);
export class SmartListFormDialog extends Component<Props, state> {
  state = {
    name: '',
    description: '',
  };

  componentDidMount() {
    if (this.props.smartlist) {
      this.setState({
        name: this.props.smartlist.name,
        description: this.props.smartlist.description,
      });
    }
    // only track the event at
    // the creation of a new smart list
    if (this.props.open) trackFormAdd();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.smartlist !== prevProps.smartlist) {
      if (this.props.smartlist) {
        this.setState({
          name: this.props.smartlist.name,
          description: this.props.smartlist.description,
        });
      } else {
        this.setState({
          name: '',
          description: '',
        });
      }
    }
  }

  onCancel = () => {
    this.setState({
      name: '',
      description: '',
    });

    trackFormCancel(this.props.smartlist?.id);

    this.props.onCancel();
  };

  render() {
    const { t, open } = this.props;
    return (
      <Dialog fullScreen={false} open={open}>
        <DialogTitle id="dialog-title">
          {t('smart_list.createTitle')}
        </DialogTitle>
        <DialogContent>
          <div>
            <form
              onSubmit={(ev) => {
                ev.preventDefault();
                trackFormSubmitIntent(this.props.smartlist?.id);
                this.props.updateSmartList(
                  {
                    name: this.state.name,
                    description: this.state.description,
                  },
                  {
                    onSuccess: () => {
                      trackFormSuccess(this.props.smartlist?.id);
                    },
                  },
                );
                this.setState({ name: '', description: '' });
              }}
            >
              <TextField
                value={this.state.name}
                fullWidth
                label={t('smart_list.name')}
                onChange={(ev) => this.setState({ name: ev.target.value })}
                className={this.props.classes.textField}
              />
              <TextField
                value={this.state.description}
                multiline
                fullWidth
                rows={5}
                className={this.props.classes.textField}
                variant="outlined"
                label={t('smart_list.description.label')}
                onChange={(ev) =>
                  this.setState({ description: ev.target.value })
                }
              />
              <DialogActions>
                <Button color="secondary" onClick={this.onCancel}>
                  {t('smart_list.cancel')}
                </Button>
                <Button
                  disabled={this.state.name === ''}
                  type="submit"
                  color="primary"
                  variant="contained"
                >
                  {t('smart_list.submit')}
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
  withTranslation(['smartList']),
)(SmartListFormDialog);
