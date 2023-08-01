// @flow
import React from 'react';

import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import TemporalStatistic from '../../../components/graph/TemporalDiagram.component';
import PieChart from '../../../components/graph/DEPRECATEDPieChart.component';

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
        className={props.classes.listSizeContainer}
        variant="subtitle2"
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
        {/* statistics.expensesSegments ? (
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
	) : null */}
        {statistics.expensesSegments ? (
          <Grid item xs={6}>
            <PieChart
              data={statistics.bookingsSegments.data}
              height={250}
              loading={statistics.bookingsSegments.loading}
              title={t('graphs.bookingsSegments.title')}
              width={400}
            />
          </Grid>
        ) : null}
      </Grid>
      {statistics.bookings ? (
        <TemporalStatistic
          colorId={3}
          data={statistics.bookings.data.table}
          height={300}
          loading={statistics.bookings.loading}
          title={t('graphs.bookings')}
          xFormatter={statistics.bookings.formatter}
          xKey="d"
          yKey="v"
        />
      ) : null}
      <div className={props.classes.datePickerContainer}>
        <MuiPickersUtilsProvider
          locale={Moment.locale()}
          moment={Moment}
          utils={MomentUtils}
        >
          <DatePicker
            keyboard
            className={props.classes.datePicker}
            format="L"
            label={t('dashboard:dateRange.start')}
            maxDate={props.dateRange.end.format('YYYY-MM-DD')}
            onChange={(value) =>
              props.changeDateRange(value, props.dateRange.end, null)
            }
            returnMoment={false}
            value={props.dateRange.start.format('YYYY-MM-DD')}
          />
          <DatePicker
            keyboard
            format="L"
            label={t('dashboard:dateRange.end')}
            minDate={props.dateRange.start.format('YYYY-MM-DD')}
            onChange={(value) =>
              props.changeDateRange(props.dateRange.start, value, null)
            }
            returnMoment={false}
            value={props.dateRange.end.format('YYYY-MM-DD')}
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
