import React from 'react';

import { useTranslation } from 'react-i18next';
import { Theme, makeStyles } from '@material-ui/core';

import { DateTime } from 'luxon';
import { GTE_COMPARATOR } from '@bsport/common/lib/master-data/smart-list';
import CalendarPicker from '../CalendarPicker.component';
import {
  DisableInputComponent,
  NumbersComparatorInput,
  BooleanChoiceInputComponent,
} from './inputs';
import { DATE_BETWEEN } from '../constants';
import { getCurrencyDisplay } from '#libs/theme/selectors';

type FilterData = {
  filter_identifier: number;
  company_id: number;
  identifier: string;
  smartlist: number;

  first_payment_is_done: boolean;

  date_filter_active: boolean;
  date: string | null;
  date_second: string | null;
  date_filter_type: number;

  duration: number | null;
  duration_second: number | null;

  value_payment_active: boolean;
  value_payment: number;
  value_second_payment: number;
  comparator_payment: number;
};

type OwnProps = {
  filter_data: FilterData;
  onChange: (dict: Partial<FilterData>) => void;
  isNew: boolean;
};

const FirstPaymentFilter: React.FC<OwnProps> = ({
  filter_data,
  onChange,
  isNew,
}) => {
  const { t } = useTranslation('smartList');
  const classes = useStyles();

  React.useEffect(() => {
    if (isNew) {
      onChange({
        first_payment_is_done: true,
        date_filter_active: false,
        date_filter_type: DATE_BETWEEN,
        date: DateTime.now().toISODate(),
        date_second: DateTime.now().toISODate(),
        value_payment_active: false,
        value_payment: 0,
        value_second_payment: 0,
        comparator_payment: GTE_COMPARATOR,
      });
    }
  }, [isNew, onChange]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.inlineContainer}>
        <BooleanChoiceInputComponent
          fieldName="first_payment_is_done"
          filterData={filter_data}
          hideTranslation={{
            after: true,
          }}
          onChange={onChange}
        />
      </div>

      <div className={classes.inlineContainer}>
        <DisableInputComponent
          filterData={filter_data}
          forceDisable={!filter_data.first_payment_is_done}
          keys={{
            activeKey: 'date_filter_active',
          }}
          onChange={onChange}
        >
          {t(`filters.${filter_data.filter_identifier}.filterByDate.before`)}
          <CalendarPicker
            // @ts-expect-error
            blockValidateOnClickAway
            filter_data={filter_data}
            onChange={onChange}
          />
        </DisableInputComponent>
      </div>

      <div className={classes.inlineContainer}>
        <DisableInputComponent
          filterData={filter_data}
          forceDisable={!filter_data.first_payment_is_done}
          keys={{
            activeKey: 'value_payment_active',
          }}
          onChange={onChange}
        >
          <NumbersComparatorInput
            filterData={filter_data}
            keys={{
              comparatorKey: 'comparator_payment',
              valueKey: 'value_payment',
              valueSecondKey: 'value_second_payment',
            }}
            onChange={onChange}
            paramsTranslation={{
              after: {
                currency: getCurrencyDisplay(),
              },
            }}
            translationsPrefix="payment"
          />
        </DisableInputComponent>
      </div>
    </div>
  );
};

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

export default React.memo(FirstPaymentFilter);
