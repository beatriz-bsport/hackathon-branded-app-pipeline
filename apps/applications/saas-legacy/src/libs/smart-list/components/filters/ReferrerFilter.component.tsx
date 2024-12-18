import React from 'react';

import { Theme, makeStyles } from '@material-ui/core';

import { GTE_COMPARATOR } from '@bsport/common/lib/master-data/smart-list.js';
import { getCurrencyDisplay } from '#src/libs/theme/selectors';
import { DisableInputComponent, NumbersComparatorInput } from './inputs';

type FilterData = {
  filter_identifier: number;
  company_id: number;
  identifier: string;
  smartlist: number;

  value_referred: number;
  value_second_referred: number;
  comparator_referred: number;

  value_obtained_reward_active: boolean;
  value_obtained_reward: number;
  value_second_reward: number;
  comparator_reward: number;

  value_obtained_money_active: boolean;
  value_obtained_money: number;
  value_second_obtained_money: number;
  comparator_obtained_money: number;
};

type OwnProps = {
  filter_data: FilterData;
  onChange: (dict: Partial<FilterData>) => void;
  isNew: boolean;
};

export default React.memo<OwnProps>(
  ({ filter_data, onChange, isNew }: OwnProps) => {
    const classes = useStyles();

    React.useEffect(() => {
      if (isNew) {
        onChange({
          value_referred: 0,
          value_second_referred: 0,
          comparator_referred: GTE_COMPARATOR,

          value_obtained_reward_active: false,
          value_obtained_reward: 0,
          value_second_reward: 0,
          comparator_reward: GTE_COMPARATOR,

          value_obtained_money_active: false,
          value_obtained_money: 0,
          value_second_obtained_money: 0,
          comparator_obtained_money: GTE_COMPARATOR,
        });
      }
    }, [isNew, onChange]);

    return (
      <div className={classes.wrapper}>
        <div className={classes.inlineContainer}>
          <NumbersComparatorInput
            showToolTip
            filterData={filter_data}
            keys={{
              valueKey: 'value_referred',
              valueSecondKey: 'value_second_referred',
              comparatorKey: 'comparator_referred',
            }}
            onChange={onChange}
            translationsPrefix="referred"
          />
        </div>
        <div className={classes.inlineContainer}>
          <DisableInputComponent
            filterData={filter_data}
            keys={{ activeKey: 'value_obtained_reward_active' }}
            onChange={onChange}
          >
            <NumbersComparatorInput
              filterData={filter_data}
              keys={{
                valueKey: 'value_obtained_reward',
                valueSecondKey: 'value_second_reward',
                comparatorKey: 'comparator_reward',
              }}
              onChange={onChange}
              translationsPrefix="reward"
            />
          </DisableInputComponent>
        </div>

        <div className={classes.inlineContainer}>
          <DisableInputComponent
            filterData={filter_data}
            keys={{ activeKey: 'value_obtained_money_active' }}
            onChange={onChange}
          >
            <NumbersComparatorInput
              filterData={filter_data}
              keys={{
                valueKey: 'value_obtained_money',
                valueSecondKey: 'value_second_obtained_money',
                comparatorKey: 'comparator_obtained_money',
              }}
              onChange={onChange}
              paramsTranslation={{
                after: {
                  currency: getCurrencyDisplay(),
                },
              }}
              translationsPrefix="money"
            />
          </DisableInputComponent>
        </div>
      </div>
    );
  },
);

const useStyles = makeStyles((theme: Theme) => ({
  inlineContainer: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
}));
