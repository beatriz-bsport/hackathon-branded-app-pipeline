// @flow
import React from 'react';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withTranslation, TFunction } from 'react-i18next';

import VirtualizeListAutoSize from '#components/virtualize/VirtualListAutoSize.component';

import ValidationRollCallButton from '#libs/offer/components/ValidationRollCallButton.component';
import ValidationRollCallText from '#libs/offer/components/ValidationRollCallText.component';

import type { Theme as CompanyTheme } from '#libs/theme/types';
import OfferMinimalSummary from './OfferMinimalSummary.component';
import type { Offer } from '../../api/types';
import ObjectLevelPermissionWrapper from '../../libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

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
  isRollCallMandatory?: boolean,
  openRollCallDrawer?: (index: number, offer: Offer) => void,
  openConfirmationRollCallDialog?: () => void,
  displayCoachInfoOnHover?: boolean,
  companyTheme: CompanyTheme,
};

export class TimeTable extends React.PureComponent<Props, State> {
  renderRow = (offer: Offer, index: number) => (
    <OfferMinimalSummary
      key={offer.id}
      noDate
      showCoach
      companyTheme={this.props.companyTheme}
      displayCoachInfoOnHover={this.props.displayCoachInfoOnHover}
      fixedHeight={72}
      getHasPendingReplacementRequest={
        this.props.getHasPendingReplacementRequest
      }
      isRollCallMandatory={!!this.props.isRollCallMandatory}
      offer={offer}
      onModifyTags={() => {
        this.props.onModifyTags(offer);
      }}
      openRollCallDrawer={() => {
        if (this.props.openRollCallDrawer)
          this.props.openRollCallDrawer(index, offer);
      }}
      overrideClickAction={() => {
        this.props.onOfferSelected(offer);
      }}
      selected={this.props.selected === offer.id}
      showTags={this.props.showTags}
    />
  );

  render() {
    const { loading, offers, t, classes, virtualized } = this.props;

    return (
      <div disablePadding className={classes.container}>
        {loading ? <LinearProgress /> : null}
        {offers.length === 0 && !loading ? (
          <div className={classes.emptyMessage}>
            <Typography variant="caption">
              {t('activity.noOfferThisDay')}
            </Typography>
          </div>
        ) : null}
        {loading ? null : <Divider />}
        {!loading && virtualized && (
          <VirtualizeListAutoSize
            itemCount={offers.length}
            itemSize={72}
            minItemsDisplaid={6}
            renderRow={(index) => {
              const offer = offers[index];
              return this.renderRow(offer, index);
            }}
          />
        )}
        {!loading && !virtualized && offers.map(this.renderRow)}
        {this.props.isRollCallMandatory && (
          <div className={classes.rollCallContainer}>
            <div className={classes.rollCallText}>
              <ValidationRollCallText
                isSeveralRollCallsPage
                nbRollCallsLeftToValidate={
                  offers.filter((offer) => offer.roll_call_needs_validation)
                    .length
                }
              />
            </div>
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission={[
                'reservation.activity.allowed_actions.rollcall',
                'reservation.workshop.allowed_actions.rollcall',
              ]}
            >
              <div className={classes.rollCallButton}>
                <ValidationRollCallButton
                  outlined
                  nbRollCallsLeftToValidate={
                    offers.filter((offer) => offer.roll_call_needs_validation)
                      .length
                  }
                  onClick={this.props.openConfirmationRollCallDialog}
                />
              </div>
            </ObjectLevelPermissionWrapper>
          </div>
        )}
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
    justifyContent: 'space-between',
    flex: 1,
  },

  rollCallContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rollCallButton: {
    margin: theme.spacing(2),
  },
  rollCallText: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
});

export default withStyles(styles)(withTranslation()(TimeTable));
