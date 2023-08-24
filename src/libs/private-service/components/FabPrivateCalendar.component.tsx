// @ts-nocheck
import React from 'react';

import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
  withStyles,
  Theme,
} from '@material-ui/core';

import DateTimeForm from '../../../components/input/DateTimeInput.component';
import { MaterialStyleType } from '../../../utils/types';
import FabWithItems from '../../../components/button/FabWithItems';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

type OwnProps = {
  timezone: string;
  startDate: string;
  onSubmitPrivateServiceWithDate: (date_start: string) => void;
  createCustomEvent?: (interval: {
    date_start: string;
    date_end: string;
  }) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

interface State {
  privateBookerFabOpen: boolean;
  privateBookerDateStart: string;

  customEventOpen: boolean;
  customEventDateStart: string;
  customEventDateEnd: string;
}

class FabPrivateCalendar extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      privateBookerFabOpen: false,
      privateBookerDateStart: moment(props.startDate)
        .tz(props.timezone)
        .set('hour', 12)
        .format(),

      customEventOpen: false,
      customEventDateStart: moment(props.startDate)
        .tz(props.timezone)
        .set('hour', 12)
        .format(),
      customEventDateEnd: moment(props.startDate)
        .tz(props.timezone)
        .set('hour', 13)
        .format(),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.startDate !== this.props.startDate) {
      this.setDefaultDates();
    }
  }

  setDefaultDates = () => {
    this.setState({
      privateBookerDateStart: moment(this.props.startDate)
        .tz(this.props.timezone)
        .set('hour', 12)
        .format(),
      customEventDateStart: moment(this.props.startDate)
        .tz(this.props.timezone)
        .set('hour', 12)
        .format(),
      customEventDateEnd: moment(this.props.startDate)
        .tz(this.props.timezone)
        .set('hour', 13)
        .format(),
    });
  };

  render() {
    return (
      <>
        <ObjectLevelPermissionProvider requiredPermission="reservation.privateBooking.allowed_actions.create">
          {(hasCreatePermission) => {
            return (
              <FabWithItems
                hidden={!hasCreatePermission}
                items={[
                  {
                    label: this.props.t('calendar.addBooking'),
                    onClick: () => {
                      this.setDefaultDates();
                      this.setState({ privateBookerFabOpen: true });
                    },
                  },
                  this.props.createCustomEvent && {
                    label: this.props.t('calendar.createCustomEvent'),
                    onClick: () => {
                      this.setDefaultDates();
                      this.setState({ customEventOpen: true });
                    },
                  },
                ]}
              />
            );
          }}
        </ObjectLevelPermissionProvider>

        <Dialog
          fullScreen={window.innerWidth < 400}
          onClose={() => this.setState({ privateBookerFabOpen: false })}
          open={this.state.privateBookerFabOpen}
        >
          <DialogTitle>{this.props.t('calendar.addBooking')}</DialogTitle>
          <div className={this.props.classes.dialogDateContainer}>
            <DateTimeForm
              onChange={(privateBookerDateStart: string) =>
                this.setState({ privateBookerDateStart })
              }
              timezone={this.props.timezone}
              value={this.state.privateBookerDateStart}
            />
          </div>
          <DialogActions>
            <Button
              onClick={() => this.setState({ privateBookerFabOpen: false })}
            >
              {this.props.t('bookerModule.cancel')}
            </Button>

            <Button
              color="primary"
              disabled={!this.state.privateBookerDateStart}
              onClick={() => {
                this.setState({ privateBookerFabOpen: false });
                this.props.onSubmitPrivateServiceWithDate(
                  this.state.privateBookerDateStart,
                );
              }}
              variant="contained"
            >
              {this.props.t('bookerModule.confirm')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen={window.innerWidth < 400}
          onClose={() => this.setState({ customEventOpen: false })}
          open={this.state.customEventOpen}
        >
          <DialogTitle>
            {this.props.t('calendar.createCustomEvent')}
          </DialogTitle>
          <div className={this.props.classes.dialogDateContainer}>
            <Typography color="textSecondary" variant="subtitle1">
              {this.props.t('calendar.customEvent.dateStart')}
            </Typography>
            <DateTimeForm
              onChange={(customEventDateStart: string) =>
                this.setState({ customEventDateStart })
              }
              timezone={this.props.timezone}
              value={this.state.customEventDateStart}
            />
            <Typography
              className={this.props.classes.marginTop}
              color="textSecondary"
              variant="subtitle1"
            >
              {this.props.t('calendar.customEvent.dateEnd')}
            </Typography>
            <DateTimeForm
              onChange={(customEventDateEnd: string) =>
                this.setState({ customEventDateEnd })
              }
              timezone={this.props.timezone}
              value={this.state.customEventDateEnd}
            />
          </div>
          <DialogActions>
            <Button onClick={() => this.setState({ customEventOpen: false })}>
              {this.props.t('bookerModule.cancel')}
            </Button>

            <Button
              color="primary"
              disabled={
                !this.state.customEventDateStart ||
                !this.state.customEventDateStart ||
                moment(this.state.customEventDateEnd).isBefore(
                  moment(this.state.customEventDateStart),
                )
              }
              onClick={() => {
                this.setState({ customEventOpen: false });
                this.props.createCustomEvent({
                  date_start: this.state.customEventDateStart,
                  date_end: this.state.customEventDateEnd,
                });
              }}
              variant="contained"
            >
              {this.props.t('bookerModule.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

const styles = (theme: Theme) => ({
  dialogDateContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['privateService']),
)(FabPrivateCalendar);
