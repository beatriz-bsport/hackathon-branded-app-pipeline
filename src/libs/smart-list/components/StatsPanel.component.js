// @flow
import React from 'react';

import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import TemporalStatistic from '../../../components/graph/TemporalDiagram.component';
import PieChart from '../../../components/graph/PieChart.component';

import { Moment } from '../../../i18n';

type Props = {
  t: TFunction,
  classes: Object,
  dateRange: Object,
  statistics: Object,
  changeDateRange: () => void,
};

export const StatsPanel = (props: Props) => {
  const { statistics, t } = props;
  return (
    <div className={props.classes.paper}>
      <Typography
        variant="subtitle2"
        className={props.classes.listSizeContainer}
      >
        {props.t('membersInList')}
        <div className={props.classes.listSize}>
          {props.statistics.general.data.length ? (
            props.statistics.general.data
          ) : (
            <CircularProgress size={15} />
          )}
        </div>
      </Typography>
      <Grid container>
        {statistics.expensesSegments ? (
          <Grid item xs={6}>
            <PieChart
              loading={statistics.expensesSegments.loading}
              data={statistics.expensesSegments.data}
              title={`${t(
                'graphs.expensesSegments.title.first',
              )} ${props.dateRange.start.format('DD/MM/YYYY')} ${t(
                'graphs.expensesSegments.title.second',
              )} ${props.dateRange.end.format('DD/MM/YYYY')}`}
              width={400}
              height={250}
            />
          </Grid>
        ) : null}
        {statistics.expensesSegments ? (
          <Grid item xs={6}>
            <PieChart
              loading={statistics.bookingsSegments.loading}
              data={statistics.bookingsSegments.data}
              title={t('graphs.bookingsSegments.title')}
              width={400}
              height={250}
            />
          </Grid>
        ) : null}
      </Grid>
      {statistics.bookings ? (
        <TemporalStatistic
          data={statistics.bookings.data.table}
          loading={statistics.bookings.loading}
          height={300}
          xKey="d"
          yKey="v"
          xFormatter={statistics.bookings.formatter}
          title={t('graphs.bookings')}
          colorId={3}
        />
      ) : null}
      <div className={props.classes.datePickerContainer}>
        <MuiPickersUtilsProvider
          utils={MomentUtils}
          moment={Moment}
          locale={Moment.locale()}
        >
          <DatePicker
            format="L"
            keyboard
            label={t('dashboard:dateRange.start')}
            returnMoment={false}
            value={props.dateRange.start.format('YYYY-MM-DD')}
            onChange={(value) =>
              props.changeDateRange(value, props.dateRange.end, null)
            }
            maxDate={props.dateRange.end.format('YYYY-MM-DD')}
            className={props.classes.datePicker}
          />
          <DatePicker
            format="L"
            keyboard
            label={t('dashboard:dateRange.end')}
            returnMoment={false}
            minDate={props.dateRange.start.format('YYYY-MM-DD')}
            value={props.dateRange.end.format('YYYY-MM-DD')}
            onChange={(value) =>
              props.changeDateRange(props.dateRange.start, value, null)
            }
          />
        </MuiPickersUtilsProvider>
      </div>
    </div>
  );
};

const styles = (theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  listSize: {
    marginLeft: theme.spacing(1),
  },
  listSizeContainer: {
    display: 'flex',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  datePicker: {
    marginRight: theme.spacing(1),
  },
  datePickerContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  configureButtonContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(StatsPanel);
