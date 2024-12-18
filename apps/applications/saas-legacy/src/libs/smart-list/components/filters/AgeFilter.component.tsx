import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { createStyles, WithStyles } from '@material-ui/styles';

import { Theme } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
  COMPARATORS_DICT_BETWEEN,
  BETWEEN_COMPARATOR,
  GTE_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list';

import DelayedNumericInput from '#src/components/DelayedNumericInput.component';

type OwnProps = {
  filter_data: any;
  onChange: (filterData: any) => void;
  isNew: boolean;
  setNotNullableData: (data: Array<string>) => void;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

export class AgeFilter extends Component<Props> {
  componentDidMount() {
    this.props.setNotNullableData(['value', 'comparator']);

    if (this.props.isNew) {
      this.props.onChange({
        comparator: GTE_COMPARATOR,
        value: 20,
        value_second: 40,
      });
    }
  }

  render() {
    const { filter_data, t, classes, onChange } = this.props;
    return (
      <div>
        {t(`filters.${filter_data.filter_identifier}.first`)}
        <Select
          className={classes.textInput}
          defaultValue={GTE_COMPARATOR}
          onChange={(ev) => onChange({ comparator: ev.target.value })}
          value={filter_data.comparator}
        >
          {COMPARATORS_DICT_BETWEEN.map((item) => (
            <MenuItem key={item.key} value={item.value}>
              {t(`filters.comparators.${item.value}`)}
            </MenuItem>
          ))}
        </Select>
        {filter_data?.comparator === BETWEEN_COMPARATOR
          ? null
          : t(`filters.${filter_data?.filter_identifier}.to`)}
        <DelayedNumericInput
          classes={classes}
          InputProps={{ inputProps: { min: 0 } }}
          onChange={(ev) =>
            onChange({
              value: ev.target.value === '' ? null : ev.target.value,
            })
          }
          value={filter_data.value}
        />
        {filter_data?.comparator === BETWEEN_COMPARATOR
          ? t(`filters.${filter_data?.filter_identifier}.between`)
          : null}
        {filter_data?.comparator === BETWEEN_COMPARATOR ? (
          <DelayedNumericInput
            classes={classes}
            InputProps={{ inputProps: { min: 0 } }}
            onChange={(ev) =>
              onChange({
                value_second: ev.target.value === '' ? null : ev.target.value,
              })
            }
            value={filter_data?.value_second}
          />
        ) : null}
        {t(`filters.${filter_data.filter_identifier}.second`)}
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    disabled: {
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none',
      background: '#f1f1f1',
      borderRadius: '7px',
      paddingLeft: theme.spacing(1),
    },
    inlineContainer: { display: 'flex', alignItems: 'center' },
    textInput: {
      width: '70px',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  });

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(AgeFilter);
