// @flow
import React from 'react';

import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';

import CardContent from '@material-ui/core/CardContent';
import LocationIcon from '@material-ui/icons/LocationOn';
import PersonIcon from '@material-ui/icons/Person';

import TypographyMultiline from '../../../../components/TypographyMultiline.component';

import CoachListItemBasic from '../../../associated-coach/components/CoachListItemBasic.component';
import EstablishmentListItem from '../../../establishment/components/EstablishmentListItem.component';

import type { PrivateService } from '../../types';

type Props = {
  privateService: PrivateService,
  t: TFunction,
  classes: Object,
};

export const PrivateServiceDetail = (props: Props) => {
  const { t, classes, privateService } = props;
  const discardDays = parseInt(
    privateService.last_discard_minutes / (60 * 24),
    10,
  );
  const discardHours = parseInt(
    (privateService.last_discard_minutes - discardDays * 60 * 24) / 60,
    10,
  );
  const discardMinutes = `${privateService.last_discard_minutes -
    discardDays * 60 * 24 -
    discardHours * 60}`;

  const bookingDays = parseInt(
    privateService.last_booking_minutes / (60 * 24),
    10,
  );
  const bookingHours = parseInt(
    (privateService.last_booking_minutes - bookingDays * 60 * 24) / 60,
    10,
  );
  const bookingMinutes = `${privateService.last_booking_minutes -
    bookingDays * 60 * 24 -
    bookingHours * 60}`;

  return (
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
          variant="caption"
          color="textSecondary"
          className={classes.subtitle}
          component="p"
        >
          {t('service.parameters.last_discard_minutes.explain', {
            days: discardDays,
            hours: discardHours,
            minutes: discardMinutes,
          })}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          className={classes.subtitle}
          component="p"
        >
          {t('service.parameters.last_booking_minutes.explain', {
            days: bookingDays,
            hours: bookingHours,
            minutes: bookingMinutes,
          })}
        </Typography>
        <Typography variant="h6" component="h4" className={classes.subtitle}>
          {t('service.parameters.description')}
        </Typography>
        <TypographyMultiline
          color="textSecondary"
          className={classes.description}
        >
          {privateService.description}
        </TypographyMultiline>
        {privateService.coaches.length ? (
          <Typography variant="h6" component="h4" className={classes.subtitle}>
            {t('service.parameters.coaches.title')}
          </Typography>
        ) : (
          <div className={classes.row}>
            <PersonIcon className={classes.leftIcon} />
            <Typography>{t('service.parameters.coaches.is_empty')}</Typography>
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
            showCapacity
          />
        ))}
      </CardContent>
    </Card>
  );
};

const styles = (theme) => ({
  subtitle: {
    marginTop: theme.spacing(2),
  },
  description: {
    paddingLeft: theme.spacing(2),
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
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(PrivateServiceDetail);
