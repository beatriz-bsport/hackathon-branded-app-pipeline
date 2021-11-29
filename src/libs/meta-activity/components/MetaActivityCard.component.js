// @flow
import React from 'react';

import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import { withTranslation, TFunction } from 'react-i18next';
import TypographyMultiline from '../../../components/TypographyMultiline.component';

import { formatMinutes } from '../../../utils/datetime';

type Props = {
  metaActivity: MetaActivity,
  classes: Object,
  shownImage: number,
  setShownImage: (number) => void,
  t: TFunction,
};

export const MetaActivityCard = (props: Props) => {
  const { classes, t, metaActivity, shownImage, setShownImage } = props;
  const nbImages =
    metaActivity.images.length + (metaActivity.cover_main ? 1 : 0);
  return (
    <Card style={{ width: '100%' }}>
      {nbImages ? (
        <div className={classes.imageContainer}>
          <div className={classes.previousImageButton}>
            <IconButton
              disabled={shownImage === 0}
              onClick={() => setShownImage(Math.max(shownImage - 1, 0))}
            >
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <div className={classes.nextImageButton}>
            <IconButton
              disabled={nbImages <= shownImage + 1}
              onClick={() =>
                setShownImage(Math.min(shownImage + 1, nbImages - 1))
              }
            >
              <ChevronRightIcon />
            </IconButton>
          </div>
          <CardMedia
            component="img"
            image={
              shownImage === 0
                ? metaActivity.cover_main
                : metaActivity.images[shownImage - 1]
            }
            classes={{
              media: classes.media,
            }}
          />
        </div>
      ) : null}
      {metaActivity.color ? (
        <div style={{ borderTop: `4px solid ${metaActivity.color}` }} />
      ) : null}
      <CardContent>
        <div className={classes.fullWidth}>
          <Typography variant="h5" component="h3">
            {metaActivity.name}
          </Typography>
          <Typography variant="caption" component="h4" align="right">
            {t('metaActivity:settings.lastBookingBeforeMinutes', {
              m: formatMinutes(metaActivity.last_booking_minutes, t),
            })}
          </Typography>
          <Typography variant="caption" component="h4" align="right">
            {t('metaActivity:settings.lastDiscardBeforeMinutes', {
              m: formatMinutes(metaActivity.last_discard_minutes, t),
            })}
          </Typography>
          <Typography variant="caption" component="h4" align="right">
            {t('metaActivity:settings.firstBookingMinutesUntil', {
              m: formatMinutes(metaActivity.first_booking_minutes_until, t),
            })}
          </Typography>
          {metaActivity.auto_discard_active ? (
            <Typography variant="caption" component="h4" align="right">
              {t('metaActivity:settings.autoDiscard', {
                nb_bookings: metaActivity.auto_discard_min_bookings_nb,
                hours: metaActivity.auto_discard_hours_before_start,
              })}
            </Typography>
          ) : null}
        </div>
        <div style={{ marginTop: 16 }}>
          <TypographyMultiline variant="" color="textSecondary">
            {metaActivity.description}
          </TypographyMultiline>
        </div>
      </CardContent>
    </Card>
  );
};
const styles = () => ({
  media: { objectFit: 'cover', maxHeight: '60vh' },
  fullWidth: {
    width: '100%',
  },
  nextImageButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
  },
  imageContainer: {
    position: 'relative',
  },
  previousImageButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
});

export default compose(
  withTranslation(['metaActivity', 'datetime']),
  withStyles(styles),
  withState('shownImage', 'setShownImage', 0),
)(MetaActivityCard);
