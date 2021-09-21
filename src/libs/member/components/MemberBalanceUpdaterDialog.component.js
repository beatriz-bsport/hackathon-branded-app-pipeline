// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
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
import PriceInput from '../../../components/input/PriceInput.component';
import { getCurrencyDisplay } from '../../theme/selectors';
import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';
import type { Establishment } from '../../establishment/types';

type Props = {
  onSubmit: (any) => void,
  open: ?boolean,
  onClose: () => void,
  initialValue: ?string,
  asManager: boolean,
  establishments: Array<Establishment>,
  establishmentLoading: boolean,
  setBillingEstablishmentId: (establiemtnId: number) => void,
  billingEstablishmentId: Number,
  enableMultiLocalization: boolean,
};

export const MemberBalanceUpdaterDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  const [balanceUpdateType, selectBalanceUpdateType] = React.useState(
    parseFloat(props.initialValue) < 0 ? 'topup' : 'decaissement',
  );
  const [balanceUpdateValue, selectBalanceUpdateValue] = React.useState(
    Math.abs(parseFloat(props.initialValue)),
  );
  const [withoutPaymentNote, setWithoutPaymentNote] = React.useState(false);

  return (
    <Dialog open={props.open}>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          if (balanceUpdateType === 'decaissement') {
            props.onSubmit(-parseFloat(balanceUpdateValue), withoutPaymentNote);
          } else {
            props.onSubmit(parseFloat(balanceUpdateValue), withoutPaymentNote);
          }
        }}
      >
        <DialogTitle>{t('balance.updaterDialog.title')}</DialogTitle>
        <div className={classes.innerDialog}>
          <FormControl>
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
              <MenuItem fullWidth value="decaissement">
                {t('balance.updaterDialog.debt')}
              </MenuItem>
              <MenuItem fullWidth value="topup">
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
                <div className={classes.sectionEstablishmentBilling}>
                  <Typography variant="h6" className={classes.sectionTitle}>
                    {t('section.invoiceItemList.billing_establishment')}
                  </Typography>
                  <Divider className={classes.divider} />

                  <EstablishmentSelector
                    establishments={props.establishments}
                    isClearable
                    isLoading={props.establishmentLoading}
                    isOptionDisabled
                    selectOption={(item: { value: number, label: string }) => {
                      props.setBillingEstablishmentId(item ? item.value : null);
                    }}
                    selectedEstablishments={[props.billingEstablishmentId]}
                    noMulti
                    closeMenuOnSelect
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
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  field: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  checkboxRow: {
    marginTop: theme.spacing(1),
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  innerDialog: {
    padding: theme.spacing(2),
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
