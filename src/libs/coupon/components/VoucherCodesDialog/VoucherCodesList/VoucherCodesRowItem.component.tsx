import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TableCell, TableRow, Typography } from '@material-ui/core';
import type { UniqueCodeState } from '#libs/coupon/types';
import VoucherCodesCheckBox from './VoucherCodesCheckBox.component';
import VoucherCodesChip from './VoucherCodesChip.component';

type Props = {
  voucherCode: string;
  codeStatus: UniqueCodeState;
  selectedVoucherCodes: string[];
  setSelectedVoucherCodes: React.Dispatch<React.SetStateAction<string[]>>;
};

const VoucherCodesRowItem: React.FC<Props> = ({
  voucherCode,
  codeStatus,
  selectedVoucherCodes,
  setSelectedVoucherCodes,
}) => {
  const classes = useStyles();
  if (!voucherCode || !codeStatus) {
    return null;
  }
  return (
    <TableRow key={voucherCode}>
      <TableCell component="th" scope="row">
        <div className={classes.tableCellVoucherCode}>
          <VoucherCodesCheckBox
            selectedVoucherCodes={selectedVoucherCodes}
            setSelectedVoucherCodes={setSelectedVoucherCodes}
            voucherCode={voucherCode}
          />
          <Typography variant="body1">{voucherCode}</Typography>
        </div>
      </TableCell>
      <TableCell align="right">
        <VoucherCodesChip code={codeStatus} />
      </TableCell>
    </TableRow>
  );
};

const useStyles = makeStyles((theme) => ({
  tableCellVoucherCode: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  loader: {
    height: theme.spacing(20),
  },
}));

export default React.memo(VoucherCodesRowItem);
