import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableCell,
  TableRow,
  Typography,
  TableHead,
  TableBody,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import type { Coupon, UniqueCodeState } from '#src/libs/coupon/types';
import { VOUCHER_CODE_TABLE_PAGE_SIZE } from '#src/libs/coupon/constants';
import VoucherCodesRowItem from './VoucherCodesRowItem.component';
import VoucherCodesSelectButtons from '../VoucherCodesSelectors/VoucherCodesSelectButtons.component';

export type Props = {
  availableUniqueCodes: string[];
  allCodes: string[];
  displayedCodes: string[];
  setDisplayedCodes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedVoucherCodes: string[];
  setSelectedVoucherCodes: React.Dispatch<React.SetStateAction<string[]>>;
  isListEmpty: boolean;
  uniqueCodeCoupon: Coupon;
};

const VoucherCodesTable: React.FC<Props> = ({
  availableUniqueCodes,
  allCodes,
  displayedCodes,
  setDisplayedCodes,
  selectedVoucherCodes,
  setSelectedVoucherCodes,
  isListEmpty,
  uniqueCodeCoupon,
}) => {
  const { t } = useTranslation('coupon');
  const classes = useStyles();

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (allCodes) {
      return setDisplayedCodes(allCodes.slice(0, VOUCHER_CODE_TABLE_PAGE_SIZE));
    }
    return () => {
      setDisplayedCodes([]);
    };
  }, [allCodes, setDisplayedCodes]);

  const pageCount = useMemo(() => {
    if (allCodes?.length > 1) {
      return Math.ceil((allCodes.length - 1) / VOUCHER_CODE_TABLE_PAGE_SIZE);
    }
    return 1;
  }, [allCodes?.length]);

  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, page: number) => {
      if (allCodes && (page >= 1 || page <= allCodes?.length)) {
        const codesToDisplay = allCodes.slice(
          page * VOUCHER_CODE_TABLE_PAGE_SIZE - VOUCHER_CODE_TABLE_PAGE_SIZE,
          page * VOUCHER_CODE_TABLE_PAGE_SIZE,
        );
        setDisplayedCodes(codesToDisplay);
        setCurrentPage(page);
      }
    },
    [setDisplayedCodes, allCodes],
  );

  const filteredAvailableUniqueCodes =
    uniqueCodeCoupon &&
    Object.keys(uniqueCodeCoupon.available_unique_codes).reduce<{
      [key: string]: UniqueCodeState;
    }>((acc, key) => {
      if (availableUniqueCodes.includes(key)) {
        acc[key] = uniqueCodeCoupon.available_unique_codes[key];
      }
      return acc;
    }, {});

  if (isListEmpty) {
    return (
      <div className={classes.emptyTableBody}>
        <Typography className={classes.emptyMessage}>
          <InfoOutlinedIcon />
          {t('uniqueCodeCoupon.voucherCodesDialog.noResult')}
        </Typography>
      </div>
    );
  }
  return (
    <>
      <VoucherCodesSelectButtons
        allCodes={allCodes}
        selectedVoucherCodes={selectedVoucherCodes}
        setSelectedVoucherCodes={setSelectedVoucherCodes}
      />
      <Table aria-label="simple table" padding="normal" size="small">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableContainerWithoutBorderBottom}>
              <Typography variant="subtitle1">
                {t('uniqueCodeCoupon.voucherCodesDialog.header.codes')}
              </Typography>
            </TableCell>
            <TableCell
              align="right"
              className={classes.tableContainerWithoutBorderBottom}
            >
              <Typography variant="subtitle1">
                {t('uniqueCodeCoupon.voucherCodesDialog.header.status')}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedCodes.map((code) => (
            <VoucherCodesRowItem
              key={code}
              codeStatus={filteredAvailableUniqueCodes[code]}
              selectedVoucherCodes={selectedVoucherCodes}
              setSelectedVoucherCodes={setSelectedVoucherCodes}
              voucherCode={code}
            />
          ))}
        </TableBody>
      </Table>
      <div className={classes.paginationIndicator}>
        <Pagination
          count={pageCount}
          onChange={handlePageChange}
          page={currentPage}
        />
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  emptyTableBody: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: theme.spacing(9),
  },
  emptyMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    background: theme.palette.grey[200],
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(
      1,
    )}px ${theme.spacing(1)}px`,
    borderRadius: theme.spacing(4),
  },
  tableContainerWithoutBorderBottom: {
    borderBottom: 'none',
    paddingLeft: theme.spacing(3),
  },
  paginationIndicator: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    '& li': {
      listStyleType: 'unset',
    },
  },
}));

export default React.memo(VoucherCodesTable);
