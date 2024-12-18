// @flow

import React, { Component } from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';

import DelayedNumericInput from '../../../../components/DelayedNumericInput.component';

type Props = {
  filter_data: any,
  t: TFunction,
  classes: Object,
  onChange: (any) => void,
  isNew: boolean,
  setNotNullableData: (data: Array<string>) => void,
};

export class LastPreviousBookingFilter extends Component<Props, state> {
  componentDidMount() {
    this.props.setNotNullableData(['value']);

    if (this.props.isNew) {
      this.props.onChange({ value: null });
    }
  }

  render() {
    const { filter_data, t, classes, onChange } = this.props;
    return (
      <div className={classes.wrapper}>
        {t(`filters.${filter_data.filter_identifier}.first`)}
        <DelayedNumericInput
          isPositive
          classes={classes}
          InputProps={{ inputProps: { min: 0 } }}
          onChange={(ev) =>
            onChange({ value: ev.target.value === '' ? null : ev.target.value })
          }
          value={filter_data.value}
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
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(LastPreviousBookingFilter);
