import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { UniqueCodeStateStatus } from '@bsport/common/lib/master-data/coupon';
import MaterialUISelector from '#src/components/Selector/MaterialUISelector.component';
import type { Coupon } from '#src/libs/coupon/types';
import { COUPON_TYPE_FILTER_DEFAULT_VALUE } from '#src/libs/coupon/constants';

type Props = {
  uniqueCodeCoupon: Coupon;
  setAvailableUniqueCodes: React.Dispatch<React.SetStateAction<string[]>>;
};

type DefaultValue =
  | UniqueCodeStateStatus
  | typeof COUPON_TYPE_FILTER_DEFAULT_VALUE;

type Option = {
  label: string;
  value: DefaultValue;
};

const CouponTypeFilter: React.FC<Props> = ({
  uniqueCodeCoupon,
  setAvailableUniqueCodes,
}) => {
  const { t } = useTranslation('coupon');

  const classes = useStyles();

  const [selectedCodeStatus, setSelectedCodeStatus] = useState<Option>({
    label: t('uniqueCodeCoupon.voucherCodesDialog.selector.allStatus'),
    value: COUPON_TYPE_FILTER_DEFAULT_VALUE,
  });

  const filterOptions = useMemo(
    () => [
      {
        label: t('uniqueCodeCoupon.voucherCodesDialog.selector.allStatus'),
        value: COUPON_TYPE_FILTER_DEFAULT_VALUE,
      },
      {
        label: t('uniqueCodeCoupon.voucherCodesDialog.selector.notUsed'),
        value: UniqueCodeStateStatus.AVAILABLE,
      },
      {
        label: t('uniqueCodeCoupon.voucherCodesDialog.selector.redeemed'),
        value: UniqueCodeStateStatus.REDEEMED,
      },
      {
        label: t('uniqueCodeCoupon.voucherCodesDialog.selector.pending'),
        value: UniqueCodeStateStatus.USED,
      },
    ],
    [t],
  );

  const filterCodesByStatus = useCallback(
    (status: DefaultValue) => {
      if (!uniqueCodeCoupon) return;
      if (status === COUPON_TYPE_FILTER_DEFAULT_VALUE) {
        setAvailableUniqueCodes(
          Object.keys(uniqueCodeCoupon.available_unique_codes),
        );
      } else {
        const filteredObject = Object.keys(
          uniqueCodeCoupon.available_unique_codes,
        ).reduce(
          (acc: { [key: string]: { status: UniqueCodeStateStatus } }, key) => {
            if (
              uniqueCodeCoupon.available_unique_codes[key].status === status
            ) {
              acc[key] = uniqueCodeCoupon.available_unique_codes[key];
            }
            return acc;
          },
          {},
        );
        const filteredObjectKeys = Object.keys(filteredObject);
        setAvailableUniqueCodes(filteredObjectKeys);
      }
    },
    [setAvailableUniqueCodes, uniqueCodeCoupon],
  );

  const handleOnChange = useCallback(
    (selectedOption: Option) => {
      setSelectedCodeStatus(selectedOption);
      filterCodesByStatus(selectedOption.value);
    },
    [setSelectedCodeStatus, filterCodesByStatus],
  );

  return (
    <div className={classes.filterSection}>
      <MaterialUISelector
        onChange={handleOnChange}
        options={filterOptions}
        value={selectedCodeStatus}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  filterSection: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default React.memo(CouponTypeFilter);
