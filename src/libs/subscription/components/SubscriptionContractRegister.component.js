// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { withState, withHandlers, compose } from 'recompose';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { Elements, StripeProvider } from 'react-stripe-elements';

import DatePicker from 'material-ui-pickers/DatePicker';
import SubscriptionPayment from './SubscriptionPayment.component';
import MemberSearchModal from '../../member/components/MemberSearchModal.component';
import Config from '../../../config';

import { postContractSubscription as postContractSubscriptionAPI } from '../api';

import SubscriptionContractListItem from './SubscriptionContractListItem.component';

const STRIPE_KEY = Config.REACT_APP_STRIPE_PK_KEY;

type Props = {
  t: TFunction,
  classes: Object,

  member: ?Member,
  searchLoading: boolean,
  searchedMembers: Array<Member>,
  searchMembers: (txt: string) => void,
  onChangeMember: (Member) => void,

  open: boolean,
  date: string,
  setDate: (string) => void,
  processing: boolean,

  contractList: ?Array<Contract>,
  contract: ?Contract,
  contractLoading: boolean,
  onChangeContract: (Contract) => void,
  goToCustomSubscriptionForm: () => void,

  onSubmit: (token: string) => void,
  onClose: () => void,
};

const ContractPickerDialog = (props: {
  t: TFunction,
  classes: Object,
  open: boolean,
  contractList: ?Array<Contract>,
  contractLoading: boolean,
  onChangeContract: (Contract) => void,
  onClose: () => void,
  goToCustomSubscriptionForm: () => void,
}) => (
  <Dialog open={props.open}>
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
  </Dialog>
);

export const SubscriptionContractRegistrationManagerDialog = (props: Props) => {
  if (!props.member) {
    return (
      <MemberSearchModal
        open={props.open}
        loading={props.searchLoading}
        searchedMembers={props.searchedMembers || []}
        searchMembers={props.searchMembers}
        onClose={props.onClose}
        handlMemberSelected={(id, member_) => props.onChangeMember(member_)}
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
  return (
    <Dialog open={props.open}>
      <DialogTitle>{props.contract.name}</DialogTitle>
      <DialogContent>
        <div className={props.classes.row}>
          <Typography className={props.classes.buttonLeftText}>
            {props.t('contract.actions.iwanttostarton')}
          </Typography>

          <DatePicker
            value={props.date}
            onChange={props.setDate}
            format="DD/MM/YYYY"
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
            disablePast
          />
        </div>

        <Divider />
        <StripeProvider apiKey={STRIPE_KEY}>
          <Elements>
            <SubscriptionPayment
              contract={props.contract}
              onCancel={props.onClose}
              member={props.member}
              onSubmit={props.onSubmit}
              processing={props.processing}
            />
          </Elements>
        </StripeProvider>
      </DialogContent>
    </Dialog>
  );
};

const styles = (theme) => ({
  row: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 2,
  },
  buttonLeftText: {
    marginRight: theme.spacing.unit,
  },
  contentText: {
    paddingBottom: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit * 4,
  },
});

export default compose(
  withNamespaces(['subscription']),
  withStyles(styles),
  withState('date', 'setDate', moment().format('YYYY-MM-DD')),
  withState('processing', 'setProcessing', false),
  withHandlers({
    onSubmit: ({ date, setProcessing, member, contract, onSuccess }) => async (
      token: string,
    ) => {
      const first_billing_timestamp = moment(date, 'YYYY-MM-DD').unix();
      setProcessing(true);
      try {
        await postContractSubscriptionAPI(contract.id, {
          stripe_source: token,
          member: member.id,
          first_billing_timestamp: moment(first_billing_timestamp).unix(),
        });
      } catch (err) {
        console.error(err);
      }
      setProcessing(false);
      onSuccess();
    },
  }),
)(SubscriptionContractRegistrationManagerDialog);
