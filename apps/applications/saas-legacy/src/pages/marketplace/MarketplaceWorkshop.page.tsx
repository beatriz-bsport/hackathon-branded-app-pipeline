import React, { useState, useEffect, useCallback } from 'react';
import memoize from 'lodash/memoize';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import { DateTime } from 'luxon';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { withRouter } from 'react-router';

import clsx from 'clsx';
import { isWidthDown } from '@material-ui/core';
import {
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
  resetEstablishments as resetEstablishmentsAction,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
  fetchEstablishments as fetchEstablishmentsAction,
} from '#src/libs/establishment/actions';

import {
  snackbarSuccess as snackbarSuccessAction,
  snackbarError as snackbarErrorAction,
} from '#src/libs/snackbar/actions';
import {
  fetchAssociatedCoachesList as fetchAssociatedCoachesListAction,
  fetchAdditionalAssociatedCoachesList as fetchAdditionalAssociatedCoachesListAction,
  resetCoaches,
} from '#src/libs/associated-coach/actions';
import { fetchWorkshopList as fetchWorkshopListAction } from '#src/libs/meta-activity/actions';
import { fetchGroupsOfferBulk as fetchGroupsOfferBulkAction } from '#src/libs/group-offer/actions';

import {
  getAllEstablishments,
  getAvailableEstablishmentList,
  getAssociatedEstablishmentGroup,
  withEstablishment as groupWithEstablishment,
  getEstablishmentById,
} from '#src/libs/establishment/selectors';
import {
  getCoachById,
  getAllCoaches,
} from '#src/libs/associated-coach/selectors';
import { getWorkshopsByAllIds } from '#src/libs/meta-activity/selectors';
import {
  getBookedOffers,
  getOffersListByMetaActivity as getOffersListByMetaActivitySelector,
} from '#src/libs/offer/selectors';
import {
  getGroupByIdCurried,
  getOffersListByGroup as getOffersListByGroupSelector,
} from '#src/libs/group-offer/selectors';
import MarketplaceFilters from '#src/libs/marketplace/components/@RessourceFilter/MarketplaceFilterCSSOnly';
import type {
  MarketplaceFilters as MarketplaceFiltersType,
  MarketplaceFiltersSetter,
} from '#src/libs/marketplace/types';
import themeSelectors from '#src/libs/theme/selectors';

import {
  fetchLevelList as fetchLevelListAction,
  resetLevels as resetLevelsAction,
} from '#src/libs/level/actions';
import {
  getActiveCustomLevels,
  getLevelsDetails,
} from '#src/libs/level/selectors';

import MarketplaceWorkshop from '#src/libs/marketplace/components/@Workshop/MarketplaceWorkshop.component';
import withTitle from '#src/hocs/with-title.hoc';
import {
  fetchMarketplaceOfferByMetaActivityList as fetchMarketplaceOfferByMetaActivityListAction,
  fetchOfferBulkBatched as fetchOfferBulkBatchedAction,
  resetMarketplaceOfferByMetaActivityList as resetMarketplaceOfferByMetaActivityListAction,
  fetchOfferRegisteredIds as fetchOfferRegisteredIdsAction,
} from '#src/libs/offer/actions';
// @ts-expect-error
import withReplaceQueryParams from '#src/hocs/with-replace-query-params.hoc';
// @ts-expect-error
import withQueryParams from '#src/hocs/with-query-params.hoc';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Offer } from '#src/libs/offer/types';
import { convertMarketplaceFilterForMetaActivityCall } from '#src/libs/meta-activity/utils';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { getBookWorkshopUrl } from '#src/libs/marketplace/routing-utils';
import withPostMessageOnPropsUpdate from '#src/hocs/postMessages/with-post-message-on-props-update';
import withPostMessageToUpdateProps from '#src/hocs/postMessages/with-post-message-to-update-props';
import {
  CalendarFilterValidationSchema,
  CalendarOnlineFilterValidationSchema,
} from '#src/libs/marketplace/utils';
import { useWidth } from '../../hooks/useWidth';
import { sortByDate } from '../../utils/datetime';
import { RootState } from '../../reducers';

import './MarketplaceWorkshop.css';

const BATCH_SIZE_FOR_META_ACTIVITY = 6;

