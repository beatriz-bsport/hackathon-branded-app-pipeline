// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

import DatePicker from 'material-ui-pickers/DatePicker';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';

import moment from 'moment-timezone';

type Props = {
  t: TFunction,
  onSubmit: (date: string) => void,
  onClose: () => void,
  mode: string,
  loading: boolean,
  open: boolean,
  eventSlot: {
    startStr: string,
    endStr: string,
  },
  classes: Object,
  fullScreen?: boolean,
};

type State = {
  date: ?string,
};

export class RecurrentAvailabilityFormDialog extends React.Component<
  Props,
  State,
> {
  state = {
    date: null,
  };

  onSubmit = (ev: SyntheticEvent<HTMLElement>) => {
    ev.preventDefault();
    this.props.onSubmit(this.state.date.format('YYYY-MM-DD'));
  };

  handleDateChange = (date: Object) => {
    this.setState({ date });
  };

  render() {
    return (
      <Dialog fullScreen={!!this.props.fullScreen} open={!!this.props.open}>
        <form onSubmit={this.onSubmit}>
          <DialogTitle>
            {this.props.t(`calendar.form.title.${this.props.mode}`)}
          </DialogTitle>
          <DialogContent>
            <div className={this.props.classes.content}>
              <Typography variant="subtitle2">
                {this.props.t('calendar.form.interval.explain1')}
              </Typography>
              <Typography>
                {this.props.eventSlot
                  ? this.props.t('calendar.form.interval.explain2', {
                      date_start: moment(this.props.eventSlot.startStr).format(
                        'HH:mm',
                      ),
                      date_end: moment(this.props.eventSlot.endStr).format(
                        'HH:mm',
                      ),
                      day: moment(this.props.eventSlot.startStr).format('dddd'),
                    })
                  : null}
              </Typography>
            </div>
            <Typography variant="subtitle2">
              {this.props.t('calendar.form.explain')}
            </Typography>
            <MuiPickersUtilsProvider
              utils={MomentUtils}
              moment={moment}
              locale={moment.locale()}
            >
              <DatePicker
                required
                keyboard
                value={this.state.date}
                disablePast
                format="L"
                onChange={this.handleDateChange}
                mask={(value) => {
                  if (value) {
                    return [
                      /\d/,
                      /\d/,
                      '/',
                      /\d/,
                      /\d/,
                      '/',
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                    ];
                  }
                  return [];
                }}
              />
            </MuiPickersUtilsProvider>
          </DialogContent>
          <DialogActions>
            {this.props.loading ? (
              <CircularProgress />
            ) : (
              <React.Fragment>
                <Button onClick={this.props.onClose}>
                  {this.props.t('calendar.form.actions.cancel')}
                </Button>
                <Button type="submit" color="primary">
                  {this.props.t('calendar.form.actions.submit')}
                </Button>
              </React.Fragment>
            )}
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  content: {
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(RecurrentAvailabilityFormDialog);
