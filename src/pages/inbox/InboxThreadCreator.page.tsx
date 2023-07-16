import React from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { Button, DialogActions, makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import omit from 'lodash/omit';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import type { CommunicationThread } from '#libs/communication-v2/types';
import { withGroup } from '#libs/group-offer/selectors';
import { withCustomLevel } from '#libs/level/selectors';
import MemberSearchModal from '#libs/member/components/MemberSearchModal.component';
import type { OptionCallback } from '../../state/types';
import { RootState } from '../../reducers';
import { getTheme } from '#libs/theme/selectors';
import { getSearchedMembers } from '#libs/member/selectors';
import { search as searchMembers } from '#libs/member/actions';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import SmartListSelector from '#libs/smart-list/components/SmartListSelector.component';
import { getAllSmartList } from '#libs/smart-list/selectors';
import type { OfferFilter, Offer } from '#libs/offer/types';
// @ts-ignore @ts-expect-error
import TimeTable from '#components/offer/TimeTable.component';
import Calendar from '#components/offer/Calendar.component';

import {
  fetchOffersByDay as fetchOffersByDayAction,
  fetchAllOffers as fetchAllOffersAction,
} from '#libs/offer/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#libs/meta-activity/actions';
import { fetchGroupsOfferList as fetchGroupsOfferListAction } from '#libs/group-offer/actions';

import { fetchCoachBulk as fetchCoachBulkAction } from '#libs/associated-coach/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '#libs/establishment/actions';

import {
  getManagerOffersFiltered,
  withMetaActivity,
  withCoach,
  withEstablishment,
  withGender,
  withTags,
} from '#libs/offer/selectors';

import type { SmartList } from '#libs/smart-list/types';
import { fetchAllSmartLists as fetchAllSmartListsAction } from '#libs/smart-list/actions';
// @ts-ignore @ts-expect-error
import { omit_list, getDayOffers } from '../planning/Planning.page';

const connector = connect(
  (state: RootState) => ({
    companyCountry: getTheme(state).locale.split('_')[1],
    theme: getTheme(state),
    searchedMembers: getSearchedMembers(state),
    loading: state.member.search.loading,
    smartlists: getAllSmartList(state),
    offerFilters: state.userPreference.calendarFilter,
    events: state.offer.calendar,
    offers: withTags(
      withMetaActivity(
        withCustomLevel(
          withEstablishment(
            withGroup(withCoach(withGender(getManagerOffersFiltered))),
          ),
        ),
      ),
    )(state),
  }),
  {
    searchMembers: (text: string) =>
      searchMembers(text, { hide_archived: true }),
    fetchAllSmartLists: fetchAllSmartListsAction,
    fetchAllOffers: fetchAllOffersAction,
    fetchOffersByDayActionDisptach: fetchOffersByDayAction,
    fetchMetaActivityBulk: fetchMetaActivityBulkAction,
    fetchCoachBulk: fetchCoachBulkAction,
    fetchEstablishmentBulk: fetchEstablishmentBulkAction,
    fetchGroupsOfferList: fetchGroupsOfferListAction,
  },
);

type OwnProps = {
  open: boolean;
  contextSelected: ChatThreadKinds;
  redirectToThread: (threadId: number) => void;
  onClose: () => void;
  getOrCreateThread: (
    context: ChatThreadKinds,
    resourceId: number,
    options: OptionCallback<CommunicationThread>,
  ) => void;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const useSmartlistHandler = (
  contextSelected: ChatThreadKinds,
  fetchAllSmartLists: () => void,
) => {
  const [smartlistSelected, setSmartlistSelected] =
    React.useState<number>(null);

  const handleSmartlistSelect = React.useCallback((smartlists: SmartList[]) => {
    setSmartlistSelected(smartlists[smartlists.length - 1].value);
  }, []);

  React.useEffect(() => {
    if (contextSelected === ChatThreadKinds.Smartlist) {
      fetchAllSmartLists();
    }
  }, [contextSelected, fetchAllSmartLists]);
  return [smartlistSelected, handleSmartlistSelect, fetchAllSmartLists];
};

const useOfferHandler = (
  contextSelected: ChatThreadKinds,
  fetchAllOffers: (
    params: { min_date: string; max_date: string } & OfferFilter,
  ) => void,
  offerFilters: OfferFilter,
  fetchOffersByDayActionDisptach: (
    params: any,
    options: OptionCallback<Offer[]>,
  ) => void,
  fetchMetaActivityBulk: (ids: number[]) => void,
  fetchCoachBulk: (ids: number[]) => void,
  fetchEstablishmentBulk: (ids: number[]) => void,
) => {
  const [date, setDate] = React.useState<string>(moment().format('YYYY-MM-DD'));

  const fetchRelevantOffers = React.useCallback(() => {
    fetchAllOffers({
      min_date: moment(date)
        .startOf('month')
        .startOf('week')
        .format('YYYY-MM-DD'),
      max_date: moment(date).endOf('month').endOf('week').format('YYYY-MM-DD'),
      ...omit(offerFilters || {}, omit_list(offerFilters, true)),
    });
  }, [fetchAllOffers, offerFilters, date]);

  const fetchOffersByDay = React.useCallback(() => {
    const momentDate = moment(date);
    fetchOffersByDayActionDisptach(
      {
        year: momentDate.year(),
        month: momentDate.month() + 1,
        day: momentDate.date(),
        ...omit(offerFilters || {}, omit_list(offerFilters, false)),
      },
      {
        onSuccess: (offers) => {
          fetchMetaActivityBulk(offers.map((o) => o.meta_activity));
          fetchCoachBulk([
            ...offers.map((o) => o.coach),
            ...offers.map((o) => o.coach_override),
          ]);
          fetchEstablishmentBulk([...offers.map((o) => o.establishment)]);
        },
      },
    );
  }, [
    fetchCoachBulk,
    fetchEstablishmentBulk,
    fetchMetaActivityBulk,
    fetchOffersByDayActionDisptach,
    date,
    offerFilters,
  ]);

  React.useEffect(() => {
    if (contextSelected === ChatThreadKinds.Offer) {
      fetchRelevantOffers();
      fetchOffersByDay();
    }
  }, [contextSelected, fetchRelevantOffers, fetchOffersByDay]);

  const [offerSelected, setOfferSelected] = React.useState<number>(null);
  const handleOfferSelected = React.useCallback(
    (offer: Offer) => setOfferSelected(offer.id),
    [setOfferSelected],
  );
  return [date, setDate, offerSelected, handleOfferSelected];
};

export const InboxThreadCreator = (props: Props) => {
  const {
    redirectToThread,
    getOrCreateThread,
    contextSelected,
    onClose,
    fetchAllOffers,
    offerFilters,
    fetchAllSmartLists,
    theme,
    fetchOffersByDayActionDisptach,
    fetchCoachBulk,
    fetchMetaActivityBulk,
    fetchEstablishmentBulk,
  } = props;

  const [smartlistSelected, handleSmartlistSelect] = useSmartlistHandler(
    contextSelected,
    fetchAllSmartLists,
  );

  const [date, setDate, offerSelected, handleOfferSelected] = useOfferHandler(
    contextSelected,
    fetchAllOffers,
    offerFilters,
    fetchOffersByDayActionDisptach,
    fetchMetaActivityBulk,
    fetchCoachBulk,
    fetchEstablishmentBulk,
  );

  const { t } = useTranslation(['communication']);
  const classes = useStyles();

  const [processing, setProcessing] = React.useState(false);

  const onResourceSelected = React.useCallback(
    (resourceId) => {
      setProcessing(true);
      getOrCreateThread(contextSelected, resourceId, {
        onSuccess: (thread: CommunicationThread) => {
          if (thread) redirectToThread(thread.id);
          onClose();
          setProcessing(false);
        },
        onError: () => setProcessing(false),
      });
    },
    [getOrCreateThread, redirectToThread, contextSelected, onClose],
  );

  if (!props.open) return null;

  switch (props.contextSelected) {
    case ChatThreadKinds.Member:
      return (
        <MemberSearchModal
          open
          asManager
          loading={props.loading || processing}
          disabled={processing}
          searchMembers={props.searchMembers}
          searchedMembers={props.searchedMembers}
          onClose={props.onClose}
          handlMemberSelected={onResourceSelected}
          country={props.companyCountry}
        />
      );
    case ChatThreadKinds.Smartlist:
      return (
        <GenericResponsiveDialog open>
          <div className={classes.innerPadding}>
            <SmartListSelector
              smartLists={props.smartlists}
              onChange={handleSmartlistSelect}
              values={[smartlistSelected]}
            />
          </div>
          <DialogActions>
            <Button onClick={props.onClose}>{t('createThread.close')}</Button>
            <Button
              color="primary"
              disabled={!smartlistSelected}
              onClick={() => onResourceSelected(smartlistSelected)}
            >
              {t('createThread.confirmResourceSelected')}
            </Button>
          </DialogActions>
        </GenericResponsiveDialog>
      );
    case ChatThreadKinds.Offer:
      return (
        <GenericResponsiveDialog open>
          <div className={classes.innerPadding}>
            <Calendar
              events={getDayOffers(props.events)}
              onDateChange={setDate}
              date={date}
              filters={offerFilters}
              showCancelledOffers={false}
              showDayName
            />
            <TimeTable
              onOfferSelected={handleOfferSelected}
              offers={props.offers}
              selected={offerSelected}
              showTags
              virtualized
              companyTheme={theme}
              displayCoachInfoOnHover
            />
          </div>
          <DialogActions>
            <Button onClick={props.onClose}>{t('createThread.close')}</Button>
            <Button
              color="primary"
              disabled={!offerSelected}
              onClick={() => onResourceSelected(offerSelected)}
            >
              {t('createThread.confirmResourceSelected')}
            </Button>
          </DialogActions>
        </GenericResponsiveDialog>
      );
    default:
      return null;
  }
};

const useStyles = makeStyles((theme: Theme) => ({
  innerPadding: {
    padding: theme.spacing(2),
  },
}));

export default connector(InboxThreadCreator);
