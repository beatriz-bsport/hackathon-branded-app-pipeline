import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
// eslint-disable-next-line bsport/no-redux-in-component
import { useDispatch } from 'react-redux';
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Alert from '@material-ui/lab/Alert';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import { SIGN_ES_TERRITORY } from '#src/libs/invoice/types';
import type { TicketbaiTerritory } from '#src/libs/invoice/sign-es/ticketbai/types';
import { snackbarSuccess } from '#src/libs/snackbar/actions';

type Props = {
  territory: TicketbaiTerritory;
  deviceCertificateSerialNumber: string | null;
  isSetupConfirmed: boolean;
  setIsSetupConfirmed: (checked: boolean) => void;
  finalizeTicketbaiSetupError: Error | null;
  isTicketbaiSetupFinalized: boolean;
  finalizeTicketbaiSetupLoading: boolean;
  handleFinalizeTicketbai: () => void;
};

const TicketbaiDeviceSetupStep: React.FC<Props> = ({
  territory,
  deviceCertificateSerialNumber,
  isSetupConfirmed,
  setIsSetupConfirmed,
  finalizeTicketbaiSetupError,
  isTicketbaiSetupFinalized,
  finalizeTicketbaiSetupLoading,
  handleFinalizeTicketbai,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('b2b_invoice');
  const dispatch = useDispatch();

  const isGipuzkoaTerritory = territory === SIGN_ES_TERRITORY.GIPUZKOA;
  const canCopySerial =
    !!deviceCertificateSerialNumber &&
    typeof navigator !== 'undefined' &&
    !!navigator.clipboard?.writeText;

  const handleCopySerialNumber = async () => {
    if (!deviceCertificateSerialNumber || !canCopySerial) return;

    await navigator.clipboard.writeText(deviceCertificateSerialNumber);
    dispatch(snackbarSuccess(t('configuration.ticketbai.device.copy_success')));
  };

  return (
    <div>
      <Typography className={classes.deviceTitle} variant="h6">
        {t('configuration.ticketbai.device.title')}
      </Typography>
      <Typography className={classes.sectionSubtitle} variant="body2">
        <Trans
          components={[
            <a
              key="support-link"
              className={classes.supportLink}
              href="https://support.fiskaly.com/hc/es/articles/12429833140380-SIGN-ES-C%C3%B3mo-registrar-el-certificado-de-dispositivo-en-el-Pa%C3%ADs-Vasco"
              rel="noopener noreferrer"
              target="_blank"
            />,
          ]}
          i18nKey="configuration.ticketbai.device.subtitle"
          ns="b2b_invoice"
        />
      </Typography>

      <div className={classes.serialCard}>
        <div className={classes.serialContent}>
          <Typography className={classes.serialCaption} variant="caption">
            {t('configuration.ticketbai.device.serial_caption')}
          </Typography>
          <Typography className={classes.serialValue} variant="h6">
            {deviceCertificateSerialNumber ?? '—'}
          </Typography>
        </div>
        {deviceCertificateSerialNumber ? (
          <IconButton
            aria-label={t('configuration.ticketbai.device.copy_serial')}
            className={classes.copySerialButton}
            color="primary"
            disabled={!canCopySerial}
            onClick={handleCopySerialNumber}
            size="small"
          >
            <FileCopyIcon fontSize="small" />
          </IconButton>
        ) : null}
      </div>

      <Alert className={classes.infoAlert} severity="info">
        {isGipuzkoaTerritory ? (
          <Typography variant="body2">
            {t('configuration.ticketbai.device.gipuzkoa_notice')}
          </Typography>
        ) : (
          <>
            <Typography className={classes.infoAlertTitle} variant="subtitle2">
              {t('configuration.ticketbai.device.registration_notice_title')}
            </Typography>
            <Typography variant="body2">
              {t(
                'configuration.ticketbai.device.registration_notice_description',
              )}
            </Typography>
          </>
        )}
      </Alert>

      {!isTicketbaiSetupFinalized ? (
        <FormControlLabel
          className={classes.checkbox}
          control={
            <Checkbox
              checked={isSetupConfirmed}
              color="primary"
              onChange={(event) => setIsSetupConfirmed(event.target.checked)}
            />
          }
          label={t('configuration.ticketbai.device.complete_confirmation')}
        />
      ) : null}

      {finalizeTicketbaiSetupError ? (
        <Alert className={classes.alert} severity="error">
          {t('configuration.ticketbai.finalize.error')}
        </Alert>
      ) : null}

      {!isTicketbaiSetupFinalized ? (
        <Button
          className={classes.finalizeButton}
          color="primary"
          disabled={
            finalizeTicketbaiSetupLoading ||
            !isSetupConfirmed ||
            !deviceCertificateSerialNumber
          }
          onClick={handleFinalizeTicketbai}
          variant="contained"
        >
          {finalizeTicketbaiSetupLoading ? (
            <>
              <CircularProgress
                className={classes.finalizeSpinner}
                color="inherit"
                size={18}
              />
              {t('configuration.ticketbai.finalize.processing')}
            </>
          ) : (
            t('configuration.ticketbai.device.complete_cta')
          )}
        </Button>
      ) : null}
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  alert: {
    marginTop: theme.spacing(2),
    alignItems: 'center',
  },
  deviceTitle: {
    marginTop: theme.spacing(1),
    fontWeight: 590,
  },
  sectionSubtitle: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(0.5),
  },
  supportLink: {
    color: '#611a15',
    fontWeight: 700,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  serialCard: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  serialContent: {
    flex: 1,
    minWidth: 0,
  },
  serialCaption: {
    color: theme.palette.text.secondary,
  },
  serialValue: {
    marginTop: theme.spacing(0.5),
    fontFamily: 'monospace',
    fontWeight: 900,
    wordBreak: 'break-word',
  },
  copySerialButton: {
    marginLeft: 'auto',
    flexShrink: 0,
    padding: theme.spacing(1),
  },
  infoAlert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  infoAlertTitle: {
    fontWeight: 590,
  },
  checkbox: {
    display: 'flex',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(0.5),
  },
  finalizeButton: {
    marginTop: theme.spacing(2),
    gap: theme.spacing(1),
  },
  finalizeSpinner: {
    marginRight: theme.spacing(1),
  },
}));

export default TicketbaiDeviceSetupStep;
