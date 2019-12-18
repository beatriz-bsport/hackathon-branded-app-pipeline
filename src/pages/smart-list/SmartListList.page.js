// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import moment from 'moment';

import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { getAllSmartList, getSmartList } from '../../libs/smart-list/selectors';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';

import {
  smartListDelete,
  fetchAllSmartLists,
  smartListCreate,
  smartListUpdate,
} from '../../libs/smart-list/actions';

import {
  getSmartListStatistic,
  dateRangeSelector,
  getStatisticLoading,
} from '../../state/stats/selectors';
import {
  fetchSmartListStats,
  dateRangeChange,
} from '../../actions/stats.actions';
import type SmartList from '../../libs/smart-list/types';
import SmartListListItem from '../../libs/smart-list/components/SmartListListItem.component';
// import { fetchDetails } from '../../libs/smart-list/api';
import SmartListEditDialog from '../../libs/smart-list/components/SmartListFormDialog.component';
import type { OptionCallback } from '../../state/types';
import SmartListCard from '../../libs/smart-list/components/SmartlistCard.component';

type Props = {
  smartlists: Array<SmartList>,
  t: TFunction,
  fetchAllSmartLists: () => void,
  smartListCreate: (data: SmartList, options: OptionCallback) => void,
  company_id: number,
  classes: Object,
  goToEdit: (id: number) => void,
  smartListDelete: (id: number, options: OptionCallback) => void,
  selectedId: number,
  goToSelected: (id: number) => void,
  smartListUpdate: (id: number) => void,

  goToSmartlistList: () => void,
  smartlistSelected: ?Smartlist,

  // staticstics
  fetchSmartListStats: () => void,
  dateRange: Object,
  dateRangeChange: () => void,
  statistics: any,
};

const BOOKING_STATISTIC_IDENTIFIER = 1;
const EXPENSES_STATISTIC_IDENTIFIER = 3;
const BOOKING_SEGMENTS_STATISTIC_IDENTIFIER = 4;
const GENERAL_STATISTIC_IDENTIFIER = 5;

type State = {
  openCreateDialog: boolean,
  openEditDialog: boolean,
};

