// @flow

import React from 'react';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withNamespaces } from 'react-i18next';
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

export const TimeTable = (props: Props) => {
  const { loading, offers, t, classes } = props;
  return (
    <List disablePadding>
      {loading ? <LinearProgress /> : null}
      {offers.length === 0 && !loading ? (
        <Typography variant="caption" className={classes.emptyMessage}>
          {t('activity.noOfferThisDay')}
        </Typography>
      ) : null}
      <Divider />
      {offers.map((offer) => (
        <OfferMinimalSummary
          key={offer.id}
          offer={offer}
          showCoach
          noDate
          selected={props.selected === offer.id}
          overrideClickAction={() => {
            props.onOfferSelected(offer);
          }}
        />
      ))}
    </List>
  );
};

const styles = (theme) => ({
  emptyMessage: {
    padding: theme.spacing.unit * 3,
  },
  loadingContainer: {
    marginLeft: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(withNamespaces()(TimeTable));
