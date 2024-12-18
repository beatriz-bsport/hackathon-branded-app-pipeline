import React from 'react';

import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
  withStyles,
  Theme,
} from '@material-ui/core';

import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import DateTimeForm from '../../../components/input/DateTimeInput.component';
import { MaterialStyleType } from '../../../utils/types';
import FabWithItems from '../../../components/button/FabWithItems';

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
      privateBookerDateStart: props.startDate
        ? DateTime.fromISO(props.startDate)
            .setZone(props.timezone)
            .set({ hour: 12 })
            .toISO()
        : DateTime.now().setZone(props.timezone).set({ hour: 12 }).toISO(),
      customEventOpen: false,
      customEventDateStart: props.startDate
        ? DateTime.fromISO(props.startDate)
            .setZone(props.timezone)
            .set({ hour: 12 })
            .toISO()
        : DateTime.now().setZone(props.timezone).set({ hour: 12 }).toISO(),
      customEventDateEnd: props.startDate
        ? DateTime.fromISO(props.startDate)
            .setZone(props.timezone)
            .set({ hour: 13 })
            .toISO()
        : DateTime.now().setZone(props.timezone).set({ hour: 13 }).toISO(),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.startDate !== this.props.startDate) {
      this.setDefaultDates();
    }
  }

  setDefaultDates = () => {
    this.setState({
      privateBookerDateStart: this.props.startDate
        ? DateTime.fromISO(this.props.startDate)
            .setZone(this.props.timezone)
            .set({ hour: 12 })
            .toISO()
        : DateTime.now().setZone(this.props.timezone).set({ hour: 12 }).toISO(),
      customEventDateStart: this.props.startDate
        ? DateTime.fromISO(this.props.startDate)
            .setZone(this.props.timezone)
            .set({ hour: 12 })
            .toISO()
        : DateTime.now().setZone(this.props.timezone).set({ hour: 12 }).toISO(),
      customEventDateEnd: this.props.startDate
        ? DateTime.fromISO(this.props.startDate)
            .setZone(this.props.timezone)
            .set({ hour: 13 })
            .toISO()
        : DateTime.now().setZone(this.props.timezone).set({ hour: 13 }).toISO(),
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
              onChange={(privateBookerDateStart: DateTime) =>
                this.setState({
                  privateBookerDateStart: privateBookerDateStart.toISO(),
                })
              }
              timezone={this.props.timezone}
              value={DateTime.fromISO(this.state.privateBookerDateStart)}
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
              // @ts-expect-error
              onChange={(customEventDateStart: string) =>
                this.setState({ customEventDateStart })
              }
              timezone={this.props.timezone}
              value={DateTime.fromISO(this.state.customEventDateStart)}
            />
            <Typography
              className={this.props.classes.marginTop}
              color="textSecondary"
              variant="subtitle1"
            >
              {this.props.t('calendar.customEvent.dateEnd')}
            </Typography>
            <DateTimeForm
              onChange={(value: DateTime) =>
                this.setState({ customEventDateEnd: value.toISO() })
              }
              timezone={this.props.timezone}
              value={DateTime.fromISO(this.state.customEventDateEnd)}
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
                DateTime.fromISO(this.state.customEventDateEnd) <
                  DateTime.fromISO(this.state.customEventDateStart)
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
  withStyles(styles),
  withTranslation(['privateService']),
)(FabPrivateCalendar);
