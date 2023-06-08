import React, { memo, useCallback, useState } from 'react';

import { Collapse, IconButton, makeStyles } from '@material-ui/core';
import { Moment as MomentType } from 'moment-timezone';

import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import InboxThreadHeader from '#libs/communication-v2/thread/InboxThreadContainerHeader/InboxThreadHeader.component';
import CommunicationFilterCollapse from '#libs/communication-v2/components/Filter/CommunicationFilterCollapse.component';
import { SelectFieldItem } from '#libs/communication-v2/types';
import { OptionCallback } from '../../../../state/types';

export type Props = {
  id: number;
  cover: string;
  title: string;
  subtitle?: string;
  isFavorite: boolean;
  isMuted: boolean;
  hasBeenRead: boolean;
  isDisabled: boolean;
  relatedObjectKind: ChatThreadKinds;

  switchFavoriteStatus: (id: number, options?: OptionCallback) => void;
  switchMutedStatus: (id: number, options?: OptionCallback) => void;
  switchDisabledStatus: (id: number, options?: OptionCallback) => void;
  flagAsUnread: (id: number, options?: OptionCallback) => void;
  goToDetailPage: () => void;
  goToThreadListPage: () => void;

  hasKindFilter?: boolean;
  hasRecipientFilter?: boolean;
  hasChannelFilter?: boolean;
  hasSendParameterFilter?: boolean;
  hasSrcOrDstFilter?: boolean;
  hasDatesFilter?: boolean;

  kindFilterValues?: SelectFieldItem[];
  kindFilterSetter?: (args: SelectFieldItem[]) => void;

  recipientFilterValues?: SelectFieldItem[];
  recipientFilterSetter?: (args: SelectFieldItem[]) => void;

  sendParameterFilterValues?: SelectFieldItem[];
  sendParameterFilterSetter?: (args: SelectFieldItem[]) => void;

  srcOrDstFilterValues?: SelectFieldItem[];
  srcOrDstFilterSetter?: (args: SelectFieldItem[]) => void;

  dateStartValue?: MomentType;
  dateStartSetter?: (newDate: MomentType) => void;
  dateEndValue?: MomentType;
  dateEndSetter?: (newDate: MomentType) => void;
  periodHasChanged?: boolean;

  handleFiltersSubmit: () => void;
  allPreviousFilter: {
    filters: number[];
    dateStart: number;
    dateEnd: number;
  };
};

const InboxThreadContainerHeader: React.FC<Props> = (props: Props) => {
  const classes = useStyles();

  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const hideCollapse = useCallback(() => {
    setIsCollapseOpen(false);
  }, []);

  return (
    <>
      <InboxThreadHeader
        id={props.id}
        title={props.title}
        cover={props.cover}
        subtitle={props.subtitle}
        isFavorite={props.isFavorite}
        isMuted={props.isMuted}
        hasBeenRead={props.hasBeenRead}
        isDisabled={props.isDisabled}
        relatedObjectKind={props.relatedObjectKind}
        isCollapseOpen={isCollapseOpen}
        setIsCollapseOpen={setIsCollapseOpen}
        switchFavoriteStatus={props.switchFavoriteStatus}
        switchMutedStatus={props.switchMutedStatus}
        switchDisabledStatus={props.switchDisabledStatus}
        flagAsUnread={props.flagAsUnread}
        goToDetailPage={props.goToDetailPage}
        goToThreadListPage={props.goToThreadListPage}
      />
      <Collapse in={isCollapseOpen}>
        <CommunicationFilterCollapse
          hasKindFilter={props.hasKindFilter}
          kindFilterValues={props.kindFilterValues}
          kindFilterSetter={props.kindFilterSetter}
          hasRecipientFilter={props.hasRecipientFilter}
          recipientFilterValues={props.recipientFilterValues}
          recipientFilterSetter={props.recipientFilterSetter}
          hasSendParameterFilter={props.hasSendParameterFilter}
          sendParameterFilterValues={props.sendParameterFilterValues}
          sendParameterFilterSetter={props.sendParameterFilterSetter}
          hasSrcOrDstFilter={props.hasSrcOrDstFilter}
          srcOrDstFilterValues={props.srcOrDstFilterValues}
          srcOrDstFilterSetter={props.srcOrDstFilterSetter}
          hasDatesFilter={props.hasDatesFilter}
          dateStartValue={props.dateStartValue}
          dateStartSetter={props.dateStartSetter}
          dateEndValue={props.dateEndValue}
          dateEndSetter={props.dateEndSetter}
          periodHasChanged={props.periodHasChanged}
          handleFiltersSubmit={props.handleFiltersSubmit}
          allPreviousFilter={props.allPreviousFilter}
        />
        <IconButton className={classes.iconButton} onClick={hideCollapse}>
          <ExpandLessIcon fontSize="large" />
        </IconButton>
      </Collapse>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  iconButton: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      position: 'relative',
      bottom: 60,
      left: 10,
    },
  },
}));

export default memo(InboxThreadContainerHeader);
