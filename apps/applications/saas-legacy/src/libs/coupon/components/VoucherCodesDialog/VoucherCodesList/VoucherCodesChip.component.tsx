import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@material-ui/core/styles';
import { UniqueCodeStateStatus } from '@bsport/common/lib/master-data/coupon.js';
import { CustomChip } from '#src/components/chip/CustomChip.component';
import type { UniqueCodeState } from '#src/libs/coupon/types';

type Props = {
  code: UniqueCodeState;
};

const VoucherCodesChip: React.FC<Props> = ({ code }) => {
  const { t } = useTranslation('coupon');

  const theme = useTheme();

  const green = theme.palette.success.main;

  const yellow = theme.palette.warning.main;

  switch (code.status) {
    case UniqueCodeStateStatus.USED:
      return (
        <CustomChip
          displayedValue={t(
            'uniqueCodeCoupon.voucherCodesDialog.selector.pending',
          )}
          icon="HourglassFull"
          mainColor={yellow}
        />
      );
    case UniqueCodeStateStatus.REDEEMED:
      return (
        <CustomChip
          displayedValue={t(
            'uniqueCodeCoupon.voucherCodesDialog.selector.redeemed',
          )}
          icon="CheckCircle"
          mainColor={green}
        />
      );
    case UniqueCodeStateStatus.AVAILABLE:
    case UniqueCodeStateStatus.LOCKED:
      return (
        <CustomChip
          displayedValue={t(
            'uniqueCodeCoupon.voucherCodesDialog.selector.notUsed',
          )}
          icon="Cancel"
          mainColor={null}
        />
      );
    default:
      break;
  }
  return null;
};

export default React.memo(VoucherCodesChip);
