import React from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import DateRangeIcon from '@material-ui/icons/DateRange';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

import { formatMinutes } from '../../../utils/datetime';
import { Tag, TagGroup } from '#libs/tag/types';
import TagChip from '#libs/tag/components/TagChip.component';

type Props = {
  open: boolean;
  onEdit: () => void;
  onClose: () => void;
  tags: Array<Tag<TagGroup>>;
  last_discard_minutes: number;
  last_booking_minutes: number;
  first_booking_minutes_until: number;
};

export const MetaActivityCustomRestrictionDialog = (props: Props) => {
  const {
    open,
    tags,
    last_booking_minutes,
    last_discard_minutes,
    first_booking_minutes_until,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation(['translation', 'metaActivity', 'datetime']);

  return (
    <GenericResponsiveDialog maxWidth="sm" open={open}>
      <DialogContent>
        <div className={classes.fullWidth}>
          <div className={classes.headerWithIcon}>
            <Typography variant="h6">
              {t('translation:restrictions.tags.header')}
            </Typography>
          </div>
          <Divider />
          <div className={classes.tagSection}>
            {tags?.map((tag, i) => (
              <div key={`${i}`}>
                <TagChip key={tag.id} size="small" tag={tag} />
              </div>
            ))}
          </div>
          <div className={classes.headerWithIcon}>
            <Typography variant="h6">
              {t('translation:restrictions.header')}
            </Typography>
          </div>
          <Divider />
          <div className={classes.restrictionSubSection}>
            <div className={classes.headerWithIcon}>
              <EventAvailableIcon className={classes.leftIcon} />
              <Typography variant="subtitle2">
                {t('metaActivity:settings.lastBookingBeforeMinutesHeader')}
              </Typography>
            </div>
            <Typography className={classes.restrictionsInfo} variant="caption">
              {t('metaActivity:settings.lastBookingBeforeMinutes', {
                m: formatMinutes(last_booking_minutes, t, true),
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
            <Typography className={classes.restrictionsInfo} variant="caption">
              {t('metaActivity:settings.lastDiscardBeforeMinutes', {
                m: formatMinutes(last_discard_minutes, t, true),
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
            <Typography className={classes.restrictionsInfo} variant="caption">
              {formatMinutes(first_booking_minutes_until, t, true)}
            </Typography>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()} variant="text">
          {t('metaActivity:close')}
        </Button>
        <Button color="primary" onClick={() => props.onEdit()} variant="text">
          {t('metaActivity:edit')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
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
    color: 'rgba(0, 0, 0, 0.6)',
    marginLeft: theme.spacing(5),
  },
  description: {
    paddingTop: theme.spacing(2),
  },
  restrictionItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagSection: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
}));

export default MetaActivityCustomRestrictionDialog;
