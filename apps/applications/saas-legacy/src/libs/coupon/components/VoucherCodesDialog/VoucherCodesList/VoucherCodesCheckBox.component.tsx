import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Checkbox } from '@material-ui/core';

type Props = {
  voucherCode: string;
  selectedVoucherCodes: string[];
  setSelectedVoucherCodes: React.Dispatch<React.SetStateAction<string[]>>;
};

const VoucherCodesCheckBox: React.FC<Props> = ({
  voucherCode,
  selectedVoucherCodes,
  setSelectedVoucherCodes,
}) => {
  const classes = useStyles();

  const handleCheckVoucherCode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => {
      if (isChecked) {
        return setSelectedVoucherCodes([...selectedVoucherCodes, voucherCode]);
      }
      return setSelectedVoucherCodes(
        selectedVoucherCodes?.filter((code) => code !== voucherCode),
      );
    },
    [setSelectedVoucherCodes, selectedVoucherCodes, voucherCode],
  );

  const isVoucherCodeChecked = selectedVoucherCodes?.includes(voucherCode);

  return (
    <div className={classes.alignCenter}>
      <Checkbox
        checked={isVoucherCodeChecked}
        onChange={handleCheckVoucherCode}
      />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default React.memo(VoucherCodesCheckBox);
