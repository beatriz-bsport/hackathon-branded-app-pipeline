import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

type Props = {
  allCodes: string[];
  selectedVoucherCodes: string[];
  setSelectedVoucherCodes: React.Dispatch<React.SetStateAction<string[]>>;
};

const VoucherCodesSelectButtons: React.FC<Props> = ({
  allCodes,
  selectedVoucherCodes,
  setSelectedVoucherCodes,
}) => {
  const { t } = useTranslation('coupon');
  const classes = useStyles();

  const isNoneVoucherCodesSelected = selectedVoucherCodes?.length === 0 || true;

  const areAllVoucherCodesSelected =
    !!selectedVoucherCodes && !!allCodes
      ? selectedVoucherCodes.length === allCodes.length
      : false;

  const handleSelectAll = useCallback(() => {
    setSelectedVoucherCodes(allCodes);
  }, [setSelectedVoucherCodes, allCodes]);

  const handleUnselectAll = useCallback(() => {
    setSelectedVoucherCodes([]);
  }, [setSelectedVoucherCodes]);

  return (
    <div className={classes.selectButtonContainer}>
      <Button
        className={classes.selectButton}
        disabled={areAllVoucherCodesSelected}
        onClick={handleSelectAll}
        size="small"
      >
        {t('uniqueCodeCoupon.voucherCodesDialog.checkBoxes.selectAll')}
      </Button>
      <Button
        className={classes.selectButton}
        disabled={isNoneVoucherCodesSelected}
        onClick={handleUnselectAll}
        size="small"
      >
        {t('uniqueCodeCoupon.voucherCodesDialog.checkBoxes.unselectAll')}
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  selectButtonContainer: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  selectButton: {
    textTransform: 'inherit',
    fontWeight: 400,
  },
}));

export default React.memo(VoucherCodesSelectButtons);
