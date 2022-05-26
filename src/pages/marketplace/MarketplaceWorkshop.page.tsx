import React, { useState, useEffect, useCallback } from 'react';
import memoize from 'lodash/memoize';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import Moment from 'moment-timezone';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { withRouter } from 'react-router';

import { makeStyles, Theme } from '@material-ui/core';

import {
  snackbarSuccess as snackbarSuccessAction,
  snackbarError as snackbarErrorAction,
} from '#libs/snackbar/actions';
import { fetchAssociatedCoachesList as fetchAssociatedCoachesListAction } from '#libs/associated-coach/actions';
import {
  fetchEstablishments as fetchEstablishmentsAction,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
} from '#libs/establishment/actions';
import { fetchWorkshopList as fetchWorkshopListAction } from '#libs/meta-activity/actions';
import { fetchGroupsOfferBulk as fetchGroupsOfferBulkAction } from '#libs/group-offer/actions';

import {
  getAllEstablishments,
  getAssociatedEstablishmentGroup,
  withEstablishment as groupWithEstablishment,
  getEstablishmentById,
} from '#libs/establishment/selectors';
import { getCoachById, getCoaches } from '#libs/associated-coach/selectors';
import { getOffersListByMetaActivity as getOffersListByMetaActivitySelector } from '#libs/offer/selectors';
import { getWorkshopsByAllIds } from '#libs/meta-activity/selectors';
import {
  getGroupByIdCurried,
  getOffersListByGroup as getOffersListByGroupSelector,
} from '#libs/group-offer/selectors';
import MarketplaceFilterComponent from '#libs/marketplace/components/MarketplaceFilter.component';
import { RootState } from '../../reducers';
import themeSelectors from '#libs/theme/selectors';

import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';
import { getActiveCustomLevels, getLevelById } from '#libs/level/selectors';

import MarketplaceWorkshop from '#libs/marketplace/components/MarketplaceWorkshop.component';
import Analytics from '#components/analytics/Analytics.component';
import { DATE_FORMAT } from '../../utils/datetime';
import withTitle from '#hocs/with-title.hoc';
import {
  fetchMarketplaceOfferByMetaActivityList as fetchMarketplaceOfferByMetaActivityListAction,
  fetchOfferBulk as fetchOfferBulkAction,
  resetMarketplaceOfferByMetaActivityList as resetMarketplaceOfferByMetaActivityListAction,
} from '#libs/offer/actions';
import withReplaceQueryParams from '#hocs/with-replace-query-params.hoc';
import withQueryParams from '#hocs/with-query-params.hoc';
import { MetaActivity } from '#libs/meta-activity/types';
import { Offer } from '#libs/offer/types';
import { buildUrlParams } from '../../http';
import { convertMarketplaceFilterForMetaActivityCall } from '#libs/meta-activity/utils';

const BATCH_SIZE_FOR_META_ACTIVITY = 6;

type OwnProps = {
  companyId: number;
};

type Props = OwnProps & ConnectedProps<typeof connector>;
const MIN_DATE = Moment().startOf('month').format(DATE_FORMAT);
const MAX_DATE = Moment()
  .endOf('month')
  .add(1, 'years')
  .add(1, 'months')
  .format(DATE_FORMAT);

