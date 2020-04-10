// @flow
import React from 'react';

import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import ButtonBase from '@material-ui/core/ButtonBase';
import Paper from '@material-ui/core/Paper';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import LocationIcon from '@material-ui/icons/LocationOn';
import PersonIcon from '@material-ui/icons/Person';
import CircularProgress from '@material-ui/core/CircularProgress';

import TypographyMultiline from '../../../components/TypographyMultiline.component';

import PrivateSlotEditableList from './PrivateSlotEditableList.component';

import CoachListItemBasic from '../../associated-coach/components/CoachListItemBasic.component';
import EstablishmentListItem from '../../establishment/components/EstablishmentListItem.component';

import type { PrivateService } from '../types';

type Props = {
  privateService: PrivateService,
  coaches: Array<AssociatedCoach>,
  deletePrivateSlot: (any) => void,
  createOrUpdatePrivateSlot: (any) => void,

  t: TFunction,
  classes: Object,
};

const resourceConfigurationStyles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit * 2,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    padding: theme.spacing.unit * 2,
    backgroundColor: '#F8F8F8',
    borderRadius: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit,
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const ResourceConfigurationChecker = withStyles(resourceConfigurationStyles)(
  withNamespaces(['privateService'])((props) => (
    <ButtonBase onClick={props.onClick} className={props.classes.row}>
      {props.loading ? <CircularProgress /> : null}
      {!props.loading && props.exists ? (
        <CheckIcon color="primary" className={props.classes.leftIcon} />
      ) : null}
      {!props.loading && !props.exists ? (
        <CancelIcon color="error" className={props.classes.leftIcon} />
      ) : null}
      <div className={props.classes.leftColumn}>
        <Typography variant="body2">{props.name}</Typography>
        {props.loading ? (
          <Typography variant="caption" color="textSecondary">
            {' '}
            -{' '}
          </Typography>
        ) : null}
        {!props.loading && props.exists ? (
          <Typography variant="caption" color="textSecondary">
            {props.t('service.configuration.hasFutureSlot')}
          </Typography>
        ) : null}
        {!props.loading && !props.exists ? (
          <Typography variant="caption" color="error">
            {props.t('service.configuration.noFutureSlot', {
              resourceName: props.name,
            })}
          </Typography>
        ) : null}
      </div>
    </ButtonBase>
  )),
);

export const PrivateServiceConfigurationChecker = (props) => {
  const { loading, exists } = props.getResourceSlotsExistState(
    'private_service',
    props.privateService.id,
  );
  return (
    <div>
      <Typography variant="h4">
        {props.t('service.configuration.title')}
      </Typography>
      <Paper>
        <ResourceConfigurationChecker
          name={props.privateService.name}
          onClick={() =>
            props.goToPrivateServiceCalendar(props.privateService.id)
          }
          loading={loading}
          exists={exists}
        />
        {props.privateService.establishments.map((establishment) => {
          const resourceSlotExistState = props.getResourceSlotsExistState(
            'associated_establishment',
            establishment.associatedestablishment_set[0],
          );
          const { exists, loading } = resourceSlotExistState;
          return (
            <ResourceConfigurationChecker
              name={establishment.title}
              onClick={() => props.goToEstablishmentCalendar(establishment.id)}
              loading={loading}
              exists={exists}
              key={`${establishment.id}`}
            />
          );
        })}
        {props.privateService.coaches.map((coach) => {
          const resourceSlotExistState = props.getResourceSlotsExistState(
            'associated_coach',
            coach.associated_coach_id,
          );
          const { exists, loading } = resourceSlotExistState;
          return (
            <ResourceConfigurationChecker
              name={coach.name}
              onClick={() => props.goToCoachCalendar(coach.id)}
              loading={loading}
              exists={exists}
              key={`coach${coach.id}`}
            />
          );
        })}
      </Paper>
    </div>
  );
};

export const PrivateServiceDetail = (props: Props) => {
  const { t, classes, privateService } = props;
  return (
    <Grid container spacing={16} direction="row">
      <Grid item md={6} xs={12}>
        <Card className={classes.paperContainer}>
          {privateService.cover_main ? (
            <CardMedia
              component="img"
              image={privateService.cover_main}
              classes={{
                media: classes.media,
              }}
            />
          ) : null}
          {privateService.color ? (
            <div style={{ borderTop: `4px solid ${privateService.color}` }} />
          ) : null}
          <CardContent>
            <Typography variant="h4" component="h3" className={classes.title}>
              {privateService.name}
            </Typography>
            <Typography
              variant="h6"
              component="h4"
              className={classes.subtitle}
            >
              {t('service.parameters.description')}
            </Typography>
            <TypographyMultiline
              color="textSecondary"
              className={classes.description}
            >
              {privateService.description}
            </TypographyMultiline>
            {privateService.coaches.length ? (
              <Typography
                variant="h6"
                component="h4"
                className={classes.subtitle}
              >
                {t('service.parameters.coaches.title')}
              </Typography>
            ) : (
              <div className={classes.row}>
                <PersonIcon className={classes.leftIcon} />
                <Typography>
                  {t('service.parameters.coaches.is_empty')}
                </Typography>
              </div>
            )}
            {privateService.coaches.map((coach) => (
              <CoachListItemBasic coach={coach} key={coach.id} />
            ))}
            {privateService.is_home_service ? (
              <div className={classes.row}>
                <LocationIcon className={classes.leftIcon} />
                <Typography inline>
                  {t('service.parameters.establishments.is_home_service')}
                </Typography>
              </div>
            ) : null}
            {privateService.establishments.length ? (
              <Typography inline variant="h6" component="h4">
                {t('service.parameters.establishments.title')}
              </Typography>
            ) : null}
            {privateService.establishments.map((establishment) => (
              <EstablishmentListItem
                establishment={establishment}
                key={establishment.id}
              />
            ))}
          </CardContent>
        </Card>
        <Typography variant="h6" component="h4" className={classes.subtitle}>
          {t('service.parameters.slots.title')}
        </Typography>
        <Paper>
          <PrivateSlotEditableList
            privateService={privateService}
            deletePrivateSlot={props.deletePrivateSlot}
            createPrivateSlot={props.createOrUpdatePrivateSlot}
            updatePrivateSlot={props.createOrUpdatePrivateSlot}
          />
        </Paper>
      </Grid>
      <Grid item md={6} xs={12}>
        <PrivateServiceConfigurationChecker
          privateService={privateService}
          getResourceSlotsExistState={props.getResourceSlotsExistState}
          t={props.t}
          classes={props.classes}
          goToCoachCalendar={props.goToCoachCalendar}
          goToEstablishmentCalendar={props.goToEstablishmentCalendar}
          goToPrivateServiceCalendar={props.goToPrivateServiceCalendar}
        />
      </Grid>
    </Grid>
  );
};

const styles = (theme) => ({
  subtitle: {
    marginTop: theme.spacing.unit * 2,
  },
  description: {
    paddingLeft: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit * 2,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    padding: theme.spacing.unit * 2,
    backgroundColor: '#F8F8F8',
    borderRadius: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
)(PrivateServiceDetail);
