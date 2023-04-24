// @ts-nocheck
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Typography from '@material-ui/core/Typography';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import DateRangeIcon from '@material-ui/icons/DateRange';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import CancelIcon from '@material-ui/icons/Cancel';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import TypographyMultiline from '../../../components/typo/TypographyMultiline.component';

import { formatMinutes } from '../../../utils/datetime';
import {
  MetaActivity,
  MetaActivityCustomRestriction,
} from '#libs/meta-activity/types';
import { Tag, TagGroup } from '#libs/tag/types';
import MetaActivityCustomRestrictionDialog from './MetaActivityCustomRestrictionDialog.component';

type Props = {
  metaActivity: MetaActivity<Tag<TagGroup>>;
  onEdit?: () => void;
};

export const MetaActivityCard = (props: Props) => {
  const { metaActivity } = props;
  const classes = useStyles();
  const { t } = useTranslation(['translation', 'metaActivity', 'datetime']);
  const [
    selectedPersonnalizedRestrictions,
    setSelectedPersonnalizedRestrictions,
  ] = React.useState<null | MetaActivityCustomRestriction<Tag<TagGroup>>>(null);
  const handleEditMetaActivity = () => {
    props.onEdit && props.onEdit();
    setSelectedPersonnalizedRestrictions(null);
  };
  return (
    <>
      <Card style={{ width: '100%' }}>
        {metaActivity.color ? (
          <div style={{ borderTop: `4px solid ${metaActivity.color}` }} />
        ) : null}
        <CardContent>
          <div className={classes.fullWidth}>
            <div className={classes.title}>
              <Typography variant="h4">{metaActivity.name}</Typography>
            </div>
            <div className={classes.restrictionSubSection}>
              <div className={classes.headerWithIcon}>
                <EventAvailableIcon className={classes.leftIcon} />
                <Typography variant="subtitle2">
                  {t('metaActivity:settings.lastBookingBeforeMinutesHeader')}
                </Typography>
              </div>
              <Typography
                variant="caption"
                color="textSecondary"
                className={classes.restrictionsInfo}
              >
                {t('metaActivity:settings.lastBookingBeforeMinutes', {
                  m: formatMinutes(metaActivity.last_booking_minutes, t, true),
                })}
              </Typography>
            </div>
            <div className={classes.restrictionSubSection}>
              <div className={classes.headerWithIcon}>
                <EventBusyIcon className={classes.leftIcon} />
                <Typography variant="subtitle2">
                  {t('metaActivity:settings.lastDiscardBeforeMinutesHeader')}
                </Typography>
              </div>
              <Typography
                variant="caption"
                color="textSecondary"
                className={classes.restrictionsInfo}
              >
                {t('metaActivity:settings.lastDiscardBeforeMinutes', {
                  m: formatMinutes(metaActivity.last_discard_minutes, t, true),
                })}
              </Typography>
            </div>
            <div className={classes.restrictionSubSection}>
              <div className={classes.headerWithIcon}>
                <DateRangeIcon className={classes.leftIcon} />
                <Typography variant="subtitle2">
                  {t('metaActivity:settings.firstBookingMinutesUntilHeader')}
                </Typography>
              </div>
              <Typography
                variant="caption"
                color="textSecondary"
                className={classes.restrictionsInfo}
              >
                {formatMinutes(
                  metaActivity.first_booking_minutes_until,
                  t,
                  true,
                )}
              </Typography>
            </div>
            {(metaActivity.custom_restriction_rule || []).length !== 0 && (
              <div className={classes.restrictionSubSection}>
                <div className={classes.headerWithIcon}>
                  <LocalOfferIcon className={classes.leftIcon} />
                  <Typography variant="subtitle2">
                    {t('metaActivity:settings.restrictionsHeader')}
                  </Typography>
                </div>

                {metaActivity.custom_restriction_rule.map((crr, i) => (
                  <div key={`${i}`} className={classes.restrictionItem}>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      className={classes.restrictionsInfo}
                    >
                      {t('metaActivity:settings.restrictions', {
                        count: i + 1,
                      })}
                    </Typography>
                    <IconButton
                      color="primary"
                      onClick={() => setSelectedPersonnalizedRestrictions(crr)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}

            {metaActivity.auto_discard_active ? (
              <div className={classes.restrictionSubSection}>
                <div className={classes.headerWithIcon}>
                  <CancelIcon className={classes.leftIcon} />
                  <Typography variant="subtitle2">
                    {t('metaActivity:settings.autoDiscardHeader')}
                  </Typography>
                </div>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  className={classes.restrictionsInfo}
                >
                  {t('metaActivity:settings.autoDiscard', {
                    nb_bookings: metaActivity.auto_discard_min_bookings_nb,
                    hours: metaActivity.auto_discard_hours_before_start,
                  })}
                </Typography>
              </div>
            ) : null}
          </div>
          <div>
            <TypographyMultiline variant="" color="textSecondary">
              {metaActivity.description}
            </TypographyMultiline>
          </div>
        </CardContent>
      </Card>
      {!!selectedPersonnalizedRestrictions && (
        <MetaActivityCustomRestrictionDialog
          onClose={() => setSelectedPersonnalizedRestrictions(null)}
          onEdit={handleEditMetaActivity}
          {...selectedPersonnalizedRestrictions}
          open
        />
      )}
    </>
  );
};
const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '100%',
  },
  title: {
    paddingBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(2),
  },
  headerWithIcon: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  restrictionSubSection: {
    paddingTop: theme.spacing(2),
  },
  restrictionsInfo: {
    marginLeft: theme.spacing(5),
  },
  restrictionItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default MetaActivityCard;
