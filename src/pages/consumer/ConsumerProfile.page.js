// @flow
import React from 'react';
import { compose, withProps, withState } from 'recompose';

import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';

import moment from 'moment';
import MemberSummaryCard from '../../libs/member/components/MemberSummaryCard.component';
import MemberForm from '../../libs/member/MemberForm.component';
import {
  createOrUpdateMember,
  fetchMember as fetchMemberAction,
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
    return (
      <div>
        <MemberSummaryCard
          memberId={this.props.membership.id}
          member={this.props.member}
          hideContactButton
          editMember={() => this.props.setEditMember(true)}
        />
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

export default compose(
  connect(
    (state) => ({
      memberLoading: state.member.loading,
      member: state.member.member,
      theme: themeSelectors.getTheme(state),
    }),
    {
      fetchMember: fetchMemberAction,
      upsertMember: (id, data, options) =>
        createOrUpdateMember(id, data, options),
    },
  ),
  withState('editMember', 'setEditMember', false),
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
