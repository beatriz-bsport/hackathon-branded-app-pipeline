// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';

import NumericInput from '../../../../components/input/NumericInput.component';

type Props = {
  filter_data: any,
  t: TFunction,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
};

export class LastPreviousBookingFilter extends Component<Props, state> {
  componentDidMount() {
    if (this.props.new) {
      this.props.onChange({ value: null });
    }
  }

  render() {
    const { filter_data, t, classes, onChange } = this.props;
    return (
      <div className={classes.wrapper}>
        {t(`filters.${filter_data.filter_identifier}.first`)}
        <NumericInput
          classes={classes}
          value={filter_data.value}
          onChange={(ev) => onChange({ value: ev.target.value })}
          required
        />
        {t(`filters.${filter_data.filter_identifier}.second`)}
      </div>
    );
  }
}

const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  textInput: {
    width: '70px',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
)(LastPreviousBookingFilter);
