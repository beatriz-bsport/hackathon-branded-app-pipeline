import React from 'react';
import { compose } from 'recompose';
import { DateTime } from 'luxon';
import { withTranslation, WithTranslation } from 'react-i18next';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { WithStyles, withStyles, Theme, Typography } from '@material-ui/core';
import red from '@material-ui/core/colors/red';

import type { PrivateBooking, PrivateSlot, PrivateService } from '../../types';
import type { Coach } from '../../../associated-coach/types';
import { Establishment } from '../../../establishment/types';
import { resourceAllocationChecker } from '../../api';
import { joinIntervalList } from '#libs/private-service/utils';

type OwnProps = {
  onCancel: () => void;
  onSubmit: () => void;
  privateBooking: PrivateBooking<
    PrivateSlot,
    Coach,
    Establishment,
    PrivateService
  >;
  coach?: Coach;
  establishment?: Establishment;
  dateStart?: string;
};

type State = {
  loading: boolean;
  coachUnavailable: boolean;
  establishmentUnavailable: boolean;
  privateServiceUnavailable: boolean;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

export class ResourceAllocationConfirmDialog extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      coachUnavailable: false,
      establishmentUnavailable: false,
      privateServiceUnavailable: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true }, this.checkResourceAllocation);
  }

  isNotAvailable = (data: string[][] | undefined) => {
    if (!data) {
      return false;
    }
    const filteredData = data.filter(
      (interval: string[]) => !!interval[0] && !!interval[1],
    );
    // if we updating date_start of private_booking, the current slot turns to be available
    const allIntervals = this.props.dateStart
      ? filteredData.concat([
          [
            this.props.privateBooking.date_start,
            this.props.privateBooking.date_end,
          ],
        ])
      : filteredData;
    const joinedIntervals = joinIntervalList(allIntervals);
    const dateTimeStart =
      this.props.dateStart || this.props.privateBooking.date_start
        ? DateTime.fromISO(
            this.props.dateStart || this.props.privateBooking.date_start,
          )
        : DateTime.now();

    return !joinedIntervals.some(
      (interval: string[]) =>
        dateTimeStart >= DateTime.fromISO(interval[0]) &&
        dateTimeStart.plus({
          minutes: this.props.privateBooking.private_slot.duration_minutes,
        }) <= DateTime.fromISO(interval[1]),
    );
  };

  checkResourceAllocation = async () => {
    try {
      const promiseCoach = this.props.privateBooking.coach
        ? resourceAllocationChecker(
            this.props.privateBooking.private_slot.id,
            'coach',
            this.props.coach?.id || this.props.privateBooking.coach.id,
            this.props.dateStart || this.props.privateBooking.date_start,
            this.props.establishment?.id ||
              this.props.privateBooking.establishment.id,
          )
        : null;
      const promiseEstablishment = this.props.privateBooking.establishment
        ? resourceAllocationChecker(
            this.props.privateBooking.private_slot.id,
            'establishment',
            this.props.establishment?.id ||
              this.props.privateBooking.establishment.id,
            this.props.dateStart || this.props.privateBooking.date_start,
          )
        : null;
      const promisePrivateService = this.props.privateBooking.private_service
        .has_own_availability_slots
        ? resourceAllocationChecker(
            this.props.privateBooking.private_slot.id,
            'private_service',
            this.props.privateBooking.private_service.id,
            this.props.dateStart || this.props.privateBooking.date_start,
          )
        : null;

      const [responseCoach, responseEstablishment, responsePrivateService] =
        await Promise.all([
          promiseCoach,
          promiseEstablishment,
          promisePrivateService,
        ]);

      this.setState(
        {
          // @ts-expect-error
          coachUnavailable: this.isNotAvailable(responseCoach?.data),
          establishmentUnavailable: this.isNotAvailable(
            // @ts-expect-error
            responseEstablishment?.data,
          ),
          privateServiceUnavailable: this.isNotAvailable(
            // @ts-expect-error
            responsePrivateService?.data,
          ),
        },
        () => {
          if (
            !this.state.coachUnavailable &&
            !this.state.establishmentUnavailable &&
            !this.state.privateServiceUnavailable
          ) {
            this.props.onSubmit();
          }
          this.setState({ loading: false });
        },
      );
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Dialog fullWidth open aria-labelledby="alert-dialog-title" maxWidth="sm">
        {this.state.loading ? <LinearProgress /> : null}
        <DialogTitle>
          {t(
            `resource.allocationWarning.${
              this.state.loading ? 'loading' : 'title'
            }`,
          )}
        </DialogTitle>
        {!this.state.loading ? (
          <>
            <DialogContent className={classes.contentText}>
              {this.state.coachUnavailable && (
                <div>
                  <Typography className={classes.contentTextIndent}>
                    {t('resource.allocationWarning.resource', {
                      resource:
                        this.props.coach?.name ||
                        this.props.privateBooking.coach.name,
                    })}
                  </Typography>
                </div>
              )}
              {this.state.establishmentUnavailable && (
                <div>
                  <Typography className={classes.contentTextIndent}>
                    {t('resource.allocationWarning.resource', {
                      resource:
                        this.props.establishment?.title ||
                        this.props.privateBooking.establishment.title,
                    })}
                  </Typography>
                </div>
              )}
              {this.state.privateServiceUnavailable && (
                <div>
                  <Typography className={classes.contentTextIndent}>
                    {t('resource.allocationWarning.resource', {
                      resource: this.props.privateBooking.private_service.name,
                    })}
                  </Typography>
                </div>
              )}
              {(this.state.coachUnavailable ||
                this.state.establishmentUnavailable ||
                this.state.privateServiceUnavailable) && (
                <div>
                  <Typography>
                    {t('resource.allocationWarning.continue')}
                  </Typography>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.props.onSubmit()}>
                {t('resource.allocationWarning.validate')}
              </Button>
              <Button onClick={this.props.onCancel}>
                {t('resource.allocationWarning.cancel')}
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogContent />
            <DialogActions />
          </>
        )}
      </Dialog>
    );
  }
}

const styles = (theme: Theme) => ({
  contentText: {
    color: red.A200,
  },
  contentTextIndent: {
    '&::before': {
      content: '"\u2022"',
      paddingRight: theme.spacing(1),
    },
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation('privateService'),
)(ResourceAllocationConfirmDialog);
