// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { withState, compose } from 'recompose';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { Elements, StripeProvider } from 'react-stripe-elements';

import DatePicker from 'material-ui-pickers/DatePicker';
import SubscriptionPayment from './SubscriptionPayment.component';
import MemberSearchModal from '../../member/components/MemberSearchModal.component';
import Config from '../../../config';

const STRIPE_KEY = Config.REACT_APP_STRIPE_PK_KEY;

type Props = {
  t: TFunction,
  selectedMember: ?Member,
  open: boolean,
  searchLoading: boolean,
  searchedMembers: Array<Member>,
  searchMembers: (txt: string) => void,
  onClose: () => void,
  setSelectedMember: (?Member) => void,
  classes: Object,
  contract: ?Contract,
  date: string,
  setDate: (string) => void,
  onSubmit: (any) => void,
  processing: boolean,
};
export const SubscriptionContractRegistrationManagerDialog = (props: Props) => {
  if (!props.selectedMember) {
    return (
      <MemberSearchModal
        open={props.open}
        loading={props.searchLoading}
        searchedMembers={props.searchedMembers}
        searchMembers={props.searchMembers}
        onClose={props.onClose}
        handlMemberSelected={(id, member) => props.setSelectedMember(member)}
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
              member={props.selectedMember}
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
});

export default compose(
  withNamespaces(['subscription']),
  withStyles(styles),
  withState('selectedMember', 'setSelectedMember', null),
  withState('date', 'setDate', moment().format('YYYY-MM-DD')),
)(SubscriptionContractRegistrationManagerDialog);
