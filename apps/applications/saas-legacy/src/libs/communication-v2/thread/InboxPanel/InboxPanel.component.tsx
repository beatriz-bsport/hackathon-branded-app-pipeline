import React, { memo, useCallback } from 'react';

import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import type { CallHistoryMethodAction } from 'connected-react-router';
import { Tooltip, alpha, makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';
import type { Member } from '#src/libs/member/types';
import type { Tag, TagGroup } from '#src/libs/tag/types';
import type { SmartList } from '#src/libs/smart-list/types';
import type { Coach } from '#src/libs/associated-coach/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { OffersGroup } from '#src/libs/group-offer/types';
import type { Level } from '#src/libs/level/types';

import type { Offer } from '#src/libs/offer/types';
import type { CommunicationThread } from '#src/libs/communication-v2/types';
import InboxThreadHeader from '#src/libs/communication-v2/thread/InboxThreadContainerHeader/InboxThreadHeader.component';
import InboxPanelMember from './InboxPanelMember/InboxPanelMember.component';
import InboxPanelSmartlist from './InboxPanelSmartlist/InboxPanelSmartlist.component';
import InboxPanelOffer from './InboxPanelOffer/InboxPanelOffer.component';

export type Props = {
  isPanelOpen?: boolean;
  setIsPanelOpen?: (isOpen: boolean) => void;
  thread: CommunicationThread;
  isLoadingThread: boolean;
  tags?: Tag<TagGroup>[];
  member?: Member;
  goToMemberPage?: (id: number) => CallHistoryMethodAction<[string, unknown?]>;
  unpaidInvoicesCount?: number;
  smartlist?: SmartList;
  memberInSmartlistCount?: number;
  filtersSmartlist?: number[];
  includedTagsForSmartlist?: Tag<TagGroup>[];
  excludedTagsForSmartlist?: Tag<TagGroup>[];
  goToSmartlistPage?: (
    id: number,
  ) => CallHistoryMethodAction<[string, unknown?]>;
  offer?: Offer<
    Coach,
    Establishment,
    number,
    number,
    number,
    OffersGroup,
    Level
  > & { customLevel: Level };
  goToOfferPage?: (id: number) => CallHistoryMethodAction<[string, unknown?]>;
  closeInboxPanel: (id: number) => CallHistoryMethodAction<[string, unknown?]>;
  showOfferGender: boolean;
};

const InboxPanel: React.FC<Props> = ({
  isPanelOpen,
  setIsPanelOpen,
  thread,
  isLoadingThread,
  tags,
  member,
  goToMemberPage,
  unpaidInvoicesCount,
  smartlist,
  memberInSmartlistCount,
  filtersSmartlist,
  includedTagsForSmartlist,
  excludedTagsForSmartlist,
  goToSmartlistPage,
  offer,
  goToOfferPage,
  closeInboxPanel,
  showOfferGender,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('communication');

  const handleClick = useCallback(() => {
    setIsPanelOpen(!isPanelOpen);
  }, [isPanelOpen, setIsPanelOpen]);

  const isLoading =
    isLoadingThread || (thread && !member && !offer && !smartlist);

  const isMobile = !isPanelOpen && !setIsPanelOpen;
  const panelClosedOnFullScreen = !isPanelOpen && !!setIsPanelOpen;

  return (
    <div
      className={classnames(classes.panelContainer, {
        [classes.openPanel]: isPanelOpen,
        [classes.closedPanel]: !isPanelOpen,
      })}
    >
      {panelClosedOnFullScreen ? (
        <div className={classes.infoIconPadding}>
          <Tooltip
            classes={{ tooltip: classes.tooltip }}
            title={t('thread.panel.openPanel')}
          >
            <IconButton onClick={handleClick}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className={classes.loadingContainer}>
              <CircularProgress />
            </div>
          ) : (
            <>
              {isMobile && (
                <InboxThreadHeader
                  closeInboxPanel={closeInboxPanel}
                  cover={thread?.cover}
                  hasBeenRead={thread?.last_communication_has_been_read}
                  id={thread?.id}
                  isDisabled={thread?.disabled}
                  isFavorite={thread?.favorite}
                  isMuted={thread?.muted}
                  relatedObjectKind={thread?.related_object_kind}
                  subtitle={thread?.subtitle}
                  title={thread?.title}
                />
              )}
              <div className={classnames({ [classes.openPanel]: isMobile })}>
                <div className={classes.panelHeader}>
                  <Typography variant="h6">
                    {t('thread.panel.header')}
                  </Typography>
                  {!isMobile && (
                    <Tooltip title={t('thread.panel.closePanel')}>
                      <IconButton onClick={handleClick}>
                        <KeyboardTabIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>

                {thread?.related_object_kind === ChatThreadKinds.Member && (
                  <InboxPanelMember
                    goToMemberPage={goToMemberPage}
                    member={member}
                    tags={tags}
                    unpaidInvoicesCount={unpaidInvoicesCount}
                  />
                )}
                {thread?.related_object_kind === ChatThreadKinds.Smartlist && (
                  <InboxPanelSmartlist
                    excludedTags={excludedTagsForSmartlist}
                    filters={filtersSmartlist}
                    goToSmartlistPage={goToSmartlistPage}
                    includedTags={includedTagsForSmartlist}
                    memberCount={memberInSmartlistCount}
                    smartlist={smartlist}
                  />
                )}
                {thread?.related_object_kind === ChatThreadKinds.Offer && (
                  <InboxPanelOffer
                    goToOfferPage={goToOfferPage}
                    offer={offer}
                    showOfferGender={showOfferGender}
                  />
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  panelContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    maxHeight: '100%',
    overflow: 'auto',
  },
  openPanel: {
    padding: theme.spacing(2),
  },
  closedPanel: {
    alignItems: 'center',
  },
  panelHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: alpha(theme.palette.common.black, 0.87),
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
  infoIconPadding: {
    paddingTop: theme.spacing(2),
  },
}));

export default memo(InboxPanel);
