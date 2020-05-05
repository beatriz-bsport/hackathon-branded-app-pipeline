// @flow
import React from 'react';

import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
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
  const days = parseInt(privateService.last_discard_minutes / (60 * 24), 10);
  const hours = parseInt(
    (privateService.last_discard_minutes - days * 60 * 24) / 60,
    10,
  );
  const minutes = `${privateService.last_discard_minutes -
    days * 60 * 24 -
    hours * 60}`;
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
        >
          {t('service.parameters.last_discard_minutes.explain', {
            days,
            hours,
            minutes,
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
          />
        ))}
      </CardContent>
    </Card>
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