export type OwnProps = {
  companyId: number;
  username: string;
  filters: MarketplaceFiltersType;
  setFilters: MarketplaceFiltersSetter;
  store: any;
  bookedOffers: number[];
  mapContainerClassName?: string;
  goToBook?: (offerId: number, companyId: number) => void;
  onlineFilter?: {
    is_online: boolean | undefined;
  };
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const MIN_DATE = DateTime.now().toISODate();

const MAX_DATE = DateTime.now()
  .endOf('month', { useLocaleWeeks: true })
  .plus({ year: 1, month: 1 })
  .toISODate();

const MarketplaceWorkshopPage: React.FC<Props> = ({
  filters,
  setFilters,
  onlineFilter,
  companyId,
  theme,
  workshopsLoading,
  coaches,
  offerDetailsloading,
  allEstablishments,
  workshops,
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
  fetchOfferBulkBatched,
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
          ...(typeof onlineFilter?.is_online === 'boolean'
            ? { is_online: onlineFilter.is_online }
            : {}),
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
                    fetchOfferBulkBatched(
                      groups.flatMap((group) => group.offers),
                    );
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
      fetchOfferBulkBatched,
      filters,
      theme,
      username,
      onlineFilter,
    ],
  );

  const metaActivityFilter = convertMarketplaceFilterForMetaActivityCall(
    companyId,
    filters,
    onlineFilter,
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
      // @ts-expect-error
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
      if (bookWidget) {
        // @ts-expect-error
        bookWidget(offer.id || offer, companyId);
        return;
      }

      pushRouter(getBookWorkshopUrl(offer, companyId));
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
      className={clsx('bs-workshop-page', {
        'bs-workshop-page--mobile': isMobile,
      })}
    >
      <MarketplaceFilters
        coachDisplay={theme?.coach_display}
        coaches={coaches}
        customLevels={customLevels}
        establishmentGroupList={establishmentGroupList}
        // @ts-expect-error
        establishments={allEstablishments}
        filters={filters}
        hideCoach={theme && theme.hideCoach}
        metaActivities={workshops}
        setFilters={setFilters}
        showMultiLocalization={theme.enable_multi_localization}
        variant="workshop"
      />
      <MarketplaceWorkshop
        bookedOffers={bookedOffers}
        getCoach={getCoach}
        getEstablishment={getEstablishment}
        getGroup={getGroup}
        // @ts-expect-error
        getLevel={getLevel}
        getOffersListByGroup={getOffersListByGroup}
        getOffersListByMetaActivity={getOffersListByMetaActivity}
        hasMoreToLoad={displayedWorkshops < compatibleWorkshops.length}
        hideCoach={theme && theme.hideCoach}
        metaActivities={[...compatibleWorkshops].slice(0, displayedWorkshops)}
        metaActivityloading={
          workshopsLoading || coachLoading || establishmentLoading
        }
        offerDetailsloading={offerDetailsloading}
        onBook={goToBook}
        onBookOption={goToBook}
        onEndReach={onFetchMore}
        onLoadMoreOffer={handleLoadMoreOffer}
        showOfferFilling={theme.show_offers_filling}
        showOfferGender={theme.show_booked_gender_offer}
        theme={theme}
      />
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    bookedOffers: getBookedOffers(state),
    workshopsLoading: state.metaActivity.loading,
    workshops: getWorkshopsByAllIds(state),
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
    fetchOfferBulkBatched: fetchOfferBulkBatchedAction,
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
    fetchAdditionalAssociatedCoachesList:
      fetchAdditionalAssociatedCoachesListAction,
    resetLevels: resetLevelsAction,
  },
);

export const MarketplaceWorkshopBase = compose<Props, OwnProps>(
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
    ['is_online'],
    'onlineFilter',
    'setOnlineFilter',
    'boolean',
  ]),
  withQueryParams([
    ['filtersOpen', 'date', 'onlyDay'],
    'otherParams',
    'setOtherParams',
  ]),
  withPostMessageOnPropsUpdate<Props>([
    { propName: 'filters', messageType: 'bsport:workshop:filter:update' },
    {
      propName: 'onlineFilter',
      messageType: 'bsport:calendar:filter:update',
    },
  ]),
  withPostMessageToUpdateProps<Props>([
    {
      propName: 'filters',
      messageType: 'bsport:workshop:filter:control',
      validationSchema: CalendarFilterValidationSchema,
    },
    {
      propName: 'onlineFilter',
      messageType: 'bsport:workshop:filter:control',
      validationSchema: CalendarOnlineFilterValidationSchema,
    },
  ]),
)(MarketplaceWorkshopBase);
