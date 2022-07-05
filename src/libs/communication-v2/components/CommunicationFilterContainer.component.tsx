import React from 'react';
import { Moment as MomentType } from 'moment-timezone';
import { compose } from 'recompose';
import {
  Collapse,
  Paper,
  Typography,
  ButtonBase,
  IconButton,
  Theme,
  Hidden,
  Chip,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { Tune, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import CommunicationFilterCollapse from './CommunicationFilterCollapse.component';
import CommunicationFilterValuesGenericSummary from './CommunicationFilterValuesGenericSummary.component';
import CommunicationFilterValuesPeriodSummary from './CommunicationFilterValuesPeriodSummary.component';
import { SelectFieldItem } from '../types';

export type FilterProps = {
  hasKindFilter?: boolean;
  hasRecipientFilter?: boolean;
  hasChannelFilter?: boolean;
  hasSendParameterFilter?: boolean;
  hasDatesFilter?: boolean;
  kindFilterOptionsOverride?: SelectFieldItem[];
  channelFilterOptionsOverride?: SelectFieldItem[];
  recipientFilterOptionsOverride?: SelectFieldItem[];
  sendParameterFilterOptionsOverride?: SelectFieldItem[];
  classes: any;
};

type OwnProps = FilterProps & WithTranslation;

type FilterState = {
  dateStart: MomentType;
  dateEnd: MomentType;
  kindFilterValues: Array<SelectFieldItem>;
  recipientFilterValues: Array<SelectFieldItem>;
  channelFilterValues: Array<SelectFieldItem>;
  sendParameterFilterValues: Array<SelectFieldItem>;
  showFilterModal: boolean;
};
export class CommunicationFilterContainer extends React.Component<
  OwnProps,
  FilterState
> {
  constructor(props: OwnProps) {
    super(props);
    this.state = {
      dateStart: null,
      dateEnd: null,
      kindFilterValues: [],
      recipientFilterValues: [],
      channelFilterValues: [],
      sendParameterFilterValues: [],
      showFilterModal: false,
    };
  }

  onCollapseClick = () => {
    this.setState((prevState: FilterState) => ({
      showFilterModal: !prevState.showFilterModal,
    }));
  };

  handleFiltersSubmit = () => {
    const filtersNumbers: number[] = [];
    if (this.props.hasKindFilter && this.state.kindFilterValues.length > 0) {
      this.state.kindFilterValues.forEach((item: SelectFieldItem) =>
        filtersNumbers.push(item.value),
      );
    }
    if (
      this.props.hasRecipientFilter &&
      this.state.recipientFilterValues.length > 0
    ) {
      this.state.recipientFilterValues.forEach((item: SelectFieldItem) =>
        filtersNumbers.push(item.value),
      );
    }
    if (
      this.props.hasChannelFilter &&
      this.state.channelFilterValues.length > 0
    ) {
      this.state.channelFilterValues.forEach((item: SelectFieldItem) =>
        filtersNumbers.push(item.value),
      );
    }
    if (
      this.props.hasSendParameterFilter &&
      this.state.sendParameterFilterValues.length > 0
    ) {
      this.state.sendParameterFilterValues.forEach((item: SelectFieldItem) =>
        filtersNumbers.push(item.value),
      );
    }

    this.setState({ showFilterModal: false });

    // We may have to change how the relevant data are returned
    const dataToSubmit = {
      filters: filtersNumbers,
      date_start: this.state.dateStart?.unix() ?? null,
      date_end: this.state.dateEnd?.unix() ?? null,
    };
    return dataToSubmit;
  };

  resetFilters = () => {
    this.setState(
      {
        kindFilterValues: [],
        recipientFilterValues: [],
        channelFilterValues: [],
        sendParameterFilterValues: [],
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

  renderFilterValuesContainer = (periodHasChanged: boolean) => {
    const { classes, t } = this.props;
    const countFilter =
      this.state.kindFilterValues.length +
      this.state.channelFilterValues.length +
      this.state.recipientFilterValues.length +
      this.state.sendParameterFilterValues.length +
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
        </Hidden>
        <Hidden smUp>
          <Chip
            clickable={false}
            label={
              countFilter > 1
                ? `${countFilter} ${t('filter.numberFilter.severalFilters')}`
                : t('filter.numberFilter.oneFilter')
            }
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
    const { classes, t } = this.props;
    const periodHasChanged = !!this.state.dateStart || !!this.state.dateEnd;
    const hasSetSomeFilters =
      this.state.kindFilterValues.length > 0 ||
      this.state.recipientFilterValues.length > 0 ||
      this.state.channelFilterValues.length > 0 ||
      this.state.sendParameterFilterValues.length > 0;

    const updateKindFilterValues = (newValues: SelectFieldItem[]) =>
      this.setState({ kindFilterValues: newValues });
    const updateChannelFilterValues = (newValues: SelectFieldItem[]) =>
      this.setState({ channelFilterValues: newValues });
    const updateRecipientFilterValues = (newValues: SelectFieldItem[]) =>
      this.setState({ recipientFilterValues: newValues });
    const updateSendParameterFilterValues = (newValues: SelectFieldItem[]) =>
      this.setState({ sendParameterFilterValues: newValues });
    const updateDateStartValue = (newDate: MomentType) =>
      this.setState({ dateStart: newDate });
    const updateDateEndValue = (newDate: MomentType) =>
      this.setState({ dateEnd: newDate });
    return (
      <Paper>
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
            hasKindFilter={this.props.hasKindFilter}
            kindFilterValues={this.state.kindFilterValues}
            kindFilterSetter={updateKindFilterValues}
            kindFilterOptionsOverride={this.props.kindFilterOptionsOverride}
            hasRecipientFilter={this.props.hasRecipientFilter}
            recipientFilterValues={this.state.recipientFilterValues}
            recipientFilterSetter={updateRecipientFilterValues}
            recipientFilterOptionsOverride={
              this.props.recipientFilterOptionsOverride
            }
            hasChannelFilter={this.props.hasChannelFilter}
            channelFilterValues={this.state.channelFilterValues}
            channelFilterSetter={updateChannelFilterValues}
            channelFilterOptionsOverride={
              this.props.channelFilterOptionsOverride
            }
            hasSendParameterFilter={this.props.hasSendParameterFilter}
            sendParameterFilterValues={this.state.sendParameterFilterValues}
            sendParameterFilterSetter={updateSendParameterFilterValues}
            sendParameterFilterOptionsOverride={
              this.props.sendParameterFilterOptionsOverride
            }
            hasDatesFilter={this.props.hasDatesFilter}
            dateStartValue={this.state.dateStart}
            dateStartSetter={updateDateStartValue}
            dateEndValue={this.state.dateEnd}
            dateEndSetter={updateDateEndValue}
            periodHasChanged={periodHasChanged}
            handleFiltersSubmit={this.handleFiltersSubmit}
          />
        </Collapse>
      </Paper>
    );
  }
}

const styles = (theme: Theme) => ({
  arrowIconRotation: {
    transform: 'rotate(180deg)',
  },
  chip: {
    borderRadius: theme.spacing(0.5),
    marginRight: theme.spacing(1),
  },
  filterDisplayer: {
    padding: theme.spacing(3),
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
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    padding: theme.spacing(1),
    borderLeft: 'solid 1px',
    borderLeftColor: theme.palette.grey[300],
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    height: '100%',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['communication']),
)(CommunicationFilterContainer);
