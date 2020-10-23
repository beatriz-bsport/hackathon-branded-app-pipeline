// @flow

import React from 'react';
import moment from 'moment-timezone';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

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
  setRange: ?({ start: string, end: string }) => void,
};

type State = {
  start_date: string,
  end_date: string,
  kind: ?string,
  anchorEl: ?HTMLElement,
};

const quickRanges = [
  {
    key: 'current_week',
    start: moment()
      .subtract(7, 'days')
      .format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  },
  {
    key: 'current_month',
    start: moment()
      .subtract(1, 'month')
      .format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  },
  {
    key: 'last_three_months',
    start: moment()
      .subtract(3, 'months')
      .format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  },
  {
    key: 'current_year',
    start: moment()
      .subtract(1, 'year')
      .format('YYYY-MM-DD'),
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
    this.props.setRange({ start, end });
  };

  render() {
    const { start_date, end_date, kind, anchorEl } = this.state;
    return (
      <div>
        <Chip
          icon={<DateRangeIcon />}
          label={
            kind !== 'custom'
              ? `${this.props.t(kind)}`
              : `${moment(start_date).format('L')} -> ${moment(end_date).format(
                  'L',
                )}`
          }
          onClick={this.handleClick}
          variant="outlined"
          size="small"
          clickable={!!this.props.setRange}
          disabled={!this.props.setRange}
        />
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          classes={{ paper: this.props.classes.paper }}
        >
          <MenuItem value="" disabled>
            {this.props.t('dateFilter.customSelect')}
          </MenuItem>
          <DateInput
            className={this.props.classes.dateInput}
            id="date"
            label={this.props.t('dateRange.start')}
            type="date"
            value={start_date}
            onChange={(value) =>
              this.handleChangeInterval(
                value.format('YYYY-MM-DD'),
                end_date,
                'custom',
              )
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <DateInput
            id="date"
            label={this.props.t('dateRange.end')}
            type="date"
            value={end_date}
            onChange={(value) =>
              this.handleChangeInterval(
                start_date,
                value.format('YYYY-MM-DD'),
                'custom',
              )
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <MenuItem value="" disabled>
            {this.props.t('dateFilter.quickSelect')}
          </MenuItem>
          {quickRanges.map((m) => (
            <MenuItem
              key={m.key}
              dense
              selected={m.key === kind}
              onClick={() => this.handleChangeInterval(m.start, m.end, m.key)}
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
