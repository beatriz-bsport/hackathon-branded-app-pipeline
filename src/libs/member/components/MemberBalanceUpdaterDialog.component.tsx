import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import AlertIcon from '@material-ui/icons/Warning';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import PriceInput from '#components/input/PriceInput.component';
import { getCurrencyDisplay } from '#libs/theme/selectors';
import EstablishmentSelector from '#libs/establishment/components/EstablishmentSelector.component';
import type { Establishment } from '#libs/establishment/types';

type Props = {
  onSubmit: (amount: number, withoutPaymentNote: boolean) => void;
  open?: boolean;
  onClose: () => void;
  initialValue?: string;
  asManager: boolean;
  establishments: Array<Establishment>;
  establishmentLoading: boolean;
  setBillingEstablishmentId: (establishmentId: number) => void;
  billingEstablishmentId: number;
  enableMultiLocalization: boolean;
};

export const MemberBalanceUpdaterDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('invoice');

  const [balanceUpdateType, selectBalanceUpdateType] = React.useState(
    parseFloat(props.initialValue) < 0 ? 'topup' : 'decaissement',
  );
  const [balanceUpdateValue, selectBalanceUpdateValue] = React.useState(
    Math.abs(parseFloat(props.initialValue)),
  );
  const [withoutPaymentNote, setWithoutPaymentNote] = React.useState(false);
  const [missingValue, setMissingValue] = React.useState(false);

  return (
    <GenericResponsiveDialog
      open={props.open}
      onClose={props.onClose}
      maxWidth="xs"
    >
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          if (
            !withoutPaymentNote &&
            props.asManager &&
            props.enableMultiLocalization &&
            !props.billingEstablishmentId &&
            props.establishments?.length
          ) {
            setMissingValue(true);
          } else if (balanceUpdateType === 'decaissement') {
            props.onSubmit(-parseFloat(balanceUpdateValue), withoutPaymentNote);
          } else {
            props.onSubmit(parseFloat(balanceUpdateValue), withoutPaymentNote);
          }
        }}
      >
        <DialogTitle>{t('balance.updaterDialog.title')}</DialogTitle>
        <div className={classes.innerDialog}>
          <FormControl fullWidth>
            <InputLabel id="payment-method-select-label">
              {t('balance.updaterDialog.typeLabel')}
            </InputLabel>
            <Select
              id="balance-type-select"
              value={balanceUpdateType}
              style={{ minWidth: 200 }}
              onChange={(ev) => selectBalanceUpdateType(ev.target.value)}
              className={classes.field}
            >
              <MenuItem value="decaissement">
                {t('balance.updaterDialog.debt')}
              </MenuItem>
              <MenuItem value="topup">
                {t('balance.updaterDialog.topup')}
              </MenuItem>
            </Select>
            <PriceInput
              variant="outlined"
              className={classes.field}
              value={balanceUpdateValue}
              fullWidth
              onChange={(ev) => selectBalanceUpdateValue(ev.target.value)}
              label={t('balance.updaterDialog.balanceValueLabel')}
              InputProps={{
                inputProps: { step: 0.01, min: 0, max: 5000 },
              }}
            />
            <div className={classes.checkboxRow}>
              <Checkbox
                checked={withoutPaymentNote}
                onChange={(e, checked) => setWithoutPaymentNote(checked)}
              />
              <Typography variant="body2">
                {t('balance.updaterDialog.withoutPaymentNote.label')}
              </Typography>
            </div>
            {withoutPaymentNote && (
              <div className={classes.row}>
                <AlertIcon className={classes.iconLeft} />
                <Typography color="error" variant="caption">
                  {t('balance.updaterDialog.withoutPaymentNote.warning')}
                </Typography>
              </div>
            )}
            {!withoutPaymentNote &&
              props.asManager &&
              props.enableMultiLocalization && (
                <div>
                  <Typography variant="h6">
                    {t('section.invoiceItemList.billing_establishment')}
                  </Typography>
                  <Divider className={classes.divider} />
                  <EstablishmentSelector
                    establishments={props.establishments}
                    isLoading={props.establishmentLoading}
                    isOptionDisabled
                    selectOption={(item: { value: number; label: string }) => {
                      props.setBillingEstablishmentId(item ? item.value : null);
                      setMissingValue(!item);
                    }}
                    selectedEstablishments={[props.billingEstablishmentId]}
                    noMulti
                    closeMenuOnSelect
                    isRequired
                    requiredValueIsMissing={missingValue}
                  />
                </div>
              )}
          </FormControl>

          <DialogContentText>
            <div className={classes.field}>
              <Typography>
                {balanceUpdateType === 'decaissement'
                  ? t('balance.updaterDialog.explainDecaissement', {
                      amount: balanceUpdateValue,
                      currencyDisplay: getCurrencyDisplay(),
                    })
                  : t('balance.updaterDialog.explainTopup', {
                      amount: balanceUpdateValue,
                      currencyDisplay: getCurrencyDisplay(),
                    })}
              </Typography>
            </div>
          </DialogContentText>
        </div>
        <DialogActions>
          <Button onClick={props.onClose}>
            {t('balance.updaterDialog.actions.cancel')}
          </Button>
          <Button disabled={!balanceUpdateValue} color="primary" type="submit">
            {t('balance.updaterDialog.actions.submit')}
          </Button>
        </DialogActions>
      </form>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  field: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  checkboxRow: {
    marginTop: theme.spacing(1),
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  innerDialog: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
    maxWidth: 400,
  },
}));

export default MemberBalanceUpdaterDialog;
