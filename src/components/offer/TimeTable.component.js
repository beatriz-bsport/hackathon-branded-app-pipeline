// @flow
import React from 'react';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withTranslation, TFunction } from 'react-i18next';

import type { Offer } from '../../api/types';
import OfferMinimalSummary from './OfferMinimalSummary.component';
import VirtualizeListAutoSize from '#components/virtualize/VirtualListAutoSize.component';

type Props = {
  loading: boolean,
  offers: Array<Offer>,
  onOfferSelected: (offer: Offer) => void,
  onModifyTags?: (offer: Offer) => void,
  selected: number,
  classes: Object,
  t: TFunction,
  showTags: ?boolean,
  virtualized?: boolean,
  getHasPendingReplacementRequest: (offerId: number) => boolean,
};

export class TimeTable extends React.PureComponent<Props> {
  renderRow = (offer: Offer, withoutKey = false) => (
    <OfferMinimalSummary
      key={!withoutKey ? offer.id : null}
      offer={offer}
      showCoach
      noDate
      selected={this.props.selected === offer.id}
      overrideClickAction={() => {
        this.props.onOfferSelected(offer);
      }}
      onModifyTags={() => {
        this.props.onModifyTags(offer);
      }}
      showTags={this.props.showTags}
      fixedHeight={72}
      getHasPendingReplacementRequest={
        this.props.getHasPendingReplacementRequest
      }
    />
  );

  render() {
    const { loading, offers, t, classes, virtualized } = this.props;

    return (
      <div className={classes.container} disablePadding>
        {loading ? <LinearProgress /> : null}
        {offers.length === 0 && !loading ? (
          <div className={classes.emptyMessage}>
            <Typography variant="caption">
              {t('activity.noOfferThisDay')}
            </Typography>
          </div>
        ) : null}
        <Divider />
        {!loading && virtualized && (
          <VirtualizeListAutoSize
            itemCount={offers.length}
            itemSize={72}
            renderRow={(index) => {
              const offer = offers[index];
              const withoutKey = false;
              return this.renderRow(offer, withoutKey);
            }}
            minItemsDisplaid={6}
          />
        )}
        {!loading && !virtualized && offers.map(this.renderRow)}
      </div>
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
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
});

export default withStyles(styles)(withTranslation()(TimeTable));
