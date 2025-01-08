import React from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { useTranslation } from 'react-i18next';
import RefreshIcon from '@material-ui/icons/Refresh';
import Alert from '@material-ui/lab/Alert';

import { ChatThreadKinds } from '@bsport/common/master-data/communication-inbox.js';
import { AxiosResponse } from 'axios';
import type { CommunicationThread } from '#src/libs/communication-v2/types';
import { withGroup } from '#src/libs/group-offer/selectors';
import { withCustomLevel } from '#src/libs/level/selectors';
import { getTheme, getCompanyCountry } from '#src/libs/theme/selectors';
import { getSearchedMembers } from '#src/libs/member/selectors';
import {
  search as searchMembers,
  createOrUpdateMember,
} from '#src/libs/member/actions';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
// @ts-expect-error
import SmartListSelector from '#src/libs/smart-list/components/SmartListSelector.component';
import { getAllSmartList } from '#src/libs/smart-list/selectors';
// @ts-expect-error
import TimeTable from '#src/components/offer/TimeTable.component';
import Calendar from '#src/components/offer/Calendar.component';
import { MemberMap } from '#src/libs/member/utils';

import {
  fetchOffersByDay as fetchOffersByDayAction,
  fetchAllOffers as fetchAllOffersAction,
} from '#src/libs/offer/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#src/libs/meta-activity/actions';
import { fetchGroupsOfferList as fetchGroupsOfferListAction } from '#src/libs/group-offer/actions';

import { fetchCoachBulk as fetchCoachBulkAction } from '#src/libs/associated-coach/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '#src/libs/establishment/actions';

import {
  getManagerOffersFiltered,
  withMetaActivity,
  withCoach,
  withEstablishment,
  withGender,
  withTags,
} from '#src/libs/offer/selectors';

import { fetchAllSmartLists as fetchAllSmartListsAction } from '#src/libs/smart-list/actions';
import { useOfferHandler } from '#src/libs/communication-v2/hooks/useOfferHandler';
import { useSmartlistHandler } from '#src/libs/communication-v2/hooks/useSmartlistHandler';
import ThreadCreatorIconAction from '#src/libs/communication-v2/thread/commons/ThreadCreatorIconAction.component';
import MemberSearchDialog from '#src/libs/member/components/MemberSearchDialog';
import { MemberFormData, MemberMinimal } from '#src/libs/member/types';
// @ts-expect-error
import { getDayOffers } from '../planning/Planning.page';
// @ts-expect-error
import { mapFormData } from '../form.utils';
import { RootState } from '../../reducers';
import type { OptionCallback } from '../../state/types';

