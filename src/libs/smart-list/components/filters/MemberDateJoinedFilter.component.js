// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment';

import CalendarPicker from '../CalendarPicker.component';

type Props = {
  filter_data: any,
  t: TFunction,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
  setNotNullableData: (Array<string>) => void,
};

const DATE_EXACT = 3;

export class MemberDateJoinedFilter extends Component<Props, state> {
  componentDidMount() {
    this.props.setNotNullableData([
      'date',
      'date_second',
      'duration',
      'duration_second',
      'date_filter_type',
    ]);

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
  withNamespaces(['smartList']),
  withStyles(styles),
)(MemberDateJoinedFilter);
