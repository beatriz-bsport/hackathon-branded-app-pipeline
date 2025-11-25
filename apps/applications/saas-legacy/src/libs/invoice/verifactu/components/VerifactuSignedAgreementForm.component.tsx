import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Alert from '@material-ui/lab/Alert';
import type { PlatformCustomerEntityRepresentative } from '#src/libs/platform-billing/type';
import VerifactuRepresentativeDetails from '#src/libs/invoice/verifactu/components/VerifactuRepresentativeDetails.component';

type VerifactuSignedAgreementFormProps = {
  representative: PlatformCustomerEntityRepresentative | null;
  onEdit: () => void;
  onDownloadPDF: () => void;
  onUploadPDF: (file: File) => Promise<void>;
  isUploading?: boolean;
};

const VerifactuSignedAgreementForm: React.FC<
  VerifactuSignedAgreementFormProps
> = ({
  representative,
  onEdit,
  onDownloadPDF,
  onUploadPDF,
  isUploading = false,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('b2b_invoice');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!representative) {
    return null;
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <VerifactuRepresentativeDetails
        onEdit={onEdit}
        representative={representative}
      />

      <div className={classes.agreementSection}>
        <Typography className={classes.title} variant="h5">
          {t('configuration.verifactu.signed_agreement.agreement_title')}
        </Typography>
        <Typography className={classes.agreementSubtitle} variant="body2">
          {t('configuration.verifactu.signed_agreement.agreement_subtitle')}
        </Typography>

        <div className={classes.stepsContainer}>
          <div className={classes.stepRow}>
            <div className={classes.stepNumber}>1</div>
            <Typography variant="body2">
              {t('configuration.verifactu.signed_agreement.step1_text')}
            </Typography>
            <Button
              color="primary"
              onClick={onDownloadPDF}
              size="small"
              startIcon={<SaveAltIcon />}
              variant="outlined"
            >
              {t('configuration.verifactu.signed_agreement.download_pdf')}
            </Button>
          </div>

          <div className={classes.stepRow}>
            <div className={classes.stepNumber}>2</div>
            <Typography variant="body2">
              {t('configuration.verifactu.signed_agreement.step2_text')}
            </Typography>
          </div>

          <div className={classes.stepRow}>
            <div className={classes.stepNumber}>3</div>
            <Typography variant="body2">
              {t('configuration.verifactu.signed_agreement.step3_text')}
            </Typography>
            {selectedFile ? (
              <div className={classes.uploadedFileContainer}>
                <Typography
                  className={classes.uploadedFileName}
                  variant="body2"
                >
                  {selectedFile.name}
                </Typography>
                <IconButton
                  aria-label="remove file"
                  onClick={handleRemoveFile}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            ) : (
              <Button
                color="primary"
                onClick={() => fileInputRef.current?.click()}
                size="small"
                startIcon={<CloudUploadIcon />}
                variant="outlined"
              >
                {t('configuration.verifactu.signed_agreement.upload_pdf')}
              </Button>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          accept=".pdf"
          className={classes.hiddenInput}
          onChange={handleFileSelect}
          type="file"
        />

        <Alert className={classes.alert} severity="info">
          {t('configuration.verifactu.signed_agreement.upload_info')}
        </Alert>

        <div className={classes.submitContainer}>
          <Button
            color="primary"
            disabled={!selectedFile || isUploading}
            onClick={() => selectedFile && onUploadPDF(selectedFile)}
            variant="contained"
          >
            {t('configuration.verifactu.signed_agreement.send_document')}
          </Button>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  title: {
    fontWeight: 590,
    fontSize: theme.spacing(2),
  },
  agreementSection: {
    marginTop: theme.spacing(3),
  },
  agreementSubtitle: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
  },
  stepsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  stepRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  stepNumber: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: 6,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 700,
    fontSize: 12,
    lineHeight: 18,
  },
  hiddenInput: {
    display: 'none',
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
  submitContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  uploadedFileContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  uploadedFileName: {
    color: theme.palette.text.primary,
  },
}));

export default VerifactuSignedAgreementForm;
