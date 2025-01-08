import React from 'react';

import { Theme, makeStyles } from '@material-ui/core';
import { GTE_COMPARATOR } from '@bsport/common/master-data/smart-list.js';

import { getCurrencyDisplay } from '#src/libs/theme/selectors';
import {
  BooleanChoiceInputComponent,
  DisableInputComponent,
  NumbersComparatorInput,
} from './inputs';

type FilterData = {
  filter_identifier: number;
  company_id: number;
  identifier: string;
  smartlist: number;

  is_referred: boolean;

  money_obtained_active: boolean;
  money_obtained: number;
  money_obtained_second: number;
  money_obtained_comparator: number;
};

type OwnProps = {
  filter_data: FilterData;
  onChange?: (dict: Partial<FilterData>) => void;
  isNew: boolean;
};

export default React.memo<OwnProps>(
  ({ filter_data, onChange, isNew }: OwnProps) => {
    const classes = useStyles();

    React.useEffect(() => {
      if (isNew) {
        onChange({
          is_referred: true,
          money_obtained_active: false,
          money_obtained: 0,
          money_obtained_second: 0,
          money_obtained_comparator: GTE_COMPARATOR,
        });
      }
    }, [isNew, onChange]);

    return (
      <div className={classes.wrapper}>
        <div className={classes.inlineContainer}>
          <BooleanChoiceInputComponent
            fieldName="is_referred"
            filterData={filter_data}
            onChange={onChange}
          />
        </div>
        <div className={classes.inlineContainer}>
          <DisableInputComponent
            filterData={filter_data}
            keys={{ activeKey: 'money_obtained_active' }}
            onChange={onChange}
          >
            <NumbersComparatorInput
              filterData={filter_data}
              keys={{
                valueKey: 'money_obtained',
                valueSecondKey: 'money_obtained_second',
                comparatorKey: 'money_obtained_comparator',
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