export class SmartListList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openCreateDialog: false,
      openEditDialog: false,
    };
  }

  fetchStats = (id) => {
    this.props.fetchSmartListStats({
      smartlist: id,
      statistic_identifier: BOOKING_STATISTIC_IDENTIFIER,
      graph_params: {
        start: moment(this.props.dateRange.start).valueOf(),
        end: moment(this.props.dateRange.end).valueOf(),
      },
    });
    this.props.fetchSmartListStats({
      smartlist: id,
      statistic_identifier: EXPENSES_STATISTIC_IDENTIFIER,
      graph_params: {
        start: moment(this.props.dateRange.start).valueOf(),
        end: moment(this.props.dateRange.end).valueOf(),
      },
    });
    this.props.fetchSmartListStats({
      smartlist: id,
      statistic_identifier: BOOKING_SEGMENTS_STATISTIC_IDENTIFIER,
      graph_params: { duration_breakpoints: [30, 365] },
    });
    this.props.fetchSmartListStats({
      smartlist: id,
      statistic_identifier: GENERAL_STATISTIC_IDENTIFIER,
      graph_params: {},
    });
  };

  componentDidMount() {
    this.props.fetchAllSmartLists();
    if (this.props.selectedId) {
      this.fetchStats(this.props.selectedId);
    }
  }

  addNewSmartList = (data) => {
    const smartlist = data;
    smartlist.company = this.props.company_id;
    this.props.smartListCreate(data, {
      onSuccess: (data_) => this.props.goToEdit(data_.id),
    });
    this.setState({ openCreateDialog: false });
  };

  updateSmartList = (smartlist) => {
    this.setState({ openEditDialog: false });
    this.props.smartListUpdate(this.props.selectedId, smartlist);
  };

  selected = (id) => {
    if (id === this.props.selectedId) {
      this.props.goToEdit(id);
    } else {
      this.props.goToSelected(id);
      this.fetchStats(id);
    }
  };

  formatExpensesSegmentsStatistic = () => {
    const expenses = this.props.statistics.expensesSegments.data;
    const bookings = this.props.statistics.bookingsSegments.data;
    const { t } = this.props;

    return {
      bookings: this.props.statistics.bookings,
      general: this.props.statistics.general,
      bookingsSegments: {
        data: bookings.map((bookingValue, index) => ({
          name: t(`graphs.bookingsSegments.label.${index}`),
          value: bookingValue,
        })),
        loading: this.props.statistics.bookingsSegments.loading,
      },
      expensesSegments: {
        data: expenses.map((expense, index) => ({
          name: t(`graphs.expensesSegments.label.${index}`),
          value: expense,
        })),
        loading: this.props.statistics.expensesSegments.loading,
      },
    };
  };

  render() {
    const { smartlists, classes } = this.props;
    return (
      <div>
        <Grid container direction="row" spacing={24}>
          <Grid item xs={12} md={6}>
            <Paper>
              <List component="nav" disablePadding className={classes.list}>
                {smartlists.map((smartlist) => (
                  <SmartListListItem
                    key={smartlist.id}
                    onClick={(id) => {
                      this.selected(id);
                    }}
                    onClickEdit={this.props.goToEdit}
                    onClickDelete={(id) =>
                      this.props.smartListDelete(id, {
                        onSuccess: this.props.goToSmartlistList,
                      })
                    }
                    selected={
                      this.props.smartlistSelected &&
                      smartlist.id === this.props.smartlistSelected.id
                    }
                    smartlist={smartlist}
                  />
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <SmartListCard
              smartlist={this.props.smartlistSelected}
              onEdit={() => this.setState({ openEditDialog: true })}
              onConfigure={() =>
                this.props.goToEdit(this.props.smartlistSelected.id)
              }
              statistics={this.formatExpensesSegmentsStatistic()}
              changeDateRange={(start, end, kind = 'custom') => {
                this.props.dateRangeChange({ start, end, kind });
                this.props.fetchSmartListStats({
                  smartlist: this.props.selectedId,
                  statistic_identifier: 1,
                  graph_params: {
                    start: moment(start).valueOf(),
                    end: moment(end).valueOf(),
                  },
                });
                this.props.fetchSmartListStats({
                  smartlist: this.props.selectedId,
                  statistic_identifier: EXPENSES_STATISTIC_IDENTIFIER,
                  graph_params: {
                    start: moment(start).valueOf(),
                    end: moment(end).valueOf(),
                  },
                });
              }}
              dateRange={this.props.dateRange}
            />
          </Grid>
        </Grid>
        <SmartListEditDialog
          open={this.state.openEditDialog || this.state.openCreateDialog}
          smartlist={
            this.state.openEditDialog ? this.props.smartlistSelected : null
          }
          updateSmartList={
            this.state.openEditDialog
              ? this.updateSmartList
              : this.addNewSmartList
          }
          onCancel={() =>
            this.setState({ openEditDialog: false, openCreateDialog: false })
          }
          fullScreen
        />
        <BottomActionButtons
          onCreateLabel={this.props.t('smart_list.add')}
          onCreate={() => this.setState({ openCreateDialog: true })}
        />
      </div>
    );
  }
}

const styles = () => ({
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
  routerParamsToProps({ id: 'selectedId:number' }),
  withTitle(({ t }) => t('smart_list.list.title')),

  connect(
    (state, { selectedId }) => ({
      smartlists: getAllSmartList(state),
      smartlistSelected: getSmartList(state, selectedId),
      loading: state.smartList.isLoading,
      company_id: state.theme.theme.company,
      statistics: {
        bookings: {
          data: getSmartListStatistic(
            state,
            selectedId,
            BOOKING_STATISTIC_IDENTIFIER,
          ),
          loading: getStatisticLoading(
            state,
            selectedId,
            BOOKING_STATISTIC_IDENTIFIER,
          ),
        },
        bookingsSegments: {
          data: getSmartListStatistic(
            state,
            selectedId,
            BOOKING_SEGMENTS_STATISTIC_IDENTIFIER,
          ),
          loading: getStatisticLoading(
            state,
            selectedId,
            BOOKING_SEGMENTS_STATISTIC_IDENTIFIER,
          ),
        },
        expensesSegments: {
          data: getSmartListStatistic(
            state,
            selectedId,
            EXPENSES_STATISTIC_IDENTIFIER,
          ),
          loading: getStatisticLoading(
            state,
            selectedId,
            EXPENSES_STATISTIC_IDENTIFIER,
          ),
        },
        general: {
          data: getSmartListStatistic(
            state,
            selectedId,
            GENERAL_STATISTIC_IDENTIFIER,
          ),
          loading: getStatisticLoading(
            state,
            selectedId,
            GENERAL_STATISTIC_IDENTIFIER,
          ),
        },
      },
      dateRange: dateRangeSelector(state),
    }),
    {
      fetchAllSmartLists,
      smartListUpdate,
      dateRangeChange,
      smartListDelete,
      smartListCreate,
      fetchSmartListStats,
      goToEdit: (id) => push(`/smart-list/${id}/member`),
      goToSelected: (id) => push(`/smart-list/${id}`),
      goToSmartlistList: () => push('/smart-list/'),
    },
  ),
)(SmartListList);
