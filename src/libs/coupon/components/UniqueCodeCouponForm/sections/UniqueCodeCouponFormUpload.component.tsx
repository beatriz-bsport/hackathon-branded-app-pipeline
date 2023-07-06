import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CSSProperties, makeStyles } from '@material-ui/styles';
import { useFormikContext } from 'formik';
import { Theme } from '@material-ui/core';
import FormSection from '#components/forms/FormSection';
import FileUploaderCustomized from '#components/FileUploaderCustomized';
import { UniqueCodeCouponCreationPayload } from '#libs/coupon/types';
import { parseCSVFileToGetVoucherCodes } from '#libs/coupon/utils';

type Props = {
  isProcessing: boolean;
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

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    color: theme.palette.text.primary,
  },
  folderIcon: {
    color: 'inherit',
  },
}));

const UniqueCodeCouponFormUpload: React.FC<Props> = ({ isProcessing }) => {
  const { t } = useTranslation('coupon');

  const classes = useStyles();

  const { setFieldValue, errors, validateField, setFieldError } =
    useFormikContext<UniqueCodeCouponCreationPayload>();

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

export default React.memo(UniqueCodeCouponFormUpload);
