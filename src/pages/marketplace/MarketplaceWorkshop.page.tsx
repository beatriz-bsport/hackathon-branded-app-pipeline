import React, { useState, useEffect, useCallback } from 'react';
import memoize from 'lodash/memoize';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import Moment from 'moment-timezone';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { withRouter } from 'react-router';

import classNames from 'classnames';
import { isWidthDown } from '@material-ui/core';
import {
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
  resetEstablishments as resetEstablishmentsAction,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
  fetchEstablishments as fetchEstablishmentsAction,
} from '#libs/establishment/actions';

import {
  snackbarSuccess as snackbarSuccessAction,
  snackbarError as snackbarErrorAction,
} from '#libs/snackbar/actions';
import {
  fetchAssociatedCoachesList as fetchAssociatedCoachesListAction,
  resetCoaches,
} from '#libs/associated-coach/actions';
import { fetchWorkshopList as fetchWorkshopListAction } from '#libs/meta-activity/actions';
import { fetchGroupsOfferBulk as fetchGroupsOfferBulkAction } from '#libs/group-offer/actions';

import {
  getAllEstablishments,
  getAvailableEstablishmentList,
  getAssociatedEstablishmentGroup,
  withEstablishment as groupWithEstablishment,
  getEstablishmentById,
} from '#libs/establishment/selectors';
import { getCoachById, getAllCoaches } from '#libs/associated-coach/selectors';
import {
  getWorkshopsByAllIds,
  getWorkshops,
} from '#libs/meta-activity/selectors';
import {
  getBookedOffers,
  getOffersListByMetaActivity as getOffersListByMetaActivitySelector,
} from '#libs/offer/selectors';
import {
  getGroupByIdCurried,
  getOffersListByGroup as getOffersListByGroupSelector,
} from '#libs/group-offer/selectors';
import MarketplaceFilters from '#libs/marketplace/components/MarketplaceFilterCSSOnly';
import { RootState } from '../../reducers';
import themeSelectors from '#libs/theme/selectors';

import {
  fetchLevelList as fetchLevelListAction,
  resetLevels as resetLevelsAction,
} from '#libs/level/actions';
import { getActiveCustomLevels, getLevelsDetails } from '#libs/level/selectors';

import MarketplaceWorkshop from '#libs/marketplace/components/MarketplaceWorkshop.component';
import Analytics from '#components/analytics/Analytics.component';
import { DATE_FORMAT, sortByDate } from '../../utils/datetime';
import withTitle from '#hocs/with-title.hoc';
import {
  fetchMarketplaceOfferByMetaActivityList as fetchMarketplaceOfferByMetaActivityListAction,
  fetchOfferBulk as fetchOfferBulkAction,
  resetMarketplaceOfferByMetaActivityList as resetMarketplaceOfferByMetaActivityListAction,
  fetchOfferRegisteredIds as fetchOfferRegisteredIdsAction,
} from '#libs/offer/actions';
import withReplaceQueryParams from '#hocs/with-replace-query-params.hoc';
import withQueryParams from '#hocs/with-query-params.hoc';
import { MetaActivity } from '#libs/meta-activity/types';
import { Offer } from '#libs/offer/types';
import { buildUrlParams } from '../../http';
import { convertMarketplaceFilterForMetaActivityCall } from '#libs/meta-activity/utils';
import { useWidth } from '../../hooks/useWidth';

import './MarketplaceWorkshop.css';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

const BATCH_SIZE_FOR_META_ACTIVITY = 6;

type OwnProps = {
  companyId: number;
  username: string;
  goToBook?: (offerId: number, companyId: number) => void;
};

