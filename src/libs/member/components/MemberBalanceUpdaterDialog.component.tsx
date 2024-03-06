// @ts-nocheck
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
import type {
  Establishment,
  EstablishmentBillingGroup,
} from '#libs/establishment/types';
import EstablishmentBillingGroupSelector from '#libs/establishment/components/EstablishmentBillingGroupSelector';
import ObjectLevelPermissionProviderComponent from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

type Props = {
  onSubmit: (amount: number, withoutPaymentNote: boolean) => void;
  open?: boolean;
  onClose: () => void;
  initialValue?: string;
  asManager: boolean;
  establishmentBillingGroups: Array<Establishment>;
  establishmentBillingGroupsLoading: boolean;
  setSelectedEstablishmentBillingGroup: (establishmentId: number) => void;
  selectedEstablishmentBillingGroup: number;
  enableMultiLocalization: boolean;
};

export const MemberBalanceUpdaterDialog: React.FC<Props> = ({
  asManager,
  enableMultiLocalization,
  establishmentBillingGroups,
  establishmentBillingGroupsLoading,
  initialValue,
  onSubmit,
  onClose,
  open,
  selectedEstablishmentBillingGroup,
  setSelectedEstablishmentBillingGroup,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('invoice');

  const [balanceUpdateType, selectBalanceUpdateType] = React.useState(
    parseFloat(initialValue) < 0 ? 'topup' : 'decaissement',
  );
  const [balanceUpdateValue, selectBalanceUpdateValue] = React.useState(
    Math.abs(parseFloat(initialValue)),
  );
  const [withoutPaymentNote, setWithoutPaymentNote] = React.useState(false);
  const [missingValue, setMissingValue] = React.useState(false);

  const handleSelectEstablishmentBillingGroup = React.useCallback(
    (item: EstablishmentBillingGroup) => {
      setSelectedEstablishmentBillingGroup(item || null);
      setMissingValue(!item);
    },
    [setMissingValue, setSelectedEstablishmentBillingGroup],
  );

  return (
    <GenericResponsiveDialog maxWidth="xs" onClose={onClose} open={open}>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          if (
            !withoutPaymentNote &&
            asManager &&
            enableMultiLocalization &&
            !selectedEstablishmentBillingGroup &&
            establishmentBillingGroups?.length
          ) {
            setMissingValue(true);
          } else if (balanceUpdateType === 'decaissement') {
            onSubmit(-parseFloat(balanceUpdateValue), withoutPaymentNote);
          } else {
            onSubmit(parseFloat(balanceUpdateValue), withoutPaymentNote);
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
              className={classes.field}
              id="balance-type-select"
              onChange={(ev) => selectBalanceUpdateType(ev.target.value)}
              style={{ minWidth: 200 }}
              value={balanceUpdateType}
            >
              <MenuItem value="decaissement">
                {t('balance.updaterDialog.debt')}
              </MenuItem>
              <MenuItem value="topup">
                {t('balance.updaterDialog.topup')}
              </MenuItem>
            </Select>
            <PriceInput
              fullWidth
              className={classes.field}
              InputProps={{
                inputProps: { step: 0.01, min: 0, max: 5000 },
              }}
              label={t('balance.updaterDialog.balanceValueLabel')}
              onChange={(ev) => selectBalanceUpdateValue(ev.target.value)}
              value={balanceUpdateValue}
              variant="outlined"
            />

            <ObjectLevelPermissionProviderComponent requiredPermission="billing.allowed_actions.editBalanceWithoutInvoice">
              {(canOmitInvoice: boolean) =>
                canOmitInvoice && (
                  <div className={classes.checkboxRow}>
                    <Checkbox
                      checked={withoutPaymentNote}
                      onChange={(e, checked) => setWithoutPaymentNote(checked)}
                    />
                    <Typography variant="body2">
                      {t('balance.updaterDialog.withoutPaymentNote.label')}
                    </Typography>
                  </div>
                )
              }
            </ObjectLevelPermissionProviderComponent>
            {withoutPaymentNote && (
              <div className={classes.row}>
                <AlertIcon className={classes.iconLeft} />
                <Typography color="error" variant="caption">
                  {t('balance.updaterDialog.withoutPaymentNote.warning')}
                </Typography>
              </div>
            )}
            {!withoutPaymentNote && asManager && enableMultiLocalization && (
              <div>
                <Typography variant="h6">
                  {t('section.invoiceItemList.billingGroup')}
                </Typography>
                <Divider className={classes.divider} />
                <EstablishmentBillingGroupSelector
                  closeMenuOnSelect
                  isOptionDisabled
                  isRequired
                  noMulti
                  establishmentBillingGroups={establishmentBillingGroups}
                  isLoading={establishmentBillingGroupsLoading}
                  requiredValueIsMissing={missingValue}
                  selectedEstablishmentBillingGroup={
                    selectedEstablishmentBillingGroup
                  }
                  selectOption={handleSelectEstablishmentBillingGroup}
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
          <Button onClick={onClose}>
            {t('balance.updaterDialog.actions.cancel')}
          </Button>
          <Button color="primary" disabled={!balanceUpdateValue} type="submit">
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
