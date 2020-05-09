// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

type Props = {
  filter_data: any,
  t: TFunction,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
  setNotNullableData: (Array<string>) => void,
};

export class GenderFilter extends Component<Props, state> {
  componentDidMount() {
    this.props.setNotNullableData(['value']);

    if (this.props.new) {
      this.props.onChange({ value: null });
    }
  }

  render() {
    const { filter_data, t, classes, onChange } = this.props;
    return (
      <div>
        {t(`filters.${filter_data.filter_identifier}.first`)}
        <Select
          className={classes.input}
          value={filter_data.value}
          onChange={(ev) => onChange({ value: ev.target.value })}
        >
          <MenuItem key="M" value="M">
            {t(`filters.${filter_data.filter_identifier}.men`)}
          </MenuItem>
          <MenuItem key="F" value="F">
            {t(`filters.${filter_data.filter_identifier}.women`)}
          </MenuItem>
        </Select>
      </div>
    );
  }
}

const styles = (theme) => ({
  input: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
)(GenderFilter);