type Props = OwnProps & ConnectedProps<typeof connector>;
const MIN_DATE = Moment().format(DATE_FORMAT);
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
  allEstablishments,
  workshops,
  allWorkshops,
  establishmentGroupList,
  customLevels,
  getOffersListByMetaActivity,
  authenticated,
  // username is necessary in order to retrieve user
  // specific information without relying on auth tokens
  username,
  bookedOffers,
  fetchEstablishments,
  fetchWorkshopList,
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
  goToBook: bookWidget,
  fetchOfferRegisteredIds,
  fetchAssociatedCoachesList,
  resetEstablishments,
  resetLevels,
}) => {
  const [displayedWorkshops, setDisplayedWorkshops] = useState(
    BATCH_SIZE_FOR_META_ACTIVITY,
  );

  const getCompatibleWorkshops = useCallback(
    (workshops_to_filter: MetaActivity[]) => {
      return sortByDate(
        [...workshops_to_filter].filter((w) => w.next_slot),
        'next_slot',
      );
    },
    [],
  );

  const compatibleWorkshops = getCompatibleWorkshops(workshops);
  const allCompatibleWorkshops = getCompatibleWorkshops(allWorkshops);

  // CDM
  useEffect(() => {
    fetchAllEstablishmentGroup(companyId);
  }, [companyId, fetchAllEstablishmentGroup]);

  useEffect(() => {
    if (authenticated) {
      fetchOfferRegisteredIds();
    }
  }, [authenticated, fetchOfferRegisteredIds]);

  const fetchOfferByMetaActivity = useCallback(
    (id: number, page: number = 1) => {
      fetchMarketplaceOfferByMetaActivityList(
        id,
        {
          page,
          page_size: 5,
          min_date: MIN_DATE,
          max_date: MAX_DATE,
          ...(username ? { username: encodeURI(username) } : {}),
          company: companyId,
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
      companyId,
      fetchGroupsOfferBulk,
      fetchMarketplaceOfferByMetaActivityList,
      fetchOfferBulk,
      filters,
      theme,
      username,
    ],
  );

  const metaActivityFilter = convertMarketplaceFilterForMetaActivityCall(
    companyId,
    filters,
  );

  useEffect(() => {
    resetMarketplaceOfferByMetaActivityList();
    resetEstablishments();
    resetCoaches();
    resetLevels();
  }, [
    resetEstablishments,
    resetLevels,
    resetMarketplaceOfferByMetaActivityList,
  ]);

  useEffect(() => {
    fetchWorkshopList(metaActivityFilter, {
      onSuccess: async (_workshops: MetaActivity[]) => {
        getCompatibleWorkshops(_workshops)
          .slice(0, displayedWorkshops)
          .map((m) => fetchOfferByMetaActivity(m.id));
      },
    });

    fetchAssociatedCoachesList({
      company: companyId,
      page_size: null,
      disabled: false,
      with_workshop: true,
    });
    fetchEstablishments({
      company: companyId,
      disabled: false,
      page_size: null,
      with_workshop: true,
    });
    fetchLevelList({
      company: companyId,
      is_active: true,
      with_workshop: true,
    });

    // not including displayedWorkshops to not trigger unnecessary call
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    companyId,
    fetchWorkshopList,
    fetchEstablishments,
    fetchAssociatedCoachesList,
    filters,
    theme,
    username,
  ]);

  const goToBook = React.useCallback(
    (offer: Offer) => {
      Analytics.workshopClick(offer);
      if (bookWidget) {
        bookWidget(offer.id || offer, companyId);
        return;
      }

      pushRouter(
        `/customer/payment/offer/${offer.id || offer}/${buildUrlParams({
          membership: companyId,
          fromWorkshop: true,
        })}`,
      );
    },
    [pushRouter, bookWidget, companyId],
  );

  const onFetchMore = () => {
    if (displayedWorkshops === compatibleWorkshops.length) {
      return;
    }

    let newDisplaidMore = displayedWorkshops + BATCH_SIZE_FOR_META_ACTIVITY;

    if (newDisplaidMore > compatibleWorkshops.length) {
      newDisplaidMore = compatibleWorkshops.length;
    }

    compatibleWorkshops
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
  const width = useWidth();
  const isMobile = isWidthDown('md', width);

  return (
    <div
      className={classNames('bs-workshop-page', {
        'bs-workshop-page--mobile': isMobile,
      })}
    >
      <MarketplaceFilters
        coaches={coaches}
        establishments={allEstablishments}
        hideCoach={theme && theme.hideCoach}
        metaActivities={allCompatibleWorkshops}
        filters={filters}
        setFilters={setFilters}
        customLevels={customLevels}
        variant="workshop"
        establishmentGroupList={establishmentGroupList}
        showMultiLocalization={theme.enable_multi_localization}
      />
      <MarketplaceWorkshop
        metaActivities={[...compatibleWorkshops].slice(0, displayedWorkshops)}
        metaActivityloading={
          workshopsLoading || coachLoading || establishmentLoading
        }
        hasMoreToLoad={displayedWorkshops < compatibleWorkshops.length}
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
        showOfferGender={theme.show_booked_gender_offer}
        getOffersListByMetaActivity={getOffersListByMetaActivity}
        onEndReach={onFetchMore}
        theme={theme}
        bookedOffers={bookedOffers}
      />
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    workshopsLoading: state.metaActivity.loading,
    workshops: getWorkshopsByAllIds(state),
    allWorkshops: getWorkshops(state),
    getCoach: getCoachById(state),
    getLevel: getLevelsDetails(state),
    getEstablishment: getEstablishmentById(state),
    getGroup: getGroupByIdCurried(state),
    getOffersListByMetaActivity: memoize((id) =>
      getOffersListByMetaActivitySelector(state, id),
    ),
    getOffersListByGroup: memoize((id) =>
      getOffersListByGroupSelector(state, id),
    ),
    offerDetailsloading: state.metaActivity.loading || state.coach.loading,
    coaches: getAllCoaches(state),
    establishments: getAvailableEstablishmentList(state),
    allEstablishments: getAllEstablishments(state),
    theme: themeSelectors.getTheme(state),
    establishmentGroupList: groupWithEstablishment(
      getAssociatedEstablishmentGroup,
    )(state),
    customLevels: getActiveCustomLevels(state),
    establishmentLoading: state.establishment.loading,
    coachLoading: state.coach.loading,
    authenticated: state.auth.authenticated,
  }),
  {
    fetchWorkshopList: fetchWorkshopListAction,
    fetchMarketplaceOfferByMetaActivityList:
      fetchMarketplaceOfferByMetaActivityListAction,
    resetMarketplaceOfferByMetaActivityList:
      resetMarketplaceOfferByMetaActivityListAction,

    fetchGroupsOfferBulk: fetchGroupsOfferBulkAction,
    fetchOfferBulk: fetchOfferBulkAction,
    snackbarSuccess: snackbarSuccessAction,
    snackbarError: snackbarErrorAction,
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
    fetchLevelList: fetchLevelListAction,
    fetchOfferRegisteredIds: fetchOfferRegisteredIdsAction,
    pushRouter: push,
    fetchEstablishmentBulk: fetchEstablishmentBulkAction,
    fetchEstablishments: fetchEstablishmentsAction,
    resetEstablishments: resetEstablishmentsAction,
    fetchAssociatedCoachesList: fetchAssociatedCoachesListAction,
    resetLevels: resetLevelsAction,
  },
);

// Used in the widget
export const MarketplaceWorkshopBase = compose<any, OwnProps>(
  marketplaceCssHoc(),
  withTranslation(['booking', 'titles']),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:marketplace.marketplaceWorkshop'),
  ),
  connector,
)(MarketplaceWorkshopPage);

// Used in marketplace
export default compose(
  marketplaceCssHoc(),
  withRouter,
  // avoid conflict with widget
  connect((state: RootState) => ({
    bookedOffers: getBookedOffers(state),
  })),

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
