import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { CouponKind } from '@bsport/common/lib/master-data/coupon';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import { CouponFilterOptions } from '#libs/coupon/types';

type Props = {
  onCouponTypeFilter: (couponType: CouponFilterOptions | CouponKind) => void;
};

type Option = {
  label: string;
  value: CouponFilterOptions;
};

const CouponTypeFilter: React.FC<Props> = ({ onCouponTypeFilter }) => {
  const { t } = useTranslation('coupon');

  const [selectedCouponType, setSelectedCouponType] = useState<Option>({
    label: t('couponFilter.allType'),
    value: CouponFilterOptions.DEFAULT,
  });

  const classes = useStyles();

  const filterOptions = useMemo(
    () => [
      {
        label: t('couponFilter.allType'),
        value: CouponFilterOptions.DEFAULT,
      },
      {
        label: t('fabLabels.discountCode'),
        value: CouponFilterOptions.VIA_CODE,
      },
      {
        label: t('fabLabels.voucherCodes'),
        value: CouponFilterOptions.VIA_UNIQUE_CODE_PER_USAGE,
      },
    ],
    [t],
  );

  const handleOnChange = useCallback(
    (selectedOption: { label: string; value: CouponFilterOptions }) => {
      setSelectedCouponType(selectedOption);
    },
    [],
  );

  const handleOnCouponTypeFilter = useCallback(
    (couponType: CouponFilterOptions) => {
      onCouponTypeFilter && onCouponTypeFilter(couponType);
    },
    [onCouponTypeFilter],
  );

  useEffect(() => {
    handleOnCouponTypeFilter(selectedCouponType?.value);
  }, [handleOnCouponTypeFilter, selectedCouponType]);

  return (
    <div className={classes.filterSection}>
      <Typography className={classes.title}>
        {t('couponFilter.title')}
      </Typography>
      <MaterialUISelector
        onChange={handleOnChange}
        options={filterOptions}
        value={selectedCouponType}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  filterSection: { marginBottom: theme.spacing(2) },
  title: { marginBottom: theme.spacing(1) },
}));

export default React.memo(CouponTypeFilter);
