// @flow
import React from 'react';
import { compose, withProps, withState } from 'recompose';

import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';

import moment from 'moment';
import MemberSummaryCard from '../../libs/member/components/MemberSummaryCard.component';
import MemberForm from '../../libs/member/MemberForm.component';
import PaymentIntentGathering from '../../libs/payment/components/PaymentByPaymentIntent.component';
import PaymentForm from '../../libs/checkout/components/PaymentForm.component';
import {
  createOrUpdateMember,
  fetchMember as fetchMemberAction,
  regularizeDebt as regularizeDebtAction,
} from '../../libs/member/actions';
import { MemberMap } from '../../libs/member/utils';
import themeSelectors from '../../libs/theme/selectors';

import { mapFormData, unmap } from '../form.utils';

import type { Membership } from '../../libs/membership/types';
import type { Member } from '../../libs/member/types';
import type { Theme } from '../../libs/theme/types';

type Props = {
  fetchMember: (number) => void,
  membership: Membership,
  member: ?Member,
  editMember: (boolean) => void,
  setEditMember: (boolean) => void,
  theme: Theme,
  onSubmit: (data: *) => void,
  snackbarSuccess: (string) => void,
};

export class ConsumerProfile extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchMember(this.props.membership.id);
  }

  render() {
    const initial = this.props.member;
    const initialData = initial
      ? {
          ...unmap(initial, MemberMap),
          rgpd: [],
          date_joined: moment(initial.date_joined),
        }
      : {
          birthday: null,
          gender: 'F',
        };

    if (initialData && initial) {
      if (initial.phone_number) {
        initialData.phone = initial.phone_number;
      }
      if (initial.accept_email) {
        initialData.rgpd.push('accept_email');
      }
      if (initial.accept_sms) {
        initialData.rgpd.push('accept_sms');
      }
      delete initialData.address;
    } else {
      initialData.rgpd = ['accept_email', 'accept_sms'];
    }
    // <PaymentIntentGathering submitPaymentIntent={console.log} />
    return (
      <div>
        <MemberSummaryCard
          memberId={this.props.membership.id}
          member={this.props.member}
          hideContactButton
          editMember={() => this.props.setEditMember(true)}
        />
        {this.props.member && this.props.member.credit_account_balance < 0 && (
          <Button
            color="primary"
            onClick={() => this.props.setDebtRegularizerOpen(true)}
            variant="contained"
          >
            HMM
          </Button>
        )}
        <Dialog open={this.props.debtRegularizerOpen}>
          <DialogContent>
            {this.props.member ? (
              <div>
                <div className={this.props.classes.priceContainer}>
                  <Typography variant="h4">
                    {-this.props.member.credit_account_balance} €
                  </Typography>
                </div>
                <PaymentForm
                  onCancel={() => this.props.setDebtRegularizerOpen(false)}
                  availablePaymentMethods={[0]}
                  submitPayment={(data, options) =>
                    this.props.regularizeDebt(this.props.membership.id, data, {
                      onSuccess: (response) => {
                        if (options && options.onSuccess) {
                          options.onSuccess(response);
                        }
                        this.props.fetchMember(this.props.membership.id);
                        this.props.setDebtRegularizerOpen(false);
                      },
                      onError: (err) => {
                        if (options && options.onError) {
                          options.onError(err);
                        }
                      },
                    })
                  }
                />
              </div>
            ) : (
              <CircularProgress />
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={this.props.editMember}>
          <MemberForm
            hideManagerStuff
            onCancel={() => this.props.setEditMember(false)}
            memberId={this.props.membership.id}
            theme={this.props.theme}
            onSubmit={this.props.onSubmit}
            initial={initialData}
            snackbarSuccess={this.props.snackbarSuccess}
          />
        </Dialog>
      </div>
    );
  }
}

const styles = (theme) => ({
  priceContainer: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing.unit * 4,
    margin: theme.spacing.unit * 2,
    minWidth: 280,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default compose(
  withStyles(styles),
  connect(
    (state) => ({
      memberLoading: state.member.loading,
      member: state.member.member,
      theme: themeSelectors.getTheme(state),
    }),
    {
      fetchMember: fetchMemberAction,
      regularizeDebt: regularizeDebtAction,
      upsertMember: (id, data, options) =>
        createOrUpdateMember(id, data, options),
    },
  ),
  withState('editMember', 'setEditMember', false),
  withState('debtRegularizerOpen', 'setDebtRegularizerOpen', false),
  withProps(({ upsertMember, setEditMember, membership, fetchMember }) => ({
    onSubmit: (values, options) => {
      if (!values.birthday) {
        // eslint-disable-next-line
        delete values.birthday;
      }
      const formData = mapFormData(values, MemberMap);

      formData.append('id', membership.id);

      upsertMember(membership.id, formData, {
        ...options,
        onSuccess: () => {
          fetchMember(membership.id);
          setEditMember(false);
          options.onSuccess();
        },
      });
    },
  })),
)(ConsumerProfile);
