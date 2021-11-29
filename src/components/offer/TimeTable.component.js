// @flow

import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withTranslation, TFunction } from 'react-i18next';
import type { Offer } from '../../api/types';

import OfferMinimalSummary from './OfferMinimalSummary.component';

type Props = {
  loading: boolean,
  offers: Array<Offer>,
  onOfferSelected: (offer: Offer) => void,
  selected: number,
  classes: Object,
  t: TFunction,
};

export class TimeTable extends React.PureComponent<Props> {
  render() {
    const { loading, offers, t, classes } = this.props;
    return (
      <List disablePadding>
        {loading ? <LinearProgress /> : null}
        {offers.length === 0 && !loading ? (
          <div className={classes.emptyMessage}>
            <Typography variant="caption">
              {t('activity.noOfferThisDay')}
            </Typography>
          </div>
        ) : null}
        <Divider />
        {offers.map((offer) => (
          <OfferMinimalSummary
            key={offer.id}
            offer={offer}
            showCoach
            noDate
            selected={this.props.selected === offer.id}
            overrideClickAction={() => {
              this.props.onOfferSelected(offer);
            }}
          />
        ))}
      </List>
    );
  }
}

const styles = (theme) => ({
  emptyMessage: {
    padding: theme.spacing(3),
  },
  loadingContainer: {
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
});

export default withStyles(styles)(withTranslation()(TimeTable));
