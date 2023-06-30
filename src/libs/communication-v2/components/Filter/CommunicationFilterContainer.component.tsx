import React from 'react';
import type { Moment as MomentType } from 'moment-timezone';
import { compose } from 'recompose';
import {
  Collapse,
  Typography,
  ButtonBase,
  IconButton,
  Theme,
  Hidden,
  Chip,
  WithStyles,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { Tune, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import CommunicationFilterCollapse from './CommunicationFilterCollapse.component';
import CommunicationFilterValuesGenericSummary from './CommunicationFilterValuesGenericSummary.component';
import CommunicationFilterValuesPeriodSummary from './CommunicationFilterValuesPeriodSummary.component';
import type {
  SelectFieldItem,
  FilterState,
} from '#libs/communication-v2/types';
import {
  getFiltersToEnable,
  getFilterOptionsOverride,
} from '#libs/communication-v2/utils';

type OwnProps = {
  contextIdentifier: number;
  handleFilters: (
    filters: number[],
    dateStart: number,
    dateEnd: number,
  ) => void;
};

export type Props = OwnProps & WithTranslation & WithStyles;
export class CommunicationFilterContainer extends React.Component<
  Props,
  FilterState
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      dateStart: null,
      dateEnd: null,
      kindFilterValues: [],
      recipientFilterValues: [],
      channelFilterValues: [],
      sendParameterFilterValues: [],
      srcOrDstFilterValues: [],
      showFilterModal: false,
      allPreviousFilters: { filters: [], dateStart: null, dateEnd: null },
    };
  }

  onCollapseClick = () => {
    this.setState((prevState: FilterState) => ({
      showFilterModal: !prevState.showFilterModal,
    }));
  };

  handleFiltersSubmit = () => {
    const filtersNumbers: number[] = [];
    const {
      hasKindFilter,
      hasChannelFilter,
      hasRecipientFilter,
      hasSendParameterFilter,
      hasSrcOrDstFilter,
    } = getFiltersToEnable(this.props.contextIdentifier);
    if (hasKindFilter && this.state.kindFilterValues.length > 0) {
      this.state.kindFilterValues.forEach((item: SelectFieldItem) =>
        filtersNumbers.push(item.value),
      );
    }
    if (hasRecipientFilter && this.state.recipientFilterValues.length > 0) {
      this.state.recipientFilterValues.forEach((item: SelectFieldItem) =>
        filtersNumbers.push(item.value),
      );
    }
    if (hasChannelFilter && this.state.channelFilterValues.length > 0) {
      this.state.channelFilterValues.forEach((item: SelectFieldItem) =>
        filtersNumbers.push(item.value),
      );
    }
    if (
      hasSendParameterFilter &&
      this.state.sendParameterFilterValues.length > 0
    ) {
      this.state.sendParameterFilterValues.forEach((item: SelectFieldItem) =>
        filtersNumbers.push(item.value),
      );
    }

    if (hasSrcOrDstFilter && this.state.srcOrDstFilterValues.length > 0) {
      this.state.srcOrDstFilterValues.forEach((item: SelectFieldItem) =>
        filtersNumbers.push(item.value),
      );
    }

    this.setState((previousState: FilterState) => ({
      showFilterModal: false,
      allPreviousFilters: {
        filters: filtersNumbers,
        dateStart: previousState.dateStart?.unix() ?? null,
        dateEnd: previousState.dateEnd?.unix() ?? null,
      },
    }));
    this.props.handleFilters(
      filtersNumbers,
      this.state.dateStart?.unix() ?? null,
      this.state.dateEnd?.unix() ?? null,
    );
  };

  resetFilters = () => {
    this.setState(
      {
        kindFilterValues: [],
        recipientFilterValues: [],
        channelFilterValues: [],
        sendParameterFilterValues: [],
        srcOrDstFilterValues: [],
        dateStart: null,
        dateEnd: null,
      },
      this.handleFiltersSubmit,
    );
  };

  resetPeriodFilter = () => {
    this.setState(
      () => ({
        dateStart: null,
        dateEnd: null,
      }),
      this.handleFiltersSubmit,
    );
  };

  popKindFilterValue = (index: number) => {
    const newFilterValues = [...this.state.kindFilterValues];
    newFilterValues.splice(index, 1);
    this.setState(
      () => ({
        kindFilterValues: newFilterValues,
      }),
      this.handleFiltersSubmit,
    );
  };

  popChannelFilterValue = (index: number) => {
    const newFilterValues = [...this.state.channelFilterValues];
    newFilterValues.splice(index, 1);
    this.setState(
      () => ({
        channelFilterValues: newFilterValues,
      }),
      this.handleFiltersSubmit,
    );
  };

  popRecipientFilterValue = (index: number) => {
    const newFilterValues = [...this.state.recipientFilterValues];
    newFilterValues.splice(index, 1);
    this.setState(
      () => ({
        recipientFilterValues: newFilterValues,
      }),
      this.handleFiltersSubmit,
    );
  };

  popSendParameterFilterValue = (index: number) => {
    const newFilterValues = [...this.state.sendParameterFilterValues];
    newFilterValues.splice(index, 1);
    this.setState(
      () => ({
        sendParameterFilterValues: newFilterValues,
      }),
      this.handleFiltersSubmit,
    );
  };

  popSrcOrDstFilterValue = (index: number) => {
    const newFilterValues = [...this.state.srcOrDstFilterValues];
    newFilterValues.splice(index, 1);
    this.setState(
      () => ({
        srcOrDstFilterValues: newFilterValues,
      }),
      this.handleFiltersSubmit,
    );
  };

  renderFilterValuesContainer = (periodHasChanged: boolean) => {
    const { classes, t } = this.props;
    const countFilter =
      this.state.kindFilterValues.length +
      this.state.channelFilterValues.length +
      this.state.recipientFilterValues.length +
      this.state.sendParameterFilterValues.length +
      this.state.srcOrDstFilterValues.length +
      (periodHasChanged ? 1 : 0);
    return (
      <div className={classes.filterValuesContainer}>
        <Hidden xsDown>
          {this.state.kindFilterValues.length > 0 && (
            <CommunicationFilterValuesGenericSummary
              filterValues={this.state.kindFilterValues}
              popFilterValue={this.popKindFilterValue}
              title={t(`filter.kind.title`)}
            />
          )}
          {periodHasChanged && (
            <CommunicationFilterValuesPeriodSummary
              dateStart={this.state.dateStart}
              dateEnd={this.state.dateEnd}
              title={t('filter.dateFilter.period')}
              resetDates={this.resetPeriodFilter}
            />
          )}
          {this.state.channelFilterValues.length > 0 && (
            <CommunicationFilterValuesGenericSummary
              filterValues={this.state.channelFilterValues}
              popFilterValue={this.popChannelFilterValue}
              title={t(`filter.channel.title`)}
            />
          )}
          {this.state.recipientFilterValues.length > 0 && (
            <CommunicationFilterValuesGenericSummary
              filterValues={this.state.recipientFilterValues}
              popFilterValue={this.popRecipientFilterValue}
              title={t(`filter.recipient.title`)}
            />
          )}
          {this.state.sendParameterFilterValues.length > 0 && (
            <CommunicationFilterValuesGenericSummary
              filterValues={this.state.sendParameterFilterValues}
              popFilterValue={this.popSendParameterFilterValue}
              title={t(`filter.sendParameter.title`)}
            />
          )}
          {this.state.srcOrDstFilterValues.length > 0 && (
            <CommunicationFilterValuesGenericSummary
              filterValues={this.state.srcOrDstFilterValues}
              popFilterValue={this.popSrcOrDstFilterValue}
              title={t(`filter.srcOrDst.title`)}
            />
          )}
        </Hidden>
        <Hidden smUp>
          <Chip
            clickable={false}
            label={t('filter.numberFilter', { count: countFilter })}
            onDelete={() => {
              this.resetFilters();
            }}
            size="small"
            className={classes.chip}
            deleteIcon={<Close />}
          />
        </Hidden>
      </div>
    );
  };

  renderCollapseRightIcon = (hasFilters: boolean) => {
    if (this.state.showFilterModal) {
      return (
        <IconButton aria-label="expand row" size="small">
          <KeyboardArrowUp />
        </IconButton>
      );
    }
    if (hasFilters) {
      return (
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={this.resetFilters}
        >
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

  render() {
    const { classes, t, contextIdentifier } = this.props;
    const periodHasChanged = !!this.state.dateStart || !!this.state.dateEnd;
    const hasSetSomeFilters =
      this.state.kindFilterValues.length > 0 ||
      this.state.recipientFilterValues.length > 0 ||
      this.state.channelFilterValues.length > 0 ||
      this.state.sendParameterFilterValues.length > 0 ||
      this.state.srcOrDstFilterValues.length > 0;

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
    } = getFilterOptionsOverride(contextIdentifier, this.props.t);

    const updateKindFilterValues = (newValues: SelectFieldItem[]) =>
      this.setState({ kindFilterValues: newValues });
    const updateChannelFilterValues = (newValues: SelectFieldItem[]) =>
      this.setState({ channelFilterValues: newValues });
    const updateRecipientFilterValues = (newValues: SelectFieldItem[]) =>
      this.setState({ recipientFilterValues: newValues });
    const updateSendParameterFilterValues = (newValues: SelectFieldItem[]) =>
      this.setState({ sendParameterFilterValues: newValues });
    const updateSrcOrDstFilterValues = (newValues: SelectFieldItem[]) =>
      this.setState({ srcOrDstFilterValues: newValues });
    const updateDateStartValue = (newDate: MomentType) =>
      this.setState({ dateStart: newDate });
    const updateDateEndValue = (newDate: MomentType) =>
      this.setState({ dateEnd: newDate });
    return (
      <div className={classes.container}>
        <ButtonBase
          onClick={this.onCollapseClick}
          className={classes.filterDisplayer}
          disableRipple={hasSetSomeFilters || periodHasChanged}
        >
          <div className={classes.filterTitleContainer}>
            <Tune className={classes.filterIcon} />
            <Typography variant="body1" className={classes.filterTitle}>
              {t('filter.filterAction')}
            </Typography>
          </div>
          {(hasSetSomeFilters || periodHasChanged) &&
            !this.state.showFilterModal &&
            this.renderFilterValuesContainer(periodHasChanged)}
          {this.renderCollapseRightIcon(hasSetSomeFilters || periodHasChanged)}
        </ButtonBase>
        <Collapse in={this.state.showFilterModal}>
          <CommunicationFilterCollapse
            hasKindFilter={hasKindFilter}
            kindFilterValues={this.state.kindFilterValues}
            kindFilterSetter={updateKindFilterValues}
            kindFilterOptionsOverride={kindFilterOptionsOverride}
            hasRecipientFilter={hasRecipientFilter}
            recipientFilterValues={this.state.recipientFilterValues}
            recipientFilterSetter={updateRecipientFilterValues}
            recipientFilterOptionsOverride={recipientFilterOptionsOverride}
            hasChannelFilter={hasChannelFilter}
            channelFilterValues={this.state.channelFilterValues}
            channelFilterSetter={updateChannelFilterValues}
            channelFilterOptionsOverride={channelFilterOptionsOverride}
            hasSendParameterFilter={hasSendParameterFilter}
            sendParameterFilterValues={this.state.sendParameterFilterValues}
            sendParameterFilterSetter={updateSendParameterFilterValues}
            sendParameterFilterOptionsOverride={
              sendParameterFilterOptionsOverride
            }
            hasSrcOrDstFilter={hasSrcOrDstFilter}
            srcOrDstFilterValues={this.state.srcOrDstFilterValues}
            srcOrDstFilterSetter={updateSrcOrDstFilterValues}
            srcOrDstFilterOptionsOverride={srcOrDstFilterOptionsOverride}
            hasDatesFilter={hasDatesFilter}
            dateStartValue={this.state.dateStart}
            dateStartSetter={updateDateStartValue}
            dateEndValue={this.state.dateEnd}
            dateEndSetter={updateDateEndValue}
            periodHasChanged={periodHasChanged}
            handleFiltersSubmit={this.handleFiltersSubmit}
            allPreviousFilter={this.state.allPreviousFilters}
          />
        </Collapse>
      </div>
    );
  }
}

const styles: any = (theme: Theme) => ({
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
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['communication']),
)(CommunicationFilterContainer);
