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
  <GenericResponsiveDialog open={props.open} maxWidth="sm">
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
            contract={c}
            divider
            dense
            onClick={() => props.onChangeContract?.(c)}
          />
        ))}
      {props.goToCustomSubscriptionForm ? (
        <Button
          variant="outlined"
          className={props.classes.button}
          onClick={props.goToCustomSubscriptionForm}
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
        open={props.open}
        loading={props.searchLoading}
        searchedMembers={props.searchedMembers || []}
        searchMembers={props.searchMembers}
        onClose={props.onClose}
        handlMemberSelected={handleMemberSelected}
        waiver={props.waiver}
        generalTermsAndConditions={props.generalTermsAndConditions}
      />
    );
  }
  if (!props.contract) {
    return (
      <ContractPickerDialog
        t={t}
        classes={props.classes}
        open={props.open}
        contractList={props.contractList}
        contractLoading={props.contractLoading}
        onChangeContract={props.onChangeContract}
        onClose={props.onClose}
        goToCustomSubscriptionForm={props.goToCustomSubscriptionForm}
      />
    );
  }

  return (
    <GenericResponsiveDialog open={props.open} maxWidth="sm">
      <DialogTitle>{props.contract.name}</DialogTitle>
      <DialogContent>
        {pickedDateInThePast && (
          <Typography variant="h6" style={{ marginBottom: '16px' }}>
            {t('contract.pastDate.futureInvoicesPayment')}
          </Typography>
        )}
        <GenericResponsiveDialog open={alertPickedDateInThePast} maxWidth="sm">
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
              onClick={() => {
                props.setDate(moment());
              }}
              color="secondary"
            >
              {t('contract.pastDate.cancel')}
            </Button>
            <Button
              onClick={() => {
                setAlertPickedDateInThePast(false);
              }}
              variant="contained"
              color="primary"
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
            utils={MomentUtils}
            moment={Moment}
            locale={Moment.locale()}
          >
            <DatePicker
              value={props.date}
              onChange={props.setDate}
              format="L"
              required
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
            />
          </MuiPickersUtilsProvider>
        </div>

        <Divider />
        <SubscriptionPayment
          contract={props.contract}
          onCancel={props.onClose}
          member={props.member}
          date={props.date}
          onSubmit={props.onSubmit}
          processing={props.processing}
          requestSetupIntentSecret={props.requestSetupIntentSecret}
          savedPaymentMethodList={props.savedPaymentMethodList}
          refreshSavedPaymentMethodList={props.refreshSavedPaymentMethodList}
          enabledPaymentMethods={props.enabledPaymentMethods}
          onlinePaymentEnabled={props.onlinePaymentEnabled}
          withNote
          withCoupon
          withEstablishment
          forceEstablishmentSelection
          enableMultiLocalization={props.enableMultiLocalization}
          establishments={props.establishments}
          stripeReaders={props.stripeReaders}
          pastInvoices={pickedDateInThePast}
          companyId={props.companyId}
          showContractTermsCheckbox={props.withContractTermsCheckbox}
          openContractTermsDialog={openContractTermsDialog}
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
