// @flow
import React from 'react';

import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import TodayIcon from '@material-ui/icons/Today';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Card from '@material-ui/core/Card';

import type { PrivateService } from '../../types';

const styles = (theme) => ({
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTitleContainer: {
    marginBottom: theme.spacing(2),
  },
  alert: {
    marginTop: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  row: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  loading: {
    height: theme.spacing(8),
    marginRight: theme.spacing(1),
  },
});

type Props = {
  goToCoachCalendar: (id: number) => void,
  goToEstablishmentCalendar: (id: number) => void,
  goToPrivateServiceCalendar: (id: number) => void,
  switchServiceHasOwnAvailabilitySlots: () => void,
  getResourceSlotsExistState: (
    resourceDatatype: string,
    resourceId: number,
  ) => { exists: boolean, loading: boolean },
  t: TFunction,
  classes: Object,
  privateService: PrivateService,
};

const ResourceConfigurationChecker = withStyles(styles)(
  withTranslation(['privateService'])((props) => (
    <Card className={props.classes.row} onClick={props.onClick}>
      {props.loading ? (
        <CircularProgress className={props.classes.loading} />
      ) : null}
      {!props.loading && props.exists ? (
        <CheckIcon className={props.classes.leftIcon} color="primary" />
      ) : null}
      {!props.loading && !props.exists ? (
        <TodayIcon className={props.classes.leftIcon} color="error" />
      ) : null}
      <div className={props.classes.leftColumn}>
        <Typography align="left" variant="body1">
          {props.name}
        </Typography>
        {props.loading ? (
          <Typography color="textSecondary" variant="caption">
            {' '}
            -{' '}
          </Typography>
        ) : null}
        {!props.loading && props.exists ? (
          <Typography align="left" color="textSecondary" variant="caption">
            {props.t('service.configuration.hasFutureSlot')}
          </Typography>
        ) : null}
        {props.capacity ? (
          <Typography align="left" color="textSecondary" variant="caption">
            {props.t('service.configuration.totalCapacity', {
              capacity: props.capacity,
            })}
          </Typography>
        ) : null}
        {!props.loading && !props.exists ? (
          <Typography align="left" color="error" variant="caption">
            {props.t('service.configuration.noFutureSlot', {
              resourceName: props.name,
            })}
          </Typography>
        ) : null}
        {props.capacityNotConfigured ? (
          <Typography align="left" color="error" variant="subtitle2">
            {props.t('service.configuration.noCapacity', {
              resourceName: props.name,
            })}
          </Typography>
        ) : null}
      </div>
    </Card>
  )),
);

export const PrivateServiceConfigurationHelper = (props: Props) => {
  const { privateService, getResourceSlotsExistState, t, classes } = props;
  const { exists } = getResourceSlotsExistState(
    'private_service',
    privateService.id,
  );

  return (
    <div>
      <div className={classes.alertTitleContainer}>
        <div className={classes.titleRow}>
          <TodayIcon className={classes.leftIcon} fontSize="large" />
          <Typography variant="h4">
            {t('service.configuration.title')}
          </Typography>
        </div>
        {props.privateService.available_on_partnership &&
          props.privateService.has_own_availability_slots && (
            <Alert className={classes.alert} severity="error">
              {t('service.configuration.partnership.removeAvailabilities')}
            </Alert>
          )}
      </div>

      <div>
        <Card
          className={classes.row}
          disabled={
            props.privateService.available_on_partnership &&
            !props.privateService.has_own_availability_slots
          }
          onClick={
            privateService.has_own_availability_slots
              ? () => props.goToPrivateServiceCalendar(privateService.id)
              : null
          }
        >
          <IconButton
            onClick={(ev) => {
              ev.stopPropagation();
              props.switchServiceHasOwnAvailabilitySlots();
            }}
          >
            <EditIcon color="primary" />
          </IconButton>
          <div className={classes.leftColumn}>
            <Typography align="left" variant="body1">
              {privateService.has_own_availability_slots
                ? t('service.configuration.explainSetToHasOwnAvailabilitySlots')
                : t(
                    'service.configuration.explainSetToHasNotOwnAvailabilitySlots',
                  )}
            </Typography>
            {privateService.has_own_availability_slots ? (
              <Typography
                align="left"
                color={exists ? 'textSecondary' : 'error'}
                variant="caption"
              >
                {exists
                  ? t('service.configuration.hasFutureSlot')
                  : t('service.configuration.noFutureSlot', {
                      resourceName: privateService.name,
                    })}
              </Typography>
            ) : (
              !props.privateService.available_on_partnership && (
                <Typography
                  align="left"
                  color="textSecondary"
                  variant="caption"
                >
                  {t('service.configuration.explainHasOwnAvailabilitySlots', {
                    serviceName: privateService.name,
                  })}
                </Typography>
              )
            )}
          </div>
        </Card>
        {privateService.establishments.map((establishment) => {
          const resourceSlotExistState = getResourceSlotsExistState(
            'associated_establishment',
            establishment.associatedestablishment_set[0],
          );
          const { exists: e, loading: l } = resourceSlotExistState;
          return (
            <ResourceConfigurationChecker
              key={`${establishment.id}`}
              capacity={establishment.capacity}
              capacityNotConfigured={establishment.capacity === 0}
              exists={e}
              loading={l}
              name={establishment.title}
              onClick={() => props.goToEstablishmentCalendar(establishment.id)}
            />
          );
        })}
        {privateService.coaches.map((coach) => {
          const resourceSlotExistState = getResourceSlotsExistState(
            'associated_coach',
            coach.associated_coach_id,
          );
          const { exists: e, loading: l } = resourceSlotExistState;
          return (
            <ResourceConfigurationChecker
              key={`coach${coach.id}`}
              exists={e}
              loading={l}
              name={coach.name}
              onClick={() => props.goToCoachCalendar(coach.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default compose(
  withStyles(styles),
  withTranslation(['privateService']),
)(PrivateServiceConfigurationHelper);