const connector = connect(
  (state: RootState) => ({
    companyCountry: getTheme(state).locale.split('_')[1],
    theme: getTheme(state),
    searchedMembers: getSearchedMembers(state),
    loading: state.member.search.loading,
    smartlists: getAllSmartList(state),
    smartlistLoading: state.smartList.loading,
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
    offerLoading: state.offer.loading || state.offer.byDay.loading,
  }),
  {
    handleSearchMembers: (
      text: string,
      params?: {
        [key: string]: string | number | boolean;
      },
      options?: OptionCallback<AxiosResponse<MemberMinimal[]>>,
    ) => searchMembers(text, params, options),
    createMemberAction: createOrUpdateMember,
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

export const InboxThreadCreator: React.FC<Props> = ({
  open,
  smartlistLoading,
  events,
  offers,
  smartlists,
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
  offerLoading,
  createMemberAction,
  handleSearchMembers,
}) => {
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

  const [isDisplayRefreshSmartlist, setIsDisplayRefreshSmartlist] =
    React.useState(false);
  const [, setProcessing] = React.useState(false);

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

  const handleDisplayRefreshSmartlist = React.useCallback(
    () => setIsDisplayRefreshSmartlist(true),
    [],
  );

  const handleHideRefreshSmartlist = React.useCallback(
    () => setIsDisplayRefreshSmartlist(false),
    [],
  );

  const handleRefreshSmartlist = React.useCallback(
    () => fetchAllSmartLists({ onSuccess: handleHideRefreshSmartlist }),
    [fetchAllSmartLists, handleHideRefreshSmartlist],
  );

  const createMember = React.useCallback(
    (data: MemberFormData, options: OptionCallback) => {
      const memberData = data;
      if (!memberData.birthday) delete memberData.birthday;

      const formData = mapFormData(memberData, MemberMap);
      createMemberAction(null, formData, options);
    },
    [createMemberAction],
  );

  if (!open) return null;

  switch (contextSelected) {
    case ChatThreadKinds.Member:
      return (
        <MemberSearchDialog
          isDisplayCancelButton
          open
          companyCountry={getCompanyCountry()}
          createMember={createMember}
          elementClasses={{
            submit: classes.submitButtonRadius,
            searchBarContainer: classes.alignItems,
            actionsContainer: classes.dialogActions,
            addMemberButton: classes.dialogActionContainer,
            addMemberIcon: classes.addMemberIcon,
          }}
          onClose={onClose}
          onMemberChoose={onResourceSelected}
          searchMembers={handleSearchMembers}
        />
      );
    case ChatThreadKinds.Smartlist:
      return (
        <GenericResponsiveDialog open maxWidth="sm">
          <DialogTitle>{t('createThread.title')}</DialogTitle>
          <DialogContent>
            <div className={classes.inputWithActionContainer}>
              <SmartListSelector
                noMulti
                helperText={t('createThread.smartlistPlaceholder')}
                onChange={handleSmartlistSelect}
                smartLists={smartlists}
                values={[smartlistSelected]}
              />
              <ThreadCreatorIconAction
                onNavigate={handleDisplayRefreshSmartlist}
                threadType={ChatThreadKinds.Smartlist}
              />
            </div>
            {isDisplayRefreshSmartlist && (
              <div className={classes.smartlistRefreshContainer}>
                <Button
                  disabled={smartlistLoading}
                  onClick={handleRefreshSmartlist}
                  startIcon={<RefreshIcon />}
                  variant="outlined"
                >
                  {t('common.refresh')}
                </Button>
                <Alert severity="info">
                  {t('createThread.refreshSmartlist')}
                </Alert>
              </div>
            )}
          </DialogContent>
          <DialogActions className={classes.dialogActions}>
            <Button onClick={onClose}>{t('createThread.close')}</Button>
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
              events={getDayOffers(events)}
              filters={offerFilters}
              loading={offerLoading}
              // @ts-expect-error
              onDateChange={setDate}
              showCancelledOffers={false}
            />
            <TimeTable
              displayCoachInfoOnHover
              showTags
              virtualized
              companyTheme={theme}
              loading={offerLoading}
              offers={offers}
              onOfferSelected={handleOfferSelected}
              selected={offerSelected}
            />
          </div>
          <DialogActions>
            <Button onClick={onClose}>{t('createThread.close')}</Button>
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

const useStyles = makeStyles((theme) => ({
  innerPadding: {
    padding: theme.spacing(2),
  },
  inputWithActionContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  smartlistRefreshContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  addMemberIcon: {
    width: 'auto',
    height: 'auto',
  },
  submitButtonRadius: {
    borderRadius: 4,
  },
  alignItems: {
    alignItems: 'center',
  },
  dialogActions: {
    borderTop: `solid ${theme.palette.grey['300']} 1px`,
  },
  dialogActionContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1.5),
    background: theme.palette.grey[200],
    border: 'none',
    cursor: 'pointer',
    color: theme.palette.common.black,
    '&:hover': {
      background: theme.palette.grey[200],
      color: theme.palette.common.black,
    },
    '&:focus': {
      color: theme.palette.common.black,
    },
  },
}));

export default connector(React.memo(InboxThreadCreator));
