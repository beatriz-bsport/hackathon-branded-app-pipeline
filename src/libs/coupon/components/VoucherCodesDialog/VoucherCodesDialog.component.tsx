import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import classNames from 'classnames';
import type { OptionCallback } from '../../../../state/types';
import VoucherCodesTable from './VoucherCodesList/VoucherCodesTable.component';
import VoucherCodeSearch from './VoucherCodesSelectors/VoucherCodeSearch.component';
import VoucherCodesFilter from './VoucherCodesSelectors/VoucherCodesFilter.component';
import type { Coupon } from '#libs/coupon/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  uniqueCodeCoupon: Coupon;
  markCodeAsRedeemed: (
    id: string | number,
    codes: string[],
    options?: OptionCallback<Coupon>,
  ) => void;
  exportAsCsv: (
    id: string | number,
    codes: string[],
    options?: OptionCallback<string>,
  ) => void;
};

const VoucherCodesDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  isLoading,
  uniqueCodeCoupon,
  markCodeAsRedeemed,
  exportAsCsv,
}) => {
  const { t } = useTranslation('coupon');

  const classes = useStyles();

  const [availableUniqueCodes, setAvailableUniqueCodes] = useState<string[]>(
    [],
  );

  const allCodes = useMemo(
    () => availableUniqueCodes ?? [],
    [availableUniqueCodes],
  );

  const [codes, setCodes] = useState<string[]>(allCodes);

  const [displayedCodes, setDisplayedCodes] = useState<string[]>([]);

  const [selectedVoucherCodes, setSelectedVoucherCodes] = useState<string[]>(
    [],
  );

  useEffect(() => {
    if (uniqueCodeCoupon?.available_unique_codes) {
      setAvailableUniqueCodes(
        Object.keys(uniqueCodeCoupon.available_unique_codes),
      );
    }
  }, [uniqueCodeCoupon, uniqueCodeCoupon?.available_unique_codes]);

  const handleMarkCodesAsRedeemed = useCallback(() => {
    markCodeAsRedeemed(uniqueCodeCoupon?.id, selectedVoucherCodes);
  }, [markCodeAsRedeemed, uniqueCodeCoupon?.id, selectedVoucherCodes]);

  const handleExportAsCsv = useCallback(() => {
    exportAsCsv(uniqueCodeCoupon?.id, codes);
  }, [exportAsCsv, uniqueCodeCoupon?.id, codes]);

  const isRedeemedButtonDisabled =
    isLoading || selectedVoucherCodes?.length === 0;

  const isListEmpty =
    !availableUniqueCodes ||
    allCodes?.length === 0 ||
    displayedCodes?.length === 0;

  return (
    <Dialog
      classes={{ paper: classNames({ [classes.dialog]: !isListEmpty }) }}
      onClose={onClose}
      open={isOpen}
    >
      <DialogTitle>{t('fabLabels.voucherCodes')}</DialogTitle>
      <DialogContent>
        <VoucherCodeSearch allCodes={allCodes} setCodes={setCodes} />
        <VoucherCodesFilter
          setAvailableUniqueCodes={setAvailableUniqueCodes}
          uniqueCodeCoupon={uniqueCodeCoupon}
        />
        <VoucherCodesTable
          allCodes={codes}
          availableUniqueCodes={availableUniqueCodes}
          displayedCodes={displayedCodes}
          isListEmpty={isListEmpty}
          selectedVoucherCodes={selectedVoucherCodes}
          setDisplayedCodes={setDisplayedCodes}
          setSelectedVoucherCodes={setSelectedVoucherCodes}
          uniqueCodeCoupon={uniqueCodeCoupon}
        />
        <DialogActions>
          <Button disabled={isLoading} onClick={onClose} variant="text">
            {t('uniqueCodeCoupon.voucherCodesDialog.close')}
          </Button>
          <Button
            disabled={isRedeemedButtonDisabled}
            onClick={handleMarkCodesAsRedeemed}
            startIcon={<CheckCircleIcon />}
            variant="outlined"
          >
            {t('uniqueCodeCoupon.voucherCodesDialog.markAsRedeemed', {
              count: selectedVoucherCodes?.length,
            })}
          </Button>
          <Button
            color="primary"
            disabled={isLoading}
            onClick={handleExportAsCsv}
            startIcon={<CloudDownloadIcon />}
            variant="contained"
          >
            {t('uniqueCodeCoupon.voucherCodesDialog.export')}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialog: {
    height: `calc(100% - ${theme.spacing(8)}px)`,
  },
}));

export default React.memo(VoucherCodesDialog);
