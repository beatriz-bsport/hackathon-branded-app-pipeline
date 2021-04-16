import React from 'react';

import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import {
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
  Fab,
  withStyles,
  Theme,
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import DateTimeForm from '../../../components/input/DateTimeInput.component';
import { MaterialStyleType } from '../../../utils/types';

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
  openFab: boolean;
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
      openFab: false,
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
        {this.state.openFab && (
          <ButtonBase
            className={this.props.classes.fabBackgroundContainer}
            disableRipple={true}
            onClick={() => this.setState({ openFab: false })}
          />
        )}

        <div className={this.props.classes.fabContainer}>
          {this.state.openFab && (
            <>
              <ButtonBase
                className={this.props.classes.fabItem}
                onClick={() => {
                  this.setDefaultDates();
                  this.setState({ openFab: false, privateBookerFabOpen: true });
                }}
              >
                <Typography>{this.props.t('calendar.addBooking')}</Typography>
              </ButtonBase>

              {this.props.createCustomEvent && (
                <ButtonBase
                  className={this.props.classes.fabItem}
                  onClick={() => {
                    this.setDefaultDates();
                    this.setState({ openFab: false, customEventOpen: true });
                  }}
                >
                  <Typography>
                    {this.props.t('calendar.createCustomEvent')}
                  </Typography>
                </ButtonBase>
              )}
            </>
          )}

          <Fab
            color="primary"
            aria-label="add"
            onClick={() =>
              this.setState((prevState) => ({
                openFab: !prevState.openFab,
              }))
            }
          >
            {this.state.openFab ? <CloseIcon /> : <AddIcon />}
          </Fab>
        </div>

        <Dialog
          open={this.state.privateBookerFabOpen}
          fullScreen={window.innerWidth < 400}
          onClose={() => this.setState({ privateBookerFabOpen: false })}
        >
          <DialogTitle>{this.props.t('calendar.addBooking')}</DialogTitle>
          <div className={this.props.classes.dialogDateContainer}>
            <DateTimeForm
              timezone={this.props.timezone}
              value={this.state.privateBookerDateStart}
              onChange={(privateBookerDateStart: string) =>
                this.setState({ privateBookerDateStart })
              }
            />
          </div>
          <DialogActions>
            <Button
              onClick={() => this.setState({ privateBookerFabOpen: false })}
            >
              {this.props.t('bookerModule.cancel')}
            </Button>

            <Button
              variant="contained"
              color="primary"
              disabled={!this.state.privateBookerDateStart}
              onClick={() => {
                this.setState({ privateBookerFabOpen: false });
                this.props.onSubmitPrivateServiceWithDate(
                  this.state.privateBookerDateStart,
                );
              }}
            >
              {this.props.t('bookerModule.confirm')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.customEventOpen}
          fullScreen={window.innerWidth < 400}
          onClose={() => this.setState({ customEventOpen: false })}
        >
          <DialogTitle>
            {this.props.t('calendar.createCustomEvent')}
          </DialogTitle>
          <div className={this.props.classes.dialogDateContainer}>
            <Typography variant="subtitle1" color="textSecondary">
              {this.props.t('calendar.customEvent.dateStart')}
            </Typography>
            <DateTimeForm
              timezone={this.props.timezone}
              value={this.state.customEventDateStart}
              onChange={(customEventDateStart: string) =>
                this.setState({ customEventDateStart })
              }
            />
            <Typography
              className={this.props.classes.marginTop}
              variant="subtitle1"
              color="textSecondary"
            >
              {this.props.t('calendar.customEvent.dateEnd')}
            </Typography>
            <DateTimeForm
              timezone={this.props.timezone}
              value={this.state.customEventDateEnd}
              onChange={(customEventDateEnd: string) =>
                this.setState({ customEventDateEnd })
              }
            />
          </div>
          <DialogActions>
            <Button onClick={() => this.setState({ customEventOpen: false })}>
              {this.props.t('bookerModule.cancel')}
            </Button>

            <Button
              variant="contained"
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
  fabBackgroundContainer: {
    width: '100%',
    height: '100%',
    position: 'fixed',
    backgroundColor: '#00000033',
    zIndex: 999,
    top: 0,
    left: 0,
  },
  fabContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    zIndex: 9999,
    position: 'fixed',
    bottom: 20,
    right: 20,
  },
  fabItem: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    marginBottom: theme.spacing(2),
    borderRadius: 5,
    backgroundColor: 'white',
    'box-shadow': '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  },
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
