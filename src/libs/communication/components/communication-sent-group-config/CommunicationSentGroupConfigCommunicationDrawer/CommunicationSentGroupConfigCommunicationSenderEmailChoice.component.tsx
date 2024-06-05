import {
  FormControl,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useFormikContext } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Select from 'react-select';
import { SenderEmailKind } from '#src/libs/communication/constants';
import { FranchiseCompany } from '#src/libs/franchise/types';
import { Values } from './CommunicationSentGroupConfigCommunicationDrawer.component';

type Props = {
  franchisorCustomDomain: string | null;
  companies: FranchiseCompany[];
};

export const CommunicationSentGroupConfigCommunicationSenderEmailChoice: React.FC<
  Props
> = ({ franchisorCustomDomain, companies }) => {
  const { t } = useTranslation(['communication', 'campaign']);
  const classes = useStyles();
  const { values, setFieldValue } = useFormikContext<Values>();

  const customEmailOnTextChange = useCallback(
    (event) => setFieldValue('senderCustomEmailUsername', event.target.value),
    [setFieldValue],
  );

  const franchiseeEmailOnChange = useCallback(
    (selected) => setFieldValue('senderEmail', selected.value),
    [setFieldValue],
  );

  const handleSwitchSenderEmailKindFranchisee = useCallback(() => {
    setFieldValue('senderEmailKind', SenderEmailKind.franchisee);
    setFieldValue('senderCustomEmailUsername', '');
  }, [setFieldValue]);

  const handleSwitchSenderEmailKindCustomEmail = useCallback(
    () => setFieldValue('senderEmailKind', SenderEmailKind.customEmail),
    [setFieldValue],
  );

  const senderEmailOptions = useMemo(
    () =>
      ([...companies] || []).map((company) => ({
        value: company.email,
        label: company.email,
      })),
    [companies],
  );

  return (
    <div className={classes.emailRadioContainer}>
      <Alert className={classes.alert} severity="info">
        <Typography variant="subtitle1">
          {t('campaign:mail.chooseSender')}
        </Typography>
      </Alert>
      <div className={classes.row}>
        <FormControlLabel
          classes={{ label: classes.center }}
          control={
            <Radio
              checked={values.senderEmailKind === SenderEmailKind.franchisee}
              onChange={handleSwitchSenderEmailKindFranchisee}
            />
          }
          label={t('campaign:mail.franchiseeMail')}
          labelPlacement="end"
        />
        <FormControl className={classes.select} variant="outlined">
          <Select
            defaultValue={senderEmailOptions[0]}
            isDisabled={values.senderEmailKind === SenderEmailKind.customEmail}
            menuPlacement="auto"
            name="senderEmailFranchisee"
            onChange={franchiseeEmailOnChange}
            options={senderEmailOptions}
          />
        </FormControl>
      </div>
      <div className={classes.row}>
        <FormControlLabel
          classes={{ label: classes.center }}
          control={
            <Radio
              checked={values.senderEmailKind === SenderEmailKind.customEmail}
              onChange={handleSwitchSenderEmailKindCustomEmail}
            />
          }
          disabled={!franchisorCustomDomain}
          label={t('campaign:mail.customEmail')}
          labelPlacement="end"
        />
        <TextField
          disabled={
            !franchisorCustomDomain ||
            values.senderEmailKind === SenderEmailKind.franchisee
          }
          name="emailSender"
          onChange={customEmailOnTextChange}
          placeholder={t('campaign:mail.example')}
          required={values.senderEmailKind === SenderEmailKind.customEmail}
          value={values.senderCustomEmailUsername}
          variant="standard"
        />
        <span style={{ alignSelf: 'center' }}>
          {franchisorCustomDomain ? `@${franchisorCustomDomain}` : null}
        </span>
      </div>
      {!franchisorCustomDomain && (
        <Alert className={classes.alert} severity="warning">
          <Typography variant="subtitle1">
            <Trans i18nKey="campaign:mail.customDomainNotDefined" t={t}>
              You did not define a custom domain.
              <br />
              Please get in touch with our team to initiate the configuration
              process.
            </Trans>
          </Typography>
        </Alert>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  center: {
    textAlign: 'center',
  },
  row: { display: 'flex', flexDirection: 'row' },
  alert: { marginBottom: theme.spacing(2), alignItems: 'center' },
  emailRadioContainer: { display: 'flex', flexDirection: 'column' },
  buttonContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
  select: { minWidth: '200px' },
}));

export default React.memo(
  CommunicationSentGroupConfigCommunicationSenderEmailChoice,
);
