// @flow
import React from 'react';

import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import TodayIcon from '@material-ui/icons/Today';
import CheckIcon from '@material-ui/icons/Check';

import CircularProgress from '@material-ui/core/CircularProgress';

import type { PrivateService } from '../../types';

const styles = (theme) => ({
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    padding: theme.spacing(2),
    backgroundColor: '#F8F8F8',
    borderRadius: theme.spacing(2),
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
    <ButtonBase onClick={props.onClick} className={props.classes.row}>
      {props.loading ? (
        <CircularProgress className={props.classes.loading} />
      ) : null}
      {!props.loading && props.exists ? (
        <CheckIcon color="primary" className={props.classes.leftIcon} />
      ) : null}
      {!props.loading && !props.exists ? (
        <TodayIcon color="error" className={props.classes.leftIcon} />
      ) : null}
      <div className={props.classes.leftColumn}>
        <Typography align="left" variant="body1">
          {props.name}
        </Typography>
        {props.loading ? (
          <Typography variant="caption" color="textSecondary">
            {' '}
            -{' '}
          </Typography>
        ) : null}
        {!props.loading && props.exists ? (
          <Typography align="left" variant="caption" color="textSecondary">
            {props.t('service.configuration.hasFutureSlot')}
          </Typography>
        ) : null}
        {props.capacity ? (
          <Typography align="left" variant="caption" color="textSecondary">
            {props.t('service.configuration.totalCapacity', {
              capacity: props.capacity,
            })}
          </Typography>
        ) : null}
        {!props.loading && !props.exists ? (
          <Typography align="left" variant="caption" color="error">
            {props.t('service.configuration.noFutureSlot', {
              resourceName: props.name,
            })}
          </Typography>
        ) : null}
        {props.capacityNotConfigured ? (
          <Typography align="left" variant="subtitle2" color="error">
            {props.t('service.configuration.noCapacity', {
              resourceName: props.name,
            })}
          </Typography>
        ) : null}
      </div>
    </ButtonBase>
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
      <div className={classes.titleRow}>
        <TodayIcon fontSize="large" className={classes.leftIcon} />
        <Typography variant="h4">{t('service.configuration.title')}</Typography>
      </div>
      <Paper>
        <ButtonBase
          onClick={
            privateService.has_own_availability_slots
              ? () => props.goToPrivateServiceCalendar(privateService.id)
              : null
          }
          className={classes.row}
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
                variant="caption"
                color={exists ? 'textSecondary' : 'error'}
              >
                {exists
                  ? t('service.configuration.hasFutureSlot')
                  : t('service.configuration.noFutureSlot', {
                      resourceName: privateService.name,
                    })}
              </Typography>
            ) : (
              <Typography align="left" variant="caption" color="textSecondary">
                {t('service.configuration.explainHasOwnAvailabilitySlots', {
                  serviceName: privateService.name,
                })}
              </Typography>
            )}
          </div>
        </ButtonBase>
        {privateService.establishments.map((establishment) => {
          const resourceSlotExistState = getResourceSlotsExistState(
            'associated_establishment',
            establishment.associatedestablishment_set[0],
          );
          const { exists: e, loading: l } = resourceSlotExistState;
          return (
            <ResourceConfigurationChecker
              name={establishment.title}
              onClick={() => props.goToEstablishmentCalendar(establishment.id)}
              loading={l}
              exists={e}
              capacityNotConfigured={establishment.capacity === 0}
              capacity={establishment.capacity}
              key={`${establishment.id}`}
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
              name={coach.name}
              onClick={() => props.goToCoachCalendar(coach.id)}
              loading={l}
              exists={e}
              key={`coach${coach.id}`}
            />
          );
        })}
      </Paper>
    </div>
  );
};

export default compose(
  withStyles(styles),
  withTranslation(['privateService']),
)(PrivateServiceConfigurationHelper);
