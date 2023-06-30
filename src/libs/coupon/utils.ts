import moment from 'moment-timezone';
import {
  UNIQUE_CODE_PER_USAGE_COUPON_UPLOAD_FILE_TOO_LARGE_ERROR,
  UNIQUE_CODE_PER_USAGE_COUPON_UPLOAD_NOT_CSV_FILE_ERROR,
  UNIQUE_CODE_PER_USAGE_COUPON_UPLOAD_INCORRECT_DATA_ERROR,
  VOUCHER_CODE_CSV_FILE_MIME_TYPE,
  VOUCHER_CODE_CSV_FILE_SIZE_LIMIT_IN_BYTES,
  VOUCHER_CODE_CHARACTERS_NUMBER_LIMIT,
} from './constants';
import type { Coupon } from './types';

export const isCurrentlyActive: (coupon: Coupon) => boolean = (coupon) =>
  coupon.is_active &&
  (coupon.expiration_date
    ? moment(coupon.expiration_date).isSameOrAfter(moment(), 'day')
    : true);

export const extractVoucherCodesFromCSVString = (csvFileAsString: string) => {
  if (csvFileAsString.includes(',')) {
    return UNIQUE_CODE_PER_USAGE_COUPON_UPLOAD_INCORRECT_DATA_ERROR;
  }
  const formatedString = csvFileAsString.replace('\r\n', '\n');
  const codes = formatedString
    .slice(formatedString.indexOf('\n'))
    .split('\n')
    .filter((row) => !!row.length);
  const isSomeCodeTooLong = codes.some(
    (code) => code.length > VOUCHER_CODE_CHARACTERS_NUMBER_LIMIT,
  );
  if (isSomeCodeTooLong) {
    return UNIQUE_CODE_PER_USAGE_COUPON_UPLOAD_INCORRECT_DATA_ERROR;
  }
  return codes;
};

export const parseCSVFileToGetVoucherCodes = async (csvFile: File) => {
  if (!csvFile) {
    return null;
  }
  if (csvFile.size > VOUCHER_CODE_CSV_FILE_SIZE_LIMIT_IN_BYTES) {
    return UNIQUE_CODE_PER_USAGE_COUPON_UPLOAD_FILE_TOO_LARGE_ERROR;
  }
  if (csvFile.type !== VOUCHER_CODE_CSV_FILE_MIME_TYPE) {
    return UNIQUE_CODE_PER_USAGE_COUPON_UPLOAD_NOT_CSV_FILE_ERROR;
  }
  const csvAsString = await csvFile.text();
  const voucherCodes = extractVoucherCodesFromCSVString(csvAsString);
  return voucherCodes;
};
