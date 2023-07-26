import React from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { Button, DialogActions, makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

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
// @ts-expect-error
import SmartListSelector from '#libs/smart-list/components/SmartListSelector.component';
import { getAllSmartList } from '#libs/smart-list/selectors';
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

import { fetchAllSmartLists as fetchAllSmartListsAction } from '#libs/smart-list/actions';
// @ts-ignore @ts-expect-error
import { getDayOffers } from '../planning/Planning.page';
import { useOfferHandler } from '#libs/communication-v2/hooks/useOfferHandler';
import { useSmartlistHandler } from '#libs/communication-v2/hooks/useSmartlistHandler';

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

  const [date, setDate, offerSelected, handleOfferSelected] = useOfferHandler({
    contextSelected,
    fetchAllOffers,
    offerFilters,
    fetchOffersByDayActionDisptach,
    fetchMetaActivityBulk,
    fetchCoachBulk,
    fetchEstablishmentBulk,
  });

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

  const handleSelectSmartlist = React.useCallback(
    () => onResourceSelected(smartlistSelected),
    [onResourceSelected, smartlistSelected],
  );

  const handleSelectOffer = React.useCallback(
    () => onResourceSelected(offerSelected),
    [onResourceSelected, offerSelected],
  );

  if (!props.open) return null;

  switch (props.contextSelected) {
    case ChatThreadKinds.Member:
      return (
        <MemberSearchModal
          asManager
          open
          country={props.companyCountry}
          disabled={processing}
          handlMemberSelected={onResourceSelected}
          loading={props.loading || processing}
          onClose={props.onClose}
          searchedMembers={props.searchedMembers}
          searchMembers={props.searchMembers}
        />
      );
    case ChatThreadKinds.Smartlist:
      return (
        <GenericResponsiveDialog open>
          <div className={classes.innerPadding}>
            <SmartListSelector
              onChange={handleSmartlistSelect}
              smartLists={props.smartlists}
              values={[smartlistSelected]}
            />
          </div>
          <DialogActions>
            <Button onClick={props.onClose}>{t('createThread.close')}</Button>
            <Button
              color="primary"
              disabled={!smartlistSelected}
              onClick={handleSelectSmartlist}
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
              showDayName
              // @ts-expect-error
              date={date}
              events={getDayOffers(props.events)}
              filters={offerFilters}
              // @ts-expect-error
              onDateChange={setDate}
              showCancelledOffers={false}
            />
            <TimeTable
              displayCoachInfoOnHover
              showTags
              virtualized
              companyTheme={theme}
              offers={props.offers}
              onOfferSelected={handleOfferSelected}
              selected={offerSelected}
            />
          </div>
          <DialogActions>
            <Button onClick={props.onClose}>{t('createThread.close')}</Button>
            <Button
              color="primary"
              disabled={!offerSelected}
              onClick={handleSelectOffer}
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
