// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import moment from 'moment';
import StatsPanel from '../../libs/smart-list/components/StatsPanel.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import {
  dateRangeSelector,
  smartlistStatSelector as getSmartListStatistic,
  getStatisticLoading,
} from '../../state/stats/selectors';
import {
  fetchSmartListStats,
  dateRangeChange,
} from '../../actions/stats.actions';

const BOOKING_STATISTIC_IDENTIFIER = 1;
const EXPENSES_STATISTIC_IDENTIFIER = 3;
const BOOKING_SEGMENTS_STATISTIC_IDENTIFIER = 4;
const GENERAL_STATISTIC_IDENTIFIER = 5;

type Props = {
  t: TFunction,
  statistics: any,
  id: number,
  fetchSmartListStats: () => void,
  dateRangeChange: () => void,
  dateRange: Object,
};

export class SmartListDetailStatistic extends React.Component<Props> {
  componentDidMount() {
    this.fetchStats();
  }

  fetchStats = () => {
    const { id } = this.props;
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
    return (
      <div>
        <StatsPanel
          statistics={this.formatExpensesSegmentsStatistic()}
          changeDateRange={(start, end, kind = 'custom') => {
            this.props.dateRangeChange({ start, end, kind });
            this.props.fetchSmartListStats({
              smartlist: this.props.id,
              statistic_identifier: 1,
              graph_params: {
                start: moment(start).valueOf(),
                end: moment(end).valueOf(),
              },
            });
            this.props.fetchSmartListStats({
              smartlist: this.props.id,
              statistic_identifier: EXPENSES_STATISTIC_IDENTIFIER,
              graph_params: {
                start: moment(start).valueOf(),
                end: moment(end).valueOf(),
              },
            });
          }}
          dateRange={this.props.dateRange}
        />
      </div>
    );
  }
}

const styles = () => ({
  container: {},
});

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state, { id }) => ({
      statistics: {
        bookings: {
          data: getSmartListStatistic(state, id, BOOKING_STATISTIC_IDENTIFIER),
          loading: getStatisticLoading(state, id, BOOKING_STATISTIC_IDENTIFIER),
        },
        bookingsSegments: {
          data: getSmartListStatistic(
            state,
            id,
            BOOKING_SEGMENTS_STATISTIC_IDENTIFIER,
          ),
          loading: getStatisticLoading(
            state,
            id,
            BOOKING_SEGMENTS_STATISTIC_IDENTIFIER,
          ),
        },
        expensesSegments: {
          data: getSmartListStatistic(state, id, EXPENSES_STATISTIC_IDENTIFIER),
          loading: getStatisticLoading(
            state,
            id,
            EXPENSES_STATISTIC_IDENTIFIER,
          ),
        },
        general: {
          data: getSmartListStatistic(state, id, GENERAL_STATISTIC_IDENTIFIER),
          loading: getStatisticLoading(state, id, GENERAL_STATISTIC_IDENTIFIER),
        },
      },
      dateRange: dateRangeSelector(state),
    }),
    {
      dateRangeChange,
      fetchSmartListStats,
    },
  ),
)(SmartListDetailStatistic);
