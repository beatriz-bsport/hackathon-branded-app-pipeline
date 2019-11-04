// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InlineDatePicker from 'material-ui-pickers/DatePicker/DatePickerInline';

type Props = {
  filter_data: any,
  t: TFunction,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
};

export class DateJoinedFilter extends Component<Props, state> {
  componentDidMount() {
    if (this.props.new) {
      this.props.onChange({ comparator: null, value: null });
    }
  }

  render() {
    const { filter_data, t, classes, onChange } = this.props;
    return (
      <div>
        {this.props.t(`filters.${filter_data.filter_identifier}.first`)}
        <Select
          className={classes.input}
          value={filter_data.comparator}
          onChange={(ev) => onChange({ comparator: ev.target.value })}
        >
          <MenuItem key="before" value="1">
            {t(`filters.${filter_data.filter_identifier}.before`)}
          </MenuItem>
          <MenuItem key="after" value="2">
            {t(`filters.${filter_data.filter_identifier}.after`)}
          </MenuItem>
        </Select>
        {t(`filters.${filter_data.filter_identifier}.second`)}
        <InlineDatePicker
          className={classes.input}
          keyboard
          ampm={false}
          value={filter_data.value}
          onChange={(ev) => onChange({ value: ev.format('YYYY-MM-DD') })}
          onError={console.error}
          format="YYYY/MM/DD"
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  input: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
)(DateJoinedFilter);