const MarketplaceWorkshopPage: React.FC<Props> = ({
  filters,
  setFilters,
  companyId,
  theme,
  workshopsLoading,
  coaches,
  offerDetailsloading,
  establishments,
  workshops,
  establishmentGroupList,
  customLevels,
  getOffersListByMetaActivity,
  fetchEstablishments,
  fetchWorkshopList,
  fetchAssociatedCoachesList,
  fetchMarketplaceOfferByMetaActivityList,
  resetMarketplaceOfferByMetaActivityList,
  pushRouter,
  fetchLevelList,
  fetchAllEstablishmentGroup,
  getCoach,
  getEstablishment,
  getLevel,
  fetchGroupsOfferBulk,
  getGroup,
  getOffersListByGroup,
  fetchOfferBulk,
  coachLoading,
  establishmentLoading,
}) => {
  const classes = useStyles();

  const [displayedWorkshops, setDisplayedWorkshops] = useState(
    BATCH_SIZE_FOR_META_ACTIVITY,
  );

  // CDM
  useEffect(() => {
    fetchAllEstablishmentGroup(companyId);
    fetchLevelList({
      company: companyId,
    });
  }, [companyId, fetchAllEstablishmentGroup, fetchLevelList]);

  const fetchOfferByMetaActivity = useCallback(
    (id: number, page: number = 1) => {
      fetchMarketplaceOfferByMetaActivityList(
        id,
        {
          page,
          page_size: 5,
          min_date: MIN_DATE,
          max_date: MAX_DATE,
          with_unique_offer_by_group: true,
          ...filters,
          ...(theme && !theme.show_cancelled_offers_customer
            ? {
                available: true,
              }
            : {}),
        },
        {
          onSuccess: (offers) => {
            if (
              offers.results.map((o) => o.group).filter((o) => !!o).length > 0
            ) {
              fetchGroupsOfferBulk(
                offers.results.map((o) => o.group).filter((o) => !!o),
                {
                  onSuccess: (groups) => {
                    fetchOfferBulk(groups.flatMap((group) => group.offers));
                  },
                },
              );
            }
          },
        },
      );
    },
    [
      fetchGroupsOfferBulk,
      fetchMarketplaceOfferByMetaActivityList,
      fetchOfferBulk,
      filters,
      theme,
    ],
  );

  const metaActivityFilter = convertMarketplaceFilterForMetaActivityCall(
    companyId,
    filters,
  );

  useEffect(() => {
    resetMarketplaceOfferByMetaActivityList();
    fetchWorkshopList(metaActivityFilter, {
      onSuccess: async (_workshops: MetaActivity[]) => {
        _workshops
          .slice(0, displayedWorkshops)
          .map((m) => fetchOfferByMetaActivity(m.id));
      },
    });
    fetchEstablishments({
      company: companyId,
      disabled: false,
      page_size: null,
    });
    fetchAssociatedCoachesList({
      company: companyId,
      page_size: null,
      disabled: false,
    });
    // not including displayedWorkshops to not trigger unnecessary call
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    companyId,
    fetchAllEstablishmentGroup,
    fetchAssociatedCoachesList,
    fetchEstablishments,
    fetchMarketplaceOfferByMetaActivityList,
    fetchWorkshopList,
    resetMarketplaceOfferByMetaActivityList,
    fetchLevelList,
    filters,
    theme,
  ]);

  const goToBook = React.useCallback(
    (offer: Offer) => {
      Analytics.workshopClick(offer);
      pushRouter(
        `/customer/payment/offer/${offer.id}/${buildUrlParams({
          membership: companyId,
        })}`,
      );
    },
    [pushRouter, companyId],
  );

  const onFetchMore = () => {
    let newDisplaidMore = displayedWorkshops + BATCH_SIZE_FOR_META_ACTIVITY;

    if (newDisplaidMore === workshops.length) {
      return;
    }

    if (newDisplaidMore > workshops.length) {
      newDisplaidMore = workshops.length;
    }

    workshops
      .slice(displayedWorkshops, newDisplaidMore)
      .map((m) => fetchOfferByMetaActivity(m.id));

    setDisplayedWorkshops(newDisplaidMore);
  };

  const handleLoadMoreOffer = React.useCallback(
    (metaActivityId: number) => (page: number) => {
      fetchOfferByMetaActivity(metaActivityId, page);
    },
    [fetchOfferByMetaActivity],
  );

  return (
    <div className={classes.container}>
      <MarketplaceFilterComponent
        coaches={coaches}
        establishments={establishments}
        hideCoach={theme && theme.hideCoach}
        metaActivities={workshops}
        filters={filters}
        setFilters={setFilters}
        customLevels={customLevels}
        variant="workshop"
        establishmentGroupList={establishmentGroupList}
        showMultiLocalization={theme.enable_multi_localization}
      />
      <MarketplaceWorkshop
        metaActivities={workshops.slice(0, displayedWorkshops)}
        metaActivityloading={
          workshopsLoading || coachLoading || establishmentLoading
        }
        hasMoreToLoad={displayedWorkshops < workshops.length}
        hideCoach={theme && theme.hideCoach}
        getCoach={getCoach}
        getEstablishment={getEstablishment}
        getLevel={getLevel}
        getGroup={getGroup}
        getOffersListByGroup={getOffersListByGroup}
        offerDetailsloading={offerDetailsloading}
        onBook={goToBook}
        onBookOption={goToBook}
        onLoadMoreOffer={handleLoadMoreOffer}
        showOfferFilling={theme.show_offers_filling}
        getOffersListByMetaActivity={getOffersListByMetaActivity}
        onEndReach={onFetchMore}
        theme={theme}
      />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

const connector = connect(
  (state: RootState) => ({
    workshopsLoading: state.metaActivity.loading,
    workshops: getWorkshopsByAllIds(state),
    getCoach: getCoachById(state),
    getLevel: getLevelById(state),
    getEstablishment: getEstablishmentById(state),
    getGroup: getGroupByIdCurried(state),
    getOffersListByMetaActivity: memoize((id) =>
      getOffersListByMetaActivitySelector(state, id),
    ),
    getOffersListByGroup: memoize((id) =>
      getOffersListByGroupSelector(state, id),
    ),
    offerDetailsloading: state.metaActivity.loading || state.coach.loading,
    coaches: getCoaches(state),
    establishments: getAllEstablishments(state),
    theme: themeSelectors.getTheme(state),
    establishmentGroupList: groupWithEstablishment(
      getAssociatedEstablishmentGroup,
    )(state),
    customLevels: getActiveCustomLevels(state),
    establishmentLoading: state.establishment.loading,
    coachLoading: state.coach.loading,
  }),
  {
    fetchWorkshopList: fetchWorkshopListAction,
    fetchMarketplaceOfferByMetaActivityList:
      fetchMarketplaceOfferByMetaActivityListAction,
    resetMarketplaceOfferByMetaActivityList:
      resetMarketplaceOfferByMetaActivityListAction,

    fetchEstablishments: fetchEstablishmentsAction,
    fetchAssociatedCoachesList: fetchAssociatedCoachesListAction,
    fetchGroupsOfferBulk: fetchGroupsOfferBulkAction,
    fetchOfferBulk: fetchOfferBulkAction,
    snackbarSuccess: snackbarSuccessAction,
    snackbarError: snackbarErrorAction,
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
    fetchLevelList: fetchLevelListAction,
    pushRouter: push,
  },
);

// Used in the widget
export const MarketplaceWorkshopBase = compose<any, OwnProps>(
  withTranslation(['booking', 'titles']),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:marketplace.marketplaceWorkshop'),
  ),
  connector,
)(MarketplaceWorkshopPage);

// Used in marketplace
export default compose(
  withRouter,
  withReplaceQueryParams(
    [
      'f_coaches',
      'f_metaActivities',
      'f_levels',
      'f_establishments',
      'f_establishmentGroups',
    ],
    [
      'coaches',
      'activity__in',
      'levels',
      'establishments',
      'establishment_group__in',
    ],
  ),
  withQueryParams([
    [
      'coaches',
      'establishments',
      'activity__in',
      'levels',
      'establishment_group__in',
    ],
    'filters',
    'setFilters',
    'arrayNumber',
  ]),
  withQueryParams([
    ['filtersOpen', 'date', 'onlyDay'],
    'otherParams',
    'setOtherParams',
  ]),
)(MarketplaceWorkshopBase);
