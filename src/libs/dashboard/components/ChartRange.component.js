// @flow

import React from 'react';
import moment from 'moment-timezone';
import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import { MenuItem } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import DateRangeIcon from '@material-ui/icons/DateRange';
import Popover from '@material-ui/core/Popover';
import Chip from '@material-ui/core/Chip';

import DateInput from '../../../components/input/DateInput.component';

type Props = {
  t: TFunction,
  classes: Object,
  kind: ?string,
  start_date: ?string,
  end_date: ?string,
  setRange: ?({ start: string, end: string, kind: string }) => void,
  timeSettings: string,
};

type State = {
  start_date: string,
  end_date: string,
  kind: ?string,
  anchorEl: ?HTMLElement,
};

export const quickRanges = [
  {
    key: 'current_week',
    start: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  },
  {
    key: 'current_month',
    start: moment().subtract(1, 'month').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  },
  {
    key: 'last_three_months',
    start: moment().subtract(3, 'months').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  },
  {
    key: 'current_year',
    start: moment().subtract(1, 'year').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  },
];

class ChartRange extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      start_date: this.props.start_date || '',
      end_date: this.props.end_date || '',
      kind: this.props.kind || 'custom',
      anchorEl: null,
    };
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleChangeInterval = (start, end, custom) => {
    this.setState({ start_date: start, end_date: end, kind: custom });
    this.props.setRange({ start, end, kind: custom });
  };

  render() {
    const { start_date, end_date, kind, anchorEl } = this.state;
    return (
      <div>
        <Chip
          clickable={!!this.props.setRange}
          disabled={this.props.timeSettings !== 'range'}
          icon={<DateRangeIcon />}
          label={
            kind !== 'custom'
              ? `${this.props.t(kind)}`
              : `${moment(start_date).format('L')} -> ${moment(end_date).format(
                  'L',
                )}`
          }
          onClick={this.handleClick}
          size="small"
          variant="outlined"
        />
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          classes={{ paper: this.props.classes.paper }}
          onClose={this.handleClose}
          open={Boolean(anchorEl)}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem disabled value="">
            {this.props.t('dateFilter.customSelect')}
          </MenuItem>
          <DateInput
            className={this.props.classes.dateInput}
            id="date"
            InputLabelProps={{
              shrink: true,
            }}
            label={this.props.t('dateRange.start')}
            onChange={(value) =>
              this.handleChangeInterval(
                value.format('YYYY-MM-DD'),
                end_date,
                'custom',
              )
            }
            type="date"
            value={start_date}
          />
          <DateInput
            id="date"
            InputLabelProps={{
              shrink: true,
            }}
            label={this.props.t('dateRange.end')}
            onChange={(value) =>
              this.handleChangeInterval(
                start_date,
                value.format('YYYY-MM-DD'),
                'custom',
              )
            }
            type="date"
            value={end_date}
          />
          <MenuItem disabled value="">
            {this.props.t('dateFilter.quickSelect')}
          </MenuItem>
          {quickRanges.map((m) => (
            <MenuItem
              key={m.key}
              dense
              onClick={() => this.handleChangeInterval(m.start, m.end, m.key)}
              selected={m.key === kind}
            >
              <Typography variant="inherit">{this.props.t(m.key)}</Typography>
            </MenuItem>
          ))}
        </Popover>
      </div>
    );
  }
}

const styles = (theme) => ({
  dateInput: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  paper: {
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['dashboard']),
)(ChartRange);
