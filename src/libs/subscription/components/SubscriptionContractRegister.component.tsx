import React, { useMemo, useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import DialogContent from '@material-ui/core/DialogContent';
import { withState, withHandlers, compose } from 'recompose';
import moment from 'moment-timezone';
import MomentUtils from '@date-io/moment';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogActions from '@material-ui/core/DialogActions';
import type { Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DatePicker from 'material-ui-pickers/DatePicker';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';

// @ts-expect-error
import { Moment } from '../../../i18n';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

// @ts-expect-error
import SubscriptionPayment from './SubscriptionPayment.component';
import MemberSearchModal from '../../member/components/MemberSearchModal.component';
// @ts-expect-error
import SubscriptionContractListItem from './SubscriptionContractListItem.component';
import ContractTermsDialog from './contract/ContractTermsDialog.component';
import type { Establishment } from '../../establishment/types';
import type { StripeReader } from '#libs/terminal/types';
import type { Contract } from '../types';
import type { Member } from '../../member/types';
import type { PaymentMethod } from '../../payment/types';
import type { OptionCallback } from '../../../state/types';

type OwnProps = {
  member: Member | null;
  searchLoading?: boolean;
  searchedMembers?: Member[];
  searchMembers?: (txt: string) => void;
  onChangeMember?: (member: Member) => void;
  open: boolean;
  contractList?: Contract[];
  contract?: Contract;
  contractLoading?: boolean;
  onChangeContract?: (contract: Contract) => void;
  goToCustomSubscriptionForm?: () => void;
  enabledPaymentMethods: number[];
  onClose: () => void;
  requestSetupIntentSecret: () => void;
  savedPaymentMethodList: PaymentMethod[];
  refreshSavedPaymentMethodList: () => void;
  waiver: string;
  generalTermsAndConditions: string;
  establishments: Establishment[];
  enableMultiLocalization: boolean;
  stripeReaders: StripeReader[];
  companyId?: number;
  // the three next props are used in handler
  // eslint-disable-next-line
  onSuccess?: () => void;
  // eslint-disable-next-line
  onlinePaymentEnabled: boolean;
  // eslint-disable-next-line
  registerContractBackground: (
    id: number,
    data: any,
    options: OptionCallback,
  ) => void;
  withContractTermsCheckbox?: boolean;
};

type Props = OwnProps & {
  classes: { [className: string]: string };
  date: string | Moment;
  setDate: (date: string | Moment) => void;
  processing: boolean;
  onSubmit: (token: string) => void;
};

type PickerProps = {
  t: TFunction;
  classes: { [className: string]: string };
  open: boolean;
  contractList?: Contract[];
  contractLoading?: boolean;
  onChangeContract?: (contract: Contract) => void;
  onClose: () => void;
  goToCustomSubscriptionForm?: () => void;
};

const ContractPickerDialog = (props: PickerProps) => (
  <GenericResponsiveDialog maxWidth="sm" open={props.open}>
    <DialogTitle>{props.t('contract.registerManager.title')}</DialogTitle>
    <DialogContent>
      <Typography className={props.classes.contentText}>
        {props.t('contract.registerManager.explainChoseContract')}
      </Typography>
      {props.contractLoading ? <LinearProgress /> : null}
      {!props.contractLoading &&
      props.contractList &&
      props.contractList.length === 0 ? (
        <Typography variant="caption">
          {props.t('contract.list.isEmpty')}
        </Typography>
      ) : null}
      {!props.contractLoading &&
        props.contractList &&
        props.contractList.map((c) => (
          <SubscriptionContractListItem
            key={c.id}
            dense
            divider
            contract={c}
            onClick={() => props.onChangeContract?.(c)}
          />
        ))}
      {props.goToCustomSubscriptionForm ? (
        <Button
          className={props.classes.button}
          onClick={props.goToCustomSubscriptionForm}
          variant="outlined"
        >
          {props.t('contract.registerManager.explainCustomSubscriptionForm')}
        </Button>
      ) : null}
    </DialogContent>
    <DialogActions>
      <Button onClick={props.onClose}>
        {props.t('contract.registerManager.actions.cancel')}
      </Button>
    </DialogActions>
  </GenericResponsiveDialog>
);

export const SubscriptionContractRegister = (props: Props) => {
  const { t } = useTranslation('subscription');

  const [alertPickedDateInThePast, setAlertPickedDateInThePast] =
    useState(false);

  const [pickedDateInThePast, setPickedDateInThePast] = useState(false);

  const [showContractTermsDialog, setShowContractTermsDialog] = useState(false);

  useMemo(() => {
    setAlertPickedDateInThePast(
      moment(props.date).isBefore(moment().startOf('day')),
    );
    setPickedDateInThePast(
      moment(props.date).isBefore(moment().startOf('day')),
    );
  }, [props.date]);

  const openContractTermsDialog = React.useCallback(() => {
    setShowContractTermsDialog(true);
  }, []);

  const closeContractTermsDialog = React.useCallback(() => {
    setShowContractTermsDialog(false);
  }, []);

  const { onChangeMember } = props;

  const handleMemberSelected = React.useCallback(
    (id: number, member_: Member) => {
      onChangeMember?.(member_);
    },
    [onChangeMember],
  );

  if (!props.member) {
    return (
      <MemberSearchModal
        asManager
        generalTermsAndConditions={props.generalTermsAndConditions}
        handlMemberSelected={handleMemberSelected}
        loading={props.searchLoading}
        onClose={props.onClose}
        open={props.open}
        searchedMembers={props.searchedMembers || []}
        searchMembers={props.searchMembers}
        waiver={props.waiver}
      />
    );
  }
  if (!props.contract) {
    return (
      <ContractPickerDialog
        classes={props.classes}
        contractList={props.contractList}
        contractLoading={props.contractLoading}
        goToCustomSubscriptionForm={props.goToCustomSubscriptionForm}
        onChangeContract={props.onChangeContract}
        onClose={props.onClose}
        open={props.open}
        t={t}
      />
    );
  }

  return (
    <GenericResponsiveDialog maxWidth="sm" open={props.open}>
      <DialogTitle>{props.contract.name}</DialogTitle>
      <DialogContent>
        {pickedDateInThePast && (
          <Typography style={{ marginBottom: '16px' }} variant="h6">
            {t('contract.pastDate.futureInvoicesPayment')}
          </Typography>
        )}
        <GenericResponsiveDialog maxWidth="sm" open={alertPickedDateInThePast}>
          <DialogTitle>{t('contract.pastDate.title')}</DialogTitle>

          <DialogContent>
            {moment(props.date).isSame(moment(), 'month') ? (
              t('contract.pastDate.alertSameMonth', {
                lostDays: moment().diff(moment(props.date), 'days'),
              })
            ) : (
              <div className={props.classes.alertContent}>
                {t('contract.pastDate.alertDifferentMonth')}
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              onClick={() => {
                props.setDate(moment());
              }}
            >
              {t('contract.pastDate.cancel')}
            </Button>
            <Button
              color="primary"
              onClick={() => {
                setAlertPickedDateInThePast(false);
              }}
              variant="contained"
            >
              {t('contract.pastDate.validate')}
            </Button>
          </DialogActions>
        </GenericResponsiveDialog>
        <div className={props.classes.row}>
          <Typography className={props.classes.buttonLeftText}>
            {t('contract.actions.iwanttostarton')}
          </Typography>
          <MuiPickersUtilsProvider
            locale={Moment.locale()}
            moment={Moment}
            utils={MomentUtils}
          >
            <DatePicker
              required
              format="L"
              mask={(value) => {
                if (value) {
                  return [
                    /\d/,
                    /\d/,
                    '/',
                    /\d/,
                    /\d/,
                    '/',
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                  ];
                }
                return [];
              }}
              minDate={moment().subtract(1, 'years').format('YYYY-MM-DD')}
              onChange={props.setDate}
              value={props.date}
            />
          </MuiPickersUtilsProvider>
        </div>

        <Divider />
        <SubscriptionPayment
          forceEstablishmentSelection
          withCoupon
          withEstablishment
          withNote
          companyId={props.companyId}
          contract={props.contract}
          date={props.date}
          enabledPaymentMethods={props.enabledPaymentMethods}
          enableMultiLocalization={props.enableMultiLocalization}
          establishments={props.establishments}
          member={props.member}
          onCancel={props.onClose}
          onlinePaymentEnabled={props.onlinePaymentEnabled}
          onSubmit={props.onSubmit}
          openContractTermsDialog={openContractTermsDialog}
          pastInvoices={pickedDateInThePast}
          processing={props.processing}
          refreshSavedPaymentMethodList={props.refreshSavedPaymentMethodList}
          requestSetupIntentSecret={props.requestSetupIntentSecret}
          savedPaymentMethodList={props.savedPaymentMethodList}
          showContractTermsCheckbox={props.withContractTermsCheckbox}
          stripeReaders={props.stripeReaders}
        />
      </DialogContent>

      <ContractTermsDialog
        closeContractTermsDialog={closeContractTermsDialog}
        contractTerms={props.contract.contract}
        open={showContractTermsDialog}
      />
    </GenericResponsiveDialog>
  );
};

const styles = (theme: Theme) => ({
  row: {
    flexDirection: 'row' as 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  buttonLeftText: {
    marginRight: theme.spacing(1),
  },
  contentText: {
    paddingBottom: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(4),
  },
  alertContent: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: theme.spacing(2),
  },
});

export default compose<Props, OwnProps>(
  withStyles(styles),
  withState('date', 'setDate', moment().format('YYYY-MM-DD')),
  withState('processing', 'setProcessing', false),
  withHandlers({
    onSubmit:
      ({
        date,
        setProcessing,
        member,
        contract,
        onSuccess,
        registerContractBackground,
      }) =>
      async (
        token: string,
        paymentMethodId: string | null,
        isPaymentMethodForPastInvoicesSaved: boolean,
        paymentMethodPastInvoicesId: number | null,
        options: OptionCallback | null,
        coupon: string | null,
        note: string | null,
        billing_establishment_id: number | null,
      ) => {
        const first_billing_timestamp = moment(date, 'YYYY-MM-DD').unix();

        setProcessing(true);
        const data = {
          stripe_source: token,
          member: member.id,
          payment_method_id: paymentMethodId,
          is_payment_method_for_past_invoices_saved:
            isPaymentMethodForPastInvoicesSaved,
          payment_method_past_invoices_id: paymentMethodPastInvoicesId,
          coupon,
          first_billing_timestamp,
          note,
          billing_establishment_id,
          with_prorata: !!contract.month_billing_day,
        };
        registerContractBackground(contract.id, data, {
          onSuccess: () => {
            setProcessing(false);
            onSuccess && onSuccess();
          },
        });
      },
  }),
  React.memo,
)(SubscriptionContractRegister);
