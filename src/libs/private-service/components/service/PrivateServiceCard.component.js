// @flow
import React, { useMemo } from 'react';

import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';

import CardContent from '@material-ui/core/CardContent';
import LocationIcon from '@material-ui/icons/LocationOn';
import PersonIcon from '@material-ui/icons/Person';

import TypographyMultiline from '../../../../components/typo/TypographyMultiline.component';

import CoachListItemBasic from '../../../associated-coach/components/CoachListItemBasic.component';
import EstablishmentListItem from '../../../establishment/components/EstablishmentListItem.component';

import type { PrivateService } from '../../types';
import { TagChip } from '../../../tag/components/TagChip.component';
import type { Tag, TagGroup } from '../../../tag/types';

type Props = {
  tagList: Array<Tag<TagGroup>>,
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
  const discardMinutes = `${
    privateService.last_discard_minutes -
    discardDays * 60 * 24 -
    discardHours * 60
  }`;

  const bookingDays = parseInt(
    privateService.last_booking_minutes / (60 * 24),
    10,
  );
  const bookingHours = parseInt(
    (privateService.last_booking_minutes - bookingDays * 60 * 24) / 60,
    10,
  );
  const bookingMinutes = `${
    privateService.last_booking_minutes -
    bookingDays * 60 * 24 -
    bookingHours * 60
  }`;

  const whiteListTags = useMemo(
    () =>
      privateService.member_whitelist_tags
        ? props.tagList.filter((tag) =>
            privateService.member_whitelist_tags.includes(tag.id),
          )
        : [],
    [props.tagList, privateService.member_whitelist_tags],
  );
  const blackListTags = useMemo(
    () =>
      privateService.member_blacklist_tags
        ? props.tagList.filter((tag) =>
            privateService.member_blacklist_tags.includes(tag.id),
          )
        : [],
    [props.tagList, privateService.member_blacklist_tags],
  );

  return (
    <Card className={classes.paperContainer}>
      {privateService.cover_main ? (
        <div className={classes.coverContainer}>
          <img
            alt={privateService.name}
            className={classes.cover}
            src={privateService.cover_main}
          />
        </div>
      ) : null}
      {privateService.color ? (
        <div style={{ borderTop: `4px solid ${privateService.color}` }} />
      ) : null}
      <CardContent>
        <Typography className={classes.title} component="h3" variant="h4">
          {privateService.name}
        </Typography>
        <Typography
          className={classes.subtitle}
          color="textSecondary"
          component="p"
          variant="caption"
        >
          {t('service.parameters.last_discard_minutes.explain', {
            days: discardDays,
            hours: discardHours,
            minutes: discardMinutes,
          })}
        </Typography>
        <Typography
          className={classes.subtitle}
          color="textSecondary"
          component="p"
          variant="caption"
        >
          {t('service.parameters.last_booking_minutes.explain', {
            days: bookingDays,
            hours: bookingHours,
            minutes: bookingMinutes,
          })}
        </Typography>
        <Typography className={classes.subtitle} component="h4" variant="h6">
          {t('service.parameters.description')}
        </Typography>
        <TypographyMultiline
          className={classes.description}
          color="textSecondary"
        >
          {privateService.description}
        </TypographyMultiline>
        {privateService.coaches.length ? (
          <Typography className={classes.subtitle} component="h4" variant="h6">
            {t('service.parameters.coaches.title')}
          </Typography>
        ) : (
          <div className={classes.row}>
            <PersonIcon className={classes.leftIcon} />
            <Typography>{t('service.parameters.coaches.is_empty')}</Typography>
          </div>
        )}
        {privateService.coaches.map((coach) => (
          <CoachListItemBasic key={coach.id} coach={coach} />
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
          <Typography inline component="h4" variant="h6">
            {t('service.parameters.establishments.title')}
          </Typography>
        ) : null}
        {privateService.establishments.map((establishment) => (
          <EstablishmentListItem
            key={establishment.id}
            showCapacity
            establishment={establishment}
          />
        ))}
        {(whiteListTags.length > 0 || blackListTags.length > 0) && (
          <>
            <Typography inline component="h4" variant="h6">
              {t('service.parameters.whitelistTags.title')}
            </Typography>
            {whiteListTags.length > 0 ? (
              <div className={classes.chipContainer}>
                {whiteListTags.map((tag) => (
                  <TagChip key={tag.id} tag={tag} />
                ))}
              </div>
            ) : (
              <Typography className={classes.noTags} color="textSecondary">
                {t('service.parameters.noTags')}
              </Typography>
            )}

            <Typography inline component="h4" variant="h6">
              {t('service.parameters.blacklistTags.title')}
            </Typography>
            {blackListTags.length > 0 ? (
              <div className={classes.chipContainer}>
                {blackListTags.map((tag) => (
                  <TagChip key={tag.id} tag={tag} />
                ))}
              </div>
            ) : (
              <Typography className={classes.noTags} color="textSecondary">
                {t('service.parameters.noTags')}
              </Typography>
            )}
          </>
        )}
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
  chipContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  noTags: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(1),
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
  coverContainer: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%',
    height: 0,
  },
  cover: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    objectFit: 'cover',
    top: 0,
    left: 0,
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(PrivateServiceDetail);
