// @flow
import React, { useMemo, useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import DialogContent from '@material-ui/core/DialogContent';
import { withState, withHandlers, compose } from 'recompose';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withTranslation, TFunction } from 'react-i18next';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import { Moment } from '../../../i18n';

import SubscriptionPayment from './SubscriptionPayment.component';
import MemberSearchModal from '../../member/components/MemberSearchModal.component';

import SubscriptionContractListItem from './SubscriptionContractListItem.component';
import { Establishment } from '../../establishment/types';
import { StripeReader } from '#libs/terminal/types';
import { Contract } from '../types';
import { Member } from '../../member/types';
import { PaymentMethod } from '../../payment/types';

type Props = {
  t: TFunction;
  classes: Object;

  member: Member | null;
  searchLoading: boolean;
  searchedMembers: Array<Member>;
  searchMembers: (txt: string) => void;
  onChangeMember: (Member) => void;

  open: boolean;
  date: string;
  setDate: (string) => void;
  processing: boolean;

  contractList?: Array<Contract>;
  contract?: Contract;
  contractLoading: boolean;
  onChangeContract: (Contract) => void;
  goToCustomSubscriptionForm: () => void;
  enabledPaymentMethods: Array<number>;

  onSubmit: (token: string) => void;
  onClose: () => void;

  requestSetupIntentSecret: () => void;
  savedPaymentMethodList: Array<PaymentMethod>;
  refreshSavedPaymentMethodList: () => void;
  waiver: string;
  generalTermsAndConditions: string;
  establishments: Array<Establishment>;
  enableMultiLocalization: boolean;
  stripeReaders: StripeReader[];

  onlinePaymentEnabled: boolean;
};

type PickerProps = {
  t: TFunction;
  classes: Object;
  open: boolean;
  contractList?: Array<Contract>;
  contractLoading: boolean;
  onChangeContract: (Contract) => void;
  onClose: () => void;
  goToCustomSubscriptionForm: () => void;
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
            onClick={() => props.onChangeContract(c)}
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

export const SubscriptionContractRegistrationManagerDialog = (props: Props) => {
  const [alertPickedDateInThePast, setAlertPickedDateInThePast] =
    useState(false);
  const [pickedDateInThePast, setPickedDateInThePast] = useState(false);

  useMemo(() => {
    setAlertPickedDateInThePast(
      moment(props.date).isBefore(moment().startOf('day')),
    );
    setPickedDateInThePast(
      moment(props.date).isBefore(moment().startOf('day')),
    );
  }, [props.date]);

  if (!props.member) {
    return (
      <MemberSearchModal
        asManager
        open={props.open}
        loading={props.searchLoading}
        searchedMembers={props.searchedMembers || []}
        searchMembers={props.searchMembers}
        onClose={props.onClose}
        handlMemberSelected={(id, member_) => props.onChangeMember(member_)}
        waiver={props.waiver}
        generalTermsAndConditions={props.generalTermsAndConditions}
      />
    );
  }
  if (!props.contract) {
    return (
      <ContractPickerDialog
        t={props.t}
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
  // console.log('---------TIMEONZE BROWSER --------');
  // console.log(moment.tz.guess());
  // console.log(moment(props.date, 'YYYY-MM-DD'));
  // console.log(moment(props.date, 'YYYY-MM-DD').unix());

  // console.log('---------TIMEONZE Europe/Dubli --------');
  // console.log(moment(props.date, 'YYYY-MM-DD').tz('Europe/Dublin'));
  // console.log(
  //   moment
  //     .tz(
  //       moment(props.date, 'YYYY-MM-DD').tz('Europe/Dublin').unix(),
  //       'Europe/Dublin',
  //     )
  //     .unix() * 1000,
  // );

  return (
    <GenericResponsiveDialog open={props.open} maxWidth="sm">
      <DialogTitle>{props.contract.name}</DialogTitle>
      <DialogContent>
        {pickedDateInThePast && (
          <Typography variant="h6" style={{ marginBottom: '16px' }}>
            {props.t('contract.pastDate.futureInvoicesPayment')}
          </Typography>
        )}
        <GenericResponsiveDialog open={alertPickedDateInThePast} maxWidth="sm">
          <DialogTitle>{props.t('contract.pastDate.title')}</DialogTitle>

          <DialogContent>
            {moment(props.date).isSame(moment(), 'month') ? (
              props.t('contract.pastDate.alertSameMonth', {
                lostDays: moment().diff(moment(props.date), 'days'),
              })
            ) : (
              <div className={props.classes.alertContent}>
                {props.t('contract.pastDate.alertDifferentMonth')}
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
              {props.t('contract.pastDate.cancel')}
            </Button>
            <Button
              onClick={() => {
                setAlertPickedDateInThePast(false);
              }}
              variant="contained"
              color="primary"
            >
              {props.t('contract.pastDate.validate')}
            </Button>
          </DialogActions>
        </GenericResponsiveDialog>
        <div className={props.classes.row}>
          <Typography className={props.classes.buttonLeftText}>
            {props.t('contract.actions.iwanttostarton')}
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
              returnMoment={false}
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
          enableMultiLocalization={props.enableMultiLocalization}
          establishments={props.establishments}
          stripeReaders={props.stripeReaders}
          pastInvoices={pickedDateInThePast}
        />
      </DialogContent>
    </GenericResponsiveDialog>
  );
};

const styles = (theme) => ({
  row: {
    flexDirection: 'row',
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
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['subscription']),
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
        paymentMethodId?: string,
        isPaymentMethodForPastInvoicesSaved: boolean,
        paymentMethodPastInvoicesId?: string,
        options,
        coupon,
        note,
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
        };
        registerContractBackground(contract.id, data, {
          onSuccess: () => {
            setProcessing(false);
            onSuccess && onSuccess();
          },
        });
      },
  }),
)(SubscriptionContractRegistrationManagerDialog);
