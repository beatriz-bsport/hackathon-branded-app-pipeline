import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CSSProperties } from '@material-ui/styles';
import { useFormikContext } from 'formik';
import {
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  makeStyles,
} from '@material-ui/core';
import { CouponUniqueCodeEditModeOptions } from '@bsport/common/lib/master-data/coupon.js';
import { Alert } from '@material-ui/lab';
import InfoIcon from '@material-ui/icons/Info';
import FormSection from '#src/components/forms/FormSection';
import FileUploaderCustomized from '#src/components/FileUploaderCustomized';
import {
  Coupon,
  UniqueCodeCouponCreationPayload,
} from '#src/libs/coupon/types';
import { parseCSVFileToGetVoucherCodes } from '#src/libs/coupon/utils';
import Popover from '#src/components/Popover';

type Props = {
  isProcessing: boolean;
  uniqueCodeCoupon?: Coupon;
};

type ExtendedUniqueCodeCouponCreationPayload =
  UniqueCodeCouponCreationPayload & {
    update_mode?: CouponUniqueCodeEditModeOptions;
  };

const customStyle: CSSProperties = {
  height: '136px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '16px',
  borderWidth: 2,
  borderRadius: 5,
  border: 'none',
  backgroundColor: '#F8F8F8',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const UniqueCodeCouponFormUpload: React.FC<Props> = ({
  isProcessing,
  uniqueCodeCoupon,
}) => {
  const { t } = useTranslation('coupon');

  const classes = useStyles();

  const { setFieldValue, errors, validateField, setFieldError, values } =
    useFormikContext<ExtendedUniqueCodeCouponCreationPayload>();

  const [csvFile, setCsvFile] = useState<File>(null);

  const handleAddFile = useCallback(
    async (file: File) => {
      setCsvFile(file);
      try {
        const voucherCodes = await parseCSVFileToGetVoucherCodes(file);
        setFieldValue('codes', voucherCodes);
        validateField('codes');
      } catch (error) {
        setFieldError(
          'codes',
          t(`uniqueCodeCoupon.form.errors.fileUploader.${error.message}`),
        );
      }
    },
    [setFieldValue, validateField, setFieldError, t],
  );

  const handleOnChangeUpdateMode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFieldValue('update_mode', parseInt(event.target.value, 10));
    },
    [setFieldValue],
  );

  useEffect(() => {
    if (errors.codes) {
      setCsvFile(null);
    }
  }, [errors.codes]);

  const handleRemoveFile = useCallback(() => {
    setFieldValue('codes', []);
    setCsvFile(null);
  }, [setFieldValue]);

  return (
    <FormSection
      id="unique-code-coupon-form-upload"
      sectionTitle={t('uniqueCodeCoupon.form.fileUploader.title')}
    >
      {uniqueCodeCoupon && (
        <>
          <Alert
            className={classes.alert}
            id="unique-code-coupon-form-main-alert"
            severity="info"
          >
            {t('uniqueCodeCoupon.form.update.alertInfo', {
              count: uniqueCodeCoupon.nb_unique_codes,
            })}
          </Alert>
          <RadioGroup
            aria-label="Update mode"
            name="update_mode"
            onChange={handleOnChangeUpdateMode}
            value={values.update_mode}
          >
            <FormControlLabel
              control={<Radio disabled={isProcessing} />}
              label={t('uniqueCodeCoupon.form.update.append')}
              value={
                CouponUniqueCodeEditModeOptions.COUPON_UNIQUE_CODE_EDIT_MODE_APPEND
              }
            />
            <div className={classes.radioWithInfo}>
              <FormControlLabel
                control={<Radio disabled={isProcessing} />}
                label={t('uniqueCodeCoupon.form.update.replace')}
                value={
                  CouponUniqueCodeEditModeOptions.COUPON_UNIQUE_CODE_EDIT_MODE_REPLACE
                }
              />
              <Popover title={t('uniqueCodeCoupon.form.update.popover')}>
                <IconButton aria-label="info" size="medium">
                  <InfoIcon />
                </IconButton>
              </Popover>
            </div>
          </RadioGroup>
        </>
      )}
      <FileUploaderCustomized
        isFullWidth
        allowPreview={false}
        customClasses={classes}
        customStyle={customStyle}
        disabled={isProcessing}
        error={errors?.codes}
        file={csvFile}
        helperText={t('uniqueCodeCoupon.form.fileUploader.helperText')}
        label={t('uniqueCodeCoupon.form.fileUploader.label')}
        onAddFile={handleAddFile}
        onRemoveFile={handleRemoveFile}
        subtitle={t('uniqueCodeCoupon.form.fileUploader.sizeLimitHelper')}
      />
    </FormSection>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.text.primary,
  },
  folderIcon: {
    color: 'inherit',
  },
  alert: {
    alignItems: 'center',
  },
  radioWithInfo: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default React.memo(UniqueCodeCouponFormUpload);
