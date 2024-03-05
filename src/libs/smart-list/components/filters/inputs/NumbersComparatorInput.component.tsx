import React from 'react';

import {
  BETWEEN_COMPARATOR,
  COMPARATORS_DICT_BETWEEN,
  GTE_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import InfoIcon from '@material-ui/icons/Info';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import DelayedNumericInput from '#components/DelayedNumericInput.component';
import ToolTip from '#components/Tooltip.component';

type Keys = {
  comparatorKey: string;
  valueKey: string;
  valueSecondKey: string;
};
type HideTranslation = {
  before?: boolean;
  after?: boolean;
};
type ParamsTranslation = {
  before?: Record<string, string>;
  after?: Record<string, string>;
};

export type NumbersComparatorInputProps = {
  keys: Keys;
  filterData: any;
  onChange: (dict: any) => void;
  translationsPrefix?: string;
  hideTranslation?: HideTranslation;
  defaultComparatorValue?: number;
  paramsTranslation?: ParamsTranslation;
  showToolTip?: boolean;
};

/**
 * Component that provides an user interface for comparing numeric values.
 * It includes a select input for choosing the comparison operator and one or two numeric inputs for the values to compare.
 *
 * @prop keys - Object that maps the keys used in filterData to the corresponding properties of the component state
 * @prop filterData - The data that will be used to control the state of the inputs
 * @prop onChange - The function used to update the filterData when the state of the inputs changes
 * @prop translationsPrefix [Optional] - Prefix used for translation keys
 * @prop hideTranslation [Optional] - Object that indicates if translations should be removed
 * @prop defaultComparatorValue [Optional] - The default value for the comparator select input
 * @prop paramsTranslation [Optional] - Object that contains the parameters used for the translations
 * @prop showToolTip [Optional] - Boolean that indicates if a tooltip should be shown
 * @example
 * <NumbersComparatorInput
 *   filterData={filterData}
 *   keys={{ comparatorKey: 'comparator', valueKey: 'value', valueSecondKey: 'valueSecond' }}
 *   onChange={onChange}
 * />
 * ...
 */
export default React.memo<NumbersComparatorInputProps>(
  ({
    filterData,
    keys,
    onChange,
    translationsPrefix,
    hideTranslation,
    defaultComparatorValue,
    paramsTranslation,
    showToolTip = false,
  }) => {
    const { t } = useTranslation('smartList');
    const classes = useStyles();

    const getHandleDelayedNumericInputChange = React.useCallback(
      (key: string): ((event: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
          const value = event.target.value;
          onChange({
            [key]: value === '' ? null : value,
          });
        };
      },
      [onChange],
    );

    const selectOnChange = React.useCallback(
      (event: React.ChangeEvent<{ value: number }>) => {
        const value = event.target.value;
        onChange({ [keys.comparatorKey]: value });
      },
      [keys.comparatorKey, onChange],
    );

    const translationsKey = `filters.${
      filterData.filter_identifier
    }.numbersComparator.${translationsPrefix ? `${translationsPrefix}.` : ''}`;

    return (
      <div className={classes.wrapper}>
        {!hideTranslation?.before && (
          <div className={classes.textSpacer}>
            {t(`${translationsKey}before`)}
          </div>
        )}
        <Select
          className={classes.input}
          defaultValue={defaultComparatorValue || GTE_COMPARATOR}
          onChange={selectOnChange}
          value={filterData[keys.comparatorKey]}
        >
          {COMPARATORS_DICT_BETWEEN.map((item) => (
            <MenuItem key={item.key} value={item.value}>
              {t(
                `filters.comparators.${item.value}`,
                paramsTranslation?.before,
              )}
            </MenuItem>
          ))}
        </Select>
        <DelayedNumericInput
          onChange={getHandleDelayedNumericInputChange(keys.valueKey)}
          value={filterData[keys.valueKey]}
        />
        {filterData?.[keys.comparatorKey] === BETWEEN_COMPARATOR && (
          <div>
            <div className={classes.textSpacer}>
              {t(`${translationsKey}between`)}
            </div>
            <DelayedNumericInput
              onChange={getHandleDelayedNumericInputChange(keys.valueSecondKey)}
              value={filterData?.[keys.valueSecondKey]}
            />
          </div>
        )}
        {!hideTranslation?.after && (
          <div className={classes.textSpacer}>
            {t(`${translationsKey}after`, paramsTranslation?.after)}
          </div>
        )}
        {showToolTip && (
          <ToolTip
            aria-label="info"
            title={
              <Typography variant="subtitle2">
                {t(`${translationsKey}tooltip`)}
              </Typography>
            }
          >
            <IconButton style={{ padding: 0, paddingLeft: 2 }}>
              <InfoIcon />
            </IconButton>
          </ToolTip>
        )}
      </div>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  wrapper: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  textSpacer: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
  },
}));
