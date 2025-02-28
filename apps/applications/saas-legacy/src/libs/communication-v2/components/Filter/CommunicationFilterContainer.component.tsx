import React, { useCallback, useEffect, useState } from 'react';
import {
  Collapse,
  Typography,
  ButtonBase,
  makeStyles,
} from '@material-ui/core';
import { Tune } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import type { CommunicationListFilters } from '#src/libs/communication-v2/components/CommunicationDrawer.component';
import { getFilterOptionsOverride } from '#src/libs/communication-v2/utils';
import CommunicationFilterCollapse from '#src/libs/communication-v2/components/Filter/CommunicationFilterCollapse.component';
import FilterValuesContainer from '#src/libs/communication-v2/components/Filter/FilterValuesContainer.component';
import FilterCollapseIcon from '#src/libs/communication-v2/components/Filter/FilterCollapseIcon.component';
import { useCommunicationContext } from '#src/libs/communication-v2/context/CommunicationDrawer.context';
import {
  CommunicationFilterContextProvider,
  useCommunicationFilterContext,
} from '#src/libs/communication-v2/context/CommunicationFilter.context';

export type Props = {
  handleFilters: ({
    filters,
    dateStart,
    dateEnd,
  }: CommunicationListFilters) => void;
};

const CommunicationFilter: React.FC = () => {
  const {
    dateStart,
    dateEnd,
    communicationKinds,
    messagesOrigin,
    recipientsTypes,
    automatedMessages,
    messageChannels,
    periodHasChanged,
    previousFilters,
    filtersToSend,
    authorizedFilters,
    setDateStart,
    setDateEnd,
    setCommunicationKind,
    setMessageChannels,
    setRecipientsTypes,
    setMessagesOrigin,
    setAutomatedMessages,
    submitFilters,
  } = useCommunicationFilterContext();
  const {
    hasCommunicationKindsFilter,
    hasMessageChannelsFilter,
    hasDatesFilter,
    hasRecipientTypesFilter,
    hasAutomatedMessagesFilter,
    hasMessagesOriginFilter,
  } = authorizedFilters;
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const { communicationIdentifier } = useCommunicationContext();

  const { t } = useTranslation('communication');
  const classes = useStyles();

  const handleFiltersSubmit = useCallback(() => {
    setShowFilterModal(false);
    submitFilters();
  }, [submitFilters]);

  const onCollapseClick = () => {
    setShowFilterModal((current) => !current);
  };

  const hasSetSomeFilters =
    communicationKinds.length > 0 ||
    recipientsTypes.length > 0 ||
    messageChannels.length > 0 ||
    automatedMessages.length > 0 ||
    messagesOrigin.length > 0;

  const {
    communicationKindsOptionsOverride,
    recipientTypesOptionsOverride,
    messageChannelsOptionsOverride,
    automatedMessagesOptionsOverride,
    messagesOriginOptionsOverride,
  } = getFilterOptionsOverride(communicationIdentifier, t);

  useEffect(() => {
    if (
      !showFilterModal &&
      (filtersToSend?.filters !== previousFilters?.filters ||
        filtersToSend?.dateStart !== previousFilters?.dateStart ||
        filtersToSend?.dateEnd !== previousFilters?.dateEnd)
    ) {
      submitFilters();
    }
  }, [filtersToSend, previousFilters, showFilterModal, submitFilters]);

  return (
    <div className={classes.container}>
      <ButtonBase
        className={classes.filterDisplayer}
        disableRipple={hasSetSomeFilters || periodHasChanged}
        onClick={onCollapseClick}
      >
        <div className={classes.filterTitleContainer}>
          <Tune className={classes.filterIcon} />
          <Typography className={classes.filterTitle} variant="body1">
            {t('filter.filterAction')}
          </Typography>
        </div>
        {(hasSetSomeFilters || periodHasChanged) && !showFilterModal && (
          <FilterValuesContainer />
        )}
        <FilterCollapseIcon
          hasFilters={hasSetSomeFilters || periodHasChanged}
          showFilterModal={showFilterModal}
        />
      </ButtonBase>
      <Collapse in={showFilterModal}>
        <CommunicationFilterCollapse
          allPreviousFilter={previousFilters}
          automatedMessages={automatedMessages}
          automatedMessagesOptionsOverride={automatedMessagesOptionsOverride}
          communicationKinds={communicationKinds}
          communicationKindsOptionsOverride={communicationKindsOptionsOverride}
          dateEnd={dateEnd}
          dateStart={dateStart}
          handleFiltersSubmit={handleFiltersSubmit}
          hasAutomatedMessagesFilter={hasAutomatedMessagesFilter}
          hasCommunicationKindsFilter={hasCommunicationKindsFilter}
          hasDatesFilter={hasDatesFilter}
          hasMessageChannelsFilter={hasMessageChannelsFilter}
          hasMessagesOriginFilter={hasMessagesOriginFilter}
          hasRecipientTypesFilter={hasRecipientTypesFilter}
          messageChannels={messageChannels}
          messageChannelsOptionsOverride={messageChannelsOptionsOverride}
          messagesOrigin={messagesOrigin}
          messagesOriginOptionsOverride={messagesOriginOptionsOverride}
          recipientTypes={recipientsTypes}
          recipientTypesOptionsOverride={recipientTypesOptionsOverride}
          setAutomatedMessages={setAutomatedMessages}
          setCommunicationKind={setCommunicationKind}
          setDateEnd={setDateEnd}
          setDateStart={setDateStart}
          setMessageChannels={setMessageChannels}
          setMessagesOrigin={setMessagesOrigin}
          setRecipientTypes={setRecipientsTypes}
        />
      </Collapse>
    </div>
  );
};

export const CommunicationFilterContainer: React.FC<Props> = ({
  handleFilters,
}: Props) => {
  const { communicationIdentifier } = useCommunicationContext();
  return (
    <CommunicationFilterContextProvider
      communicationIdentifier={communicationIdentifier}
      onFilterUpdate={handleFilters}
    >
      <CommunicationFilter />
    </CommunicationFilterContextProvider>
  );
};

const useStyles = makeStyles((theme) => ({
  arrowIconRotation: {
    transform: 'rotate(180deg)',
  },
  container: {
    borderRadius: 0,
    borderBottom: 'solid 1px',
    borderBottomColor: theme.palette.divider,
    zIndex: 1000,
  },
  filterDisplayer: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      paddingBottom: theme.spacing(1.5),
      paddingTop: theme.spacing(1.5),
    },
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  filterIcon: {
    color: theme.palette.grey[600],
  },
  filterTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 'min-content',
  },
  filterTitle: {
    marginLeft: theme.spacing(2),
    color: theme.palette.grey[600],
  },
}));

export default React.memo(CommunicationFilterContainer);
