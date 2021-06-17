// @flow
import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import moment from 'moment-timezone';
import MemberSummaryCard from '../../libs/member/components/MemberSummaryCard.component';
import MemberPaymentMethodPanel from '../../libs/member/components/MemberPaymentMethodPanel.component';
import MemberForm from '../../libs/member/MemberForm.component';
import {
  createOrUpdateMember,
  fetchMember as fetchMemberAction,
} from '../../libs/member/actions';
import {
  fetchPaymentMethodList,
  detachPaymentMethod,
} from '../../libs/payment/actions';
import { MemberMap } from '../../libs/member/utils';
import themeSelectors from '../../libs/theme/selectors';

import { mapFormData, unmap } from '../form.utils';
import { getMemberDetail } from '../../libs/member/selectors';

import type { Membership } from '../../libs/membership/types';
import type { Member } from '../../libs/member/types';
import type { Theme } from '../../libs/theme/types';
import {
  snackbarWarning,
  snackbarSuccess,
} from '../../actions/snackbar.actions';

type Props = {
  fetchMember: (number) => void,
  membership: Membership,
  member: ?Member,
  editMember: (boolean) => void,
  setEditMember: (boolean) => void,
  theme: Theme,
  classes: Object,
  onUpdateMember: (data: *) => void,
  snackbarSuccess: (string) => void,
  country: string,
  fetchMemberPaymentMethod: (memberId: str) => void,
  paymentMethodLoading: boolean,
  detachPaymentMethodLoading: boolean,
  paymentMethod: Array<any>,
  detachPaymentMethod: (pm_id: string) => void,
  snackbarErrorMsg: (msg: string) => void,
  snackbarSuccessMsg: (msg: string) => void,
};

export class ConsumerProfile extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchMember(this.props.membership.id);
    this.props.fetchMemberPaymentMethod();
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

    return (
      <Grid container className={this.props.classes.flexGrid} spacing={2}>
        <Grid item xs={12} md={6}>
          <MemberSummaryCard
            memberId={this.props.membership.id}
            member={this.props.member}
            hideContactButton
            hideCreditAccount
            editMember={() => this.props.setEditMember(true)}
          />
        </Grid>

        <Dialog open={this.props.editMember}>
          <MemberForm
            hideManagerStuff
            onCancel={() => this.props.setEditMember(false)}
            memberId={this.props.membership.id}
            theme={this.props.theme}
            onSubmit={this.props.onUpdateMember}
            initial={initialData}
            snackbarSuccess={this.props.snackbarSuccess}
            country={this.props.country}
          />
        </Dialog>
        <Grid item xs={12} md={6}>
          <Paper className={this.props.classes.paymentContainer}>
            <MemberPaymentMethodPanel
              memberId={this.props.membership.id}
              paymentMethod={this.props.paymentMethod}
              paymentMethodLoading={this.props.paymentMethodLoading}
              detachPaymentMethod={this.props.detachPaymentMethod}
              detachPaymentMethodLoading={this.props.detachPaymentMethodLoading}
              snackbarErrorMsg={this.props.snackbarErrorMsg}
              snackbarSuccess={this.props.snackbarSuccessMsg}
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  flexGrid: {
    flexGrow: 1,
    spacing: theme.spacing(2),
  },
  paymentContainer: {
    padding: theme.spacing(2),
  },
});
export default compose(
  connect(
    (state, { membership }) => ({
      memberLoading: state.member.loading,
      member: getMemberDetail(state, membership.id),
      theme: themeSelectors.getTheme(state),
      country: state.theme.theme.locale.split('_')[1],
      paymentMethod: state.paymentBackend.paymentMethod.items,
      paymentMethodLoading: state.paymentBackend.paymentMethod.loading,
      detachPaymentMethodLoading:
        state.paymentBackend.detachPaymentMethod.loading,
    }),
    {
      fetchMember: fetchMemberAction,
      upsertMember: (id, data, options) =>
        createOrUpdateMember(id, data, options),
      fetchPaymentMethodListActions: fetchPaymentMethodList,
      detachPaymentMethodAction: detachPaymentMethod,
      snackbarErrorMsg: snackbarWarning,
      snackbarSuccessMsg: snackbarSuccess,
    },
  ),
  withTranslation(['snackbar']),
  withState('editMember', 'setEditMember', false),
  withStyles(styles),
  withHandlers({
    onUpdateMember: ({
      upsertMember,
      setEditMember,
      membership,
      fetchMember,
    }) => (values, options) => {
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
  }),
  withHandlers({
    fetchMemberPaymentMethod: ({
      fetchPaymentMethodListActions,
      membership,
    }) => () => {
      fetchPaymentMethodListActions({ member: membership.id });
    },
  }),
  withHandlers({
    detachPaymentMethod: ({
      detachPaymentMethodAction,
      fetchPaymentMethodListActions,
      snackbarErrorMsg,
      snackbarSuccessMsg,
      membership,
      t,
    }) => (pm_id, options) => {
      detachPaymentMethodAction(
        { member: membership.id, payment_method_id: pm_id },
        {
          onSuccess: () => {
            fetchPaymentMethodListActions({ member: membership.id });
            snackbarSuccessMsg(t('paymentMethod.detach.pm_deleted'));
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: (data) => {
            snackbarErrorMsg(t(`paymentMethod.detach.${data}`));
          },
        },
      );
    },
  }),
)(ConsumerProfile);
