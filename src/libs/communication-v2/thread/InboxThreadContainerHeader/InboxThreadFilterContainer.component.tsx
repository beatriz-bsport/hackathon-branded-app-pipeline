import React, { memo, useCallback } from 'react';

import type { DateTime } from 'luxon';
import { makeStyles } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import Close from '@material-ui/icons/Close';
import Tune from '@material-ui/icons/Tune';
import ExpandLess from '@material-ui/icons/ExpandLess';
import { useTranslation } from 'react-i18next';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import CommunicationFilterValuesGenericSummary from '#src/libs/communication-v2/components/Filter/CommunicationFilterValuesGenericSummary.component';
import CommunicationFilterValuesPeriodSummary from '#src/libs/communication-v2/components/Filter/CommunicationFilterValuesPeriodSummary.component';
import { getFiltersToEnableForThread } from '#src/libs/communication-v2/utils';
import type { SelectFieldItem } from '#src/libs/communication-v2/types';
import CommunicationFilterCollapse from '#src/libs/communication-v2/components/Filter/CommunicationFilterCollapse.component';

type Props = {
  kindFilterValues: SelectFieldItem[];
  kindFilterSetter?: (args: SelectFieldItem[]) => void;
  popKindFilterValue: (index: number) => void;
  dateStart: DateTime;
  dateStartSetter?: (newDate: DateTime) => void;
  dateEnd: DateTime;
  dateEndSetter?: (newDate: DateTime) => void;
  resetPeriodFilter: () => void;
  channelFilterValues?: SelectFieldItem[];
  popChannelFilterValue?: (index: number) => void;
  recipientFilterValues: SelectFieldItem[];
  recipientFilterSetter?: (args: SelectFieldItem[]) => void;
  popRecipientFilterValue: (index: number) => void;
  sendParameterFilterValues: SelectFieldItem[];
  sendParameterFilterSetter?: (args: SelectFieldItem[]) => void;
  popSendParameterFilterValue: (index: number) => void;
  srcOrDstFilterValues: SelectFieldItem[];
  srcOrDstFilterSetter?: (args: SelectFieldItem[]) => void;
  popSrcOrDstFilterValue: (index: number) => void;
  resetFilters: () => void;

  handleFiltersSubmit: () => void;
  allPreviousFilter: {
    filters: number[];
    dateStart: number;
    dateEnd: number;
  };

  showFilterModal: boolean;
  setShowFilterModal: (isShown: boolean) => void;
  onShowFilterModal: () => void;

  relatedObjectKind: ChatThreadKinds;
};

const InboxThreadFilterContainer: React.FC<Props> = ({
  kindFilterValues,
  kindFilterSetter,
  popKindFilterValue,
  dateStart,
  dateStartSetter,
  dateEnd,
  dateEndSetter,
  resetPeriodFilter,
  channelFilterValues,
  popChannelFilterValue,
  recipientFilterValues,
  recipientFilterSetter,
  popRecipientFilterValue,
  sendParameterFilterValues,
  sendParameterFilterSetter,
  popSendParameterFilterValue,
  srcOrDstFilterValues,
  srcOrDstFilterSetter,
  popSrcOrDstFilterValue,
  resetFilters,
  handleFiltersSubmit,
  allPreviousFilter,
  relatedObjectKind,
  showFilterModal,
  setShowFilterModal,
  onShowFilterModal,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('communication');

  const periodHasChanged = !!dateStart || !!dateEnd;

  const countFilter =
    kindFilterValues.length +
    recipientFilterValues.length +
    sendParameterFilterValues.length +
    srcOrDstFilterValues.length +
    (periodHasChanged ? 1 : 0);

  const displayFiltersSelector = !!countFilter && !showFilterModal;

  const hideCollapse = useCallback(() => {
    setShowFilterModal(false);
  }, [setShowFilterModal]);

  const {
    hasKindFilter,
    hasDatesFilter,
    hasRecipientFilter,
    hasSendParameterFilter,
    hasSrcOrDstFilter,
  } = getFiltersToEnableForThread(relatedObjectKind);

  return (
    <>
      {displayFiltersSelector && (
        <div className={classes.container}>
          <ButtonBase
            disableRipple
            className={classes.filterDisplayer}
            onClick={onShowFilterModal}
          >
            <div className={classes.filterTitleContainer}>
              <Tune className={classes.filterIcon} />
              <Typography className={classes.filterTitle} variant="body1">
                {t('filter.filterAction')}
              </Typography>
            </div>
            <div className={classes.filterValuesContainer}>
              <Hidden xsDown>
                {!!kindFilterValues.length && (
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
                {!!channelFilterValues?.length && (
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
                {!!sendParameterFilterValues.length && (
                  <CommunicationFilterValuesGenericSummary
                    filterValues={sendParameterFilterValues}
                    popFilterValue={popSendParameterFilterValue}
                    title={t(`filter.sendParameter.title`)}
                  />
                )}
                {!!srcOrDstFilterValues.length && (
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
                  onDelete={resetFilters}
                  size="small"
                />
              </Hidden>
            </div>

            <IconButton
              aria-label="expand row"
              className={classes.closeFilter}
              onClick={resetFilters}
            >
              <Close />
            </IconButton>
          </ButtonBase>
        </div>
      )}
      <Collapse className={classes.collapse} in={showFilterModal}>
        <CommunicationFilterCollapse
          allPreviousFilter={allPreviousFilter}
          dateEndSetter={dateEndSetter}
          dateEndValue={dateEnd}
          dateStartSetter={dateStartSetter}
          dateStartValue={dateStart}
          handleFiltersSubmit={handleFiltersSubmit}
          hasDatesFilter={hasDatesFilter}
          hasKindFilter={hasKindFilter}
          hasRecipientFilter={hasRecipientFilter}
          hasSendParameterFilter={hasSendParameterFilter}
          hasSrcOrDstFilter={hasSrcOrDstFilter}
          kindFilterSetter={kindFilterSetter}
          kindFilterValues={kindFilterValues}
// @ts-expect-error
          periodHasChanged={periodHasChanged}
          recipientFilterSetter={recipientFilterSetter}
          recipientFilterValues={recipientFilterValues}
          sendParameterFilterSetter={sendParameterFilterSetter}
          sendParameterFilterValues={sendParameterFilterValues}
          srcOrDstFilterSetter={srcOrDstFilterSetter}
          srcOrDstFilterValues={srcOrDstFilterValues}
        />
        <IconButton className={classes.iconButton} onClick={hideCollapse}>
          <ExpandLess fontSize="large" />
        </IconButton>
      </Collapse>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: 0,
    borderBottom: 'solid 1px',
    borderBottomColor: theme.palette.divider,
    zIndex: 1000,
  },
  filterTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 'min-content',
  },
  filterIcon: {
    color: theme.palette.grey[600],
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
  chip: {
    borderRadius: theme.spacing(0.5),
    marginRight: theme.spacing(1),
  },
  iconButton: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      position: 'relative',
      bottom: 60,
      left: 10,
    },
  },
  collapse: {
    width: '100%',
  },
  filterDisplayer: {
    padding: theme.spacing(2),
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
  closeFilter: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

export default memo(InboxThreadFilterContainer);
