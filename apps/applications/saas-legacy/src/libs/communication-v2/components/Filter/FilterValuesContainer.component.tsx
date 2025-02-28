import React from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, Hidden, makeStyles } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import CommunicationFilterValuesGenericSummary from '#src/libs/communication-v2/components/Filter/CommunicationFilterValuesGenericSummary.component';
import CommunicationFilterValuesPeriodSummary from '#src/libs/communication-v2/components/Filter/CommunicationFilterValuesPeriodSummary.component';
import { useCommunicationFilterContext } from '#src/libs/communication-v2/context/CommunicationFilter.context';

const FilterValuesContainer: React.FC = () => {
  const {
    dateStart,
    dateEnd,
    communicationKinds,
    recipientsTypes,
    messageChannels,
    messagesOrigin,
    automatedMessages,
    periodHasChanged,
    countFilter,
    popCommunicationKindsValue,
    popMessageChannelsValue,
    popRecipientTypesValue,
    popAutomatedMessagesValue,
    popMessageOriginValue,
    resetPeriodFilters,
    resetFilters,
  } = useCommunicationFilterContext();
  const classes = useStyles();
  const { t } = useTranslation('communication');

  return (
    <div className={classes.filterValuesContainer}>
      <Hidden xsDown>
        {communicationKinds.length > 0 && (
          <CommunicationFilterValuesGenericSummary
            filterValues={communicationKinds}
            popFilterValue={popCommunicationKindsValue}
            title={t(`filter.kind.title`)}
          />
        )}
        {periodHasChanged && (
          <CommunicationFilterValuesPeriodSummary
            dateEnd={dateEnd}
            dateStart={dateStart}
            resetDates={resetPeriodFilters}
            title={t('filter.dateFilter.period')}
          />
        )}
        {messageChannels.length > 0 && (
          <CommunicationFilterValuesGenericSummary
            filterValues={messageChannels}
            popFilterValue={popMessageChannelsValue}
            title={t(`filter.channel.title`)}
          />
        )}
        {recipientsTypes.length > 0 && (
          <CommunicationFilterValuesGenericSummary
            filterValues={recipientsTypes}
            popFilterValue={popRecipientTypesValue}
            title={t(`filter.recipient.title`)}
          />
        )}
        {automatedMessages.length > 0 && (
          <CommunicationFilterValuesGenericSummary
            filterValues={automatedMessages}
            popFilterValue={popAutomatedMessagesValue}
            title={t(`filter.sendParameter.title`)}
          />
        )}
        {messagesOrigin.length > 0 && (
          <CommunicationFilterValuesGenericSummary
            filterValues={messagesOrigin}
            popFilterValue={popMessageOriginValue}
            title={t(`filter.srcOrDst.title`)}
          />
        )}
      </Hidden>
      <Hidden smUp>
        <Chip
          className={classes.chip}
          clickable={false}
          deleteIcon={<Close />}
          label={t('filter.numberFilter', { count: countFilter })}
          onDelete={resetFilters}
          size="small"
        />
      </Hidden>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  chip: {
    borderRadius: theme.spacing(0.5),
    marginRight: theme.spacing(1),
  },
  filterValuesContainer: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    borderLeft: 'solid 1px',
    borderLeftColor: theme.palette.grey[300],
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    height: '100%',
  },
}));

export default React.memo(FilterValuesContainer);
