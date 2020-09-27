// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment-timezone';

import CalendarPicker from '../CalendarPicker.component';

type Props = {
  filter_data: any,
  t: TFunction,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
};

const DATE_EXACT = 3;

export class MemberDateJoinedFilter extends Component<Props, state> {
  componentDidMount() {
    if (this.props.new) {
      this.props.onChange({
        date: moment().format('YYYY-MM-DD'),
        date_second: moment().format('YYYY-MM-DD'),
        duration_second: 0,
        duration: 0,
        date_filter_type: DATE_EXACT,
      });
    }
  }

  render() {
    const { filter_data, classes, onChange } = this.props;
    return (
      <div className={classes.wrapper}>
        {this.props.t(`filters.${filter_data.filter_identifier}.first`)}
        <CalendarPicker filter_data={filter_data} onChange={onChange} />
      </div>
    );
  }
}

const styles = () => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(MemberDateJoinedFilter);
