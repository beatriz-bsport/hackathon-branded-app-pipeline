import React, { useCallback, useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import {
  Collapse,
  Typography,
  ButtonBase,
  IconButton,
  Hidden,
  Chip,
  makeStyles,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { Tune, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import type { SelectFieldItem } from '#src/libs/communication-v2/types';
import {
  getFiltersToEnable,
  getFilterOptionsOverride,
} from '#src/libs/communication-v2/utils';
import CommunicationFilterCollapse from '#src/libs/communication-v2/components/Filter/CommunicationFilterCollapse.component';
import CommunicationFilterValuesGenericSummary from '#src/libs/communication-v2/components/Filter/CommunicationFilterValuesGenericSummary.component';
import CommunicationFilterValuesPeriodSummary from '#src/libs/communication-v2/components/Filter/CommunicationFilterValuesPeriodSummary.component';

export type Props = {
  contextIdentifier: number;
  handleFilters: ({
    filters,
    dateStart,
    dateEnd,
  }: {
    filters: number[];
    dateStart: number;
    dateEnd: number;
  }) => void;
};

export const CommunicationFilterContainer: React.FC<Props> = ({
  contextIdentifier,
  handleFilters,
}: Props) => {
  const [dateStart, setDateStart] = useState<DateTime | null>(null);
  const [dateEnd, setDateEnd] = useState<DateTime | null>(null);
  const [kindFilterValues, setKindFilterValues] = useState<SelectFieldItem[]>(
    [],
  );
  const [recipientFilterValues, setRecipientFilterValues] = useState<
    SelectFieldItem[]
  >([]);
  const [channelFilterValues, setChannelFilterValues] = useState<
    SelectFieldItem[]
  >([]);
  const [sendParameterFilterValues, setSendParameterFilterValues] = useState<
    SelectFieldItem[]
  >([]);
  const [srcOrDstFilterValues, setSrcOrDstFilterValues] = useState<
    SelectFieldItem[]
  >([]);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [allPreviousFilters, setAllPreviousFilters] = useState<{
    filters: number[];
    dateStart: number | null;
    dateEnd: number | null;
  }>({ filters: [], dateStart: null, dateEnd: null });
  const [shouldSubmitFilters, setShouldSubmitFilters] = useState(false);
  const { t } = useTranslation('communication');
  const classes = useStyles();

  const popFilterValue = ({
    index,
    setFilter,
  }: {
    setFilter: React.Dispatch<React.SetStateAction<SelectFieldItem[]>>;
    index: number;
  }) => {
    setFilter((prevValues) => {
      const newFilterValues = [...prevValues];
      newFilterValues.splice(index, 1);
      return newFilterValues;
    });
    setShouldSubmitFilters(true);
  };

  const handleFiltersSubmit = useCallback(() => {
    const filtersIdentifiers: number[] = [];
    const {
      hasKindFilter,
      hasChannelFilter,
      hasRecipientFilter,
      hasSendParameterFilter,
      hasSrcOrDstFilter,
    } = getFiltersToEnable(contextIdentifier);

    if (hasKindFilter && kindFilterValues.length > 0) {
      kindFilterValues.forEach((item) => filtersIdentifiers.push(item.value));
    }
    if (hasRecipientFilter && recipientFilterValues.length > 0) {
      recipientFilterValues.forEach((item) =>
        filtersIdentifiers.push(item.value),
      );
    }
    if (hasChannelFilter && channelFilterValues.length > 0) {
      channelFilterValues.forEach((item) =>
        filtersIdentifiers.push(item.value),
      );
    }
    if (hasSendParameterFilter && sendParameterFilterValues.length > 0) {
      sendParameterFilterValues.forEach((item) =>
        filtersIdentifiers.push(item.value),
      );
    }
    if (hasSrcOrDstFilter && srcOrDstFilterValues.length > 0) {
      srcOrDstFilterValues.forEach((item) =>
        filtersIdentifiers.push(item.value),
      );
    }

    setShowFilterModal(false);
    setAllPreviousFilters({
      filters: filtersIdentifiers,
      dateStart: dateStart?.toUnixInteger() ?? null,
      dateEnd: dateEnd?.toUnixInteger() ?? null,
    });

    handleFilters({
      filters: filtersIdentifiers,
      dateStart: dateStart?.toUnixInteger() ?? null,
      dateEnd: dateEnd?.toUnixInteger() ?? null,
    });
  }, [
    kindFilterValues,
    recipientFilterValues,
    channelFilterValues,
    sendParameterFilterValues,
    srcOrDstFilterValues,
    dateStart,
    dateEnd,
    contextIdentifier,
    handleFilters,
  ]);

  const resetFilters = useCallback(() => {
    setKindFilterValues([]);
    setRecipientFilterValues([]);
    setChannelFilterValues([]);
    setSendParameterFilterValues([]);
    setSrcOrDstFilterValues([]);
    setDateStart(null);
    setDateEnd(null);
    setShouldSubmitFilters(true);
  }, [
    setKindFilterValues,
    setRecipientFilterValues,
    setChannelFilterValues,
    setSendParameterFilterValues,
    setSrcOrDstFilterValues,
    setDateStart,
    setDateEnd,
    setShouldSubmitFilters,
  ]);

  const onCollapseClick = () => {
    setShowFilterModal((current) => !current);
  };

  const resetPeriodFilter = useCallback(() => {
    setDateStart(null);
    setDateEnd(null);
    setShouldSubmitFilters(true);
  }, [setDateEnd, setDateStart]);

  const popKindFilterValue = useCallback(
    (index: number) => {
      popFilterValue({ setFilter: setKindFilterValues, index });
    },
    [setKindFilterValues],
  );

  const popChannelFilterValue = useCallback(
    (index: number) => {
      popFilterValue({ setFilter: setChannelFilterValues, index });
    },
    [setChannelFilterValues],
  );

  const popRecipientFilterValue = useCallback(
    (index: number) => {
      popFilterValue({ setFilter: setRecipientFilterValues, index });
    },
    [setRecipientFilterValues],
  );

  const popSendParameterFilterValue = useCallback(
    (index: number) => {
      popFilterValue({ setFilter: setSendParameterFilterValues, index });
    },
    [setSendParameterFilterValues],
  );

  const popSrcOrDstFilterValue = useCallback(
    (index: number) => {
      popFilterValue({ setFilter: setSrcOrDstFilterValues, index });
    },
    [setSrcOrDstFilterValues],
  );

  useEffect(() => {
    if (shouldSubmitFilters) {
      handleFiltersSubmit();
      setShouldSubmitFilters(false);
    }
  }, [shouldSubmitFilters, handleFiltersSubmit, setShouldSubmitFilters]);

  // Todo : remove Anti Pattern
  const renderFilterValuesContainer = (periodHasChanged: boolean) => {
    const countFilter =
      kindFilterValues.length +
      channelFilterValues.length +
      recipientFilterValues.length +
      sendParameterFilterValues.length +
      srcOrDstFilterValues.length +
      (periodHasChanged ? 1 : 0);
    return (
      <div className={classes.filterValuesContainer}>
        <Hidden xsDown>
          {kindFilterValues.length > 0 && (
            <CommunicationFilterValuesGenericSummary
              filterValues={kindFilterValues}
              popFilterValue={popKindFilterValue}
              title={t(`filter.kind.title`)}
            />
          )}
          {periodHasChanged && (
            <CommunicationFilterValuesPeriodSummary
              dateEnd={dateEnd}
              dateStart={dateStart}
              resetDates={resetPeriodFilter}
              title={t('filter.dateFilter.period')}
            />
          )}
          {channelFilterValues.length > 0 && (
            <CommunicationFilterValuesGenericSummary
              filterValues={channelFilterValues}
              popFilterValue={popChannelFilterValue}
              title={t(`filter.channel.title`)}
            />
          )}
          {recipientFilterValues.length > 0 && (
            <CommunicationFilterValuesGenericSummary
              filterValues={recipientFilterValues}
              popFilterValue={popRecipientFilterValue}
              title={t(`filter.recipient.title`)}
            />
          )}
          {sendParameterFilterValues.length > 0 && (
            <CommunicationFilterValuesGenericSummary
              filterValues={sendParameterFilterValues}
              popFilterValue={popSendParameterFilterValue}
              title={t(`filter.sendParameter.title`)}
            />
          )}
          {srcOrDstFilterValues.length > 0 && (
            <CommunicationFilterValuesGenericSummary
              filterValues={srcOrDstFilterValues}
              popFilterValue={popSrcOrDstFilterValue}
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
            onDelete={() => {
              resetFilters();
            }}
            size="small"
          />
        </Hidden>
      </div>
    );
  };

  const renderCollapseRightIcon = (hasFilters: boolean) => {
    if (showFilterModal) {
      return (
        <IconButton aria-label="expand row" size="small">
          <KeyboardArrowUp />
        </IconButton>
      );
    }
    if (hasFilters) {
      return (
        <IconButton aria-label="expand row" onClick={resetFilters} size="small">
          <Close />
        </IconButton>
      );
    }
    return (
      <IconButton aria-label="expand row" size="small">
        <KeyboardArrowDown />
      </IconButton>
    );
  };

  const periodHasChanged = !!dateStart || !!dateEnd;
  const hasSetSomeFilters =
    kindFilterValues.length > 0 ||
    recipientFilterValues.length > 0 ||
    channelFilterValues.length > 0 ||
    sendParameterFilterValues.length > 0 ||
    srcOrDstFilterValues.length > 0;

  const {
    hasKindFilter,
    hasChannelFilter,
    hasDatesFilter,
    hasRecipientFilter,
    hasSendParameterFilter,
    hasSrcOrDstFilter,
  } = getFiltersToEnable(contextIdentifier);
  const {
    kindFilterOptionsOverride,
    recipientFilterOptionsOverride,
    channelFilterOptionsOverride,
    sendParameterFilterOptionsOverride,
    srcOrDstFilterOptionsOverride,
  } = getFilterOptionsOverride(contextIdentifier, t);

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
        {(hasSetSomeFilters || periodHasChanged) &&
          !showFilterModal &&
          renderFilterValuesContainer(periodHasChanged)}
        {renderCollapseRightIcon(hasSetSomeFilters || periodHasChanged)}
      </ButtonBase>
      <Collapse in={showFilterModal}>
        <CommunicationFilterCollapse
          allPreviousFilter={allPreviousFilters}
          channelFilterOptionsOverride={channelFilterOptionsOverride}
          channelFilterSetter={setChannelFilterValues}
          channelFilterValues={channelFilterValues}
          dateEndSetter={setDateEnd}
          dateEndValue={dateEnd}
          dateStartSetter={setDateStart}
          dateStartValue={dateStart}
          handleFiltersSubmit={handleFiltersSubmit}
          hasChannelFilter={hasChannelFilter}
          hasDatesFilter={hasDatesFilter}
          hasKindFilter={hasKindFilter}
          hasRecipientFilter={hasRecipientFilter}
          hasSendParameterFilter={hasSendParameterFilter}
          hasSrcOrDstFilter={hasSrcOrDstFilter}
          kindFilterOptionsOverride={kindFilterOptionsOverride}
          kindFilterSetter={setKindFilterValues}
          kindFilterValues={kindFilterValues}
          recipientFilterOptionsOverride={recipientFilterOptionsOverride}
          recipientFilterSetter={setRecipientFilterValues}
          recipientFilterValues={recipientFilterValues}
          sendParameterFilterOptionsOverride={
            sendParameterFilterOptionsOverride
          }
          sendParameterFilterSetter={setSendParameterFilterValues}
          sendParameterFilterValues={sendParameterFilterValues}
          srcOrDstFilterOptionsOverride={srcOrDstFilterOptionsOverride}
          srcOrDstFilterSetter={setSrcOrDstFilterValues}
          srcOrDstFilterValues={srcOrDstFilterValues}
        />
      </Collapse>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  arrowIconRotation: {
    transform: 'rotate(180deg)',
  },
  chip: {
    borderRadius: theme.spacing(0.5),
    marginRight: theme.spacing(1),
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

export default React.memo(CommunicationFilterContainer);
