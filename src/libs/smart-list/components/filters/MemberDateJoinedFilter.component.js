// @flow

import React, { Component } from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { DateTime } from 'luxon';

import CalendarPicker from '../CalendarPicker.component';

type Props = {
  filter_data: any,
  t: TFunction,
  classes: Object,
  onChange: (any) => void,
  isNew: boolean,
};

const DATE_EXACT = 3;

export class MemberDateJoinedFilter extends Component<Props, state> {
  componentDidMount() {
    if (this.props.isNew) {
      this.props.onChange({
        date: DateTime.now().toISODate(),
        date_second: DateTime.now().toISODate(),
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
        <CalendarPicker
          blockValidateOnClickAway
          filter_data={filter_data}
          onChange={onChange}
        />
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
