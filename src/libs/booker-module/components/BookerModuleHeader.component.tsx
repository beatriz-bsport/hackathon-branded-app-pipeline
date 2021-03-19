import React from 'react';
import { compose } from 'recompose';

import { withTranslation, WithTranslation } from 'react-i18next';
import { Theme, Typography, withStyles } from '@material-ui/core';
import PlaceIcon from '@material-ui/icons/Place';
import PersonIcon from '@material-ui/icons/Person';

import { MaterialStyleType } from '../../../utils/types';

import { Offer_FULL } from '../../offer/types';

type OwnProps = {
  offer: Offer_FULL;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class ActivitySummary extends React.PureComponent<Props> {
  render() {
    const { classes, offer } = this.props;

    if (
      !offer ||
      !offer.establishment ||
      !(offer.meta_activity && offer.meta_activity.id)
    ) {
      return null;
    }

    const { meta_activity } = offer;

    return (
      <div className={classes.container}>
        <div className={classes.imageContainer}>
          <img
            className={classes.image}
            alt={offer.meta_activity.name}
            src={offer.meta_activity.cover_main}
          />
        </div>

        <div className={classes.content}>
          <Typography variant="h6" color="textPrimary">
            {meta_activity.name}
          </Typography>
          <div className={classes.centerBottom}>
            <div className={classes.row}>
              <PlaceIcon className={classes.leftIcon} />
              <Typography variant="caption">
                {offer.establishment.title}
              </Typography>
            </div>
            <div className={classes.row}>
              <PersonIcon className={classes.leftIcon} />
              <Typography variant="caption">
                {offer.coach_override
                  ? offer.coach_override.user.name
                  : offer.coach.name}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  centerBottom: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    height: '100%',
  },
  row: {
    display: 'flex',
    alignItems: 'row',
    flexDirection: 'row',
  },
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      marginTop: theme.spacing(2),
      maxHeight: (300 * 9) / 16,
      overflow: 'hidden',
    },
    backgroundColor: 'white',
    borderRadius: 2,
  },
  imageContainer: {
    width: '100%',
    paddingTop: '56.25%',
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      paddingTop: 0,
      width: 300,
      height: (300 * 9) / 16,
    },
    backgroundColor: '#CCC',
    borderRadius: 2,
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 2,
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    marginLeft: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['booking', 'paymentPack']),
)(ActivitySummary);
