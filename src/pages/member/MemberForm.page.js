// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import type { TFunction } from 'react-i18next';
import { withNamespaces } from 'react-i18next';
import { Paper, CircularProgress } from '@material-ui/core';

import { goBack } from 'react-router-redux';
import { compose, withProps } from 'recompose';
import { createOrUpdateMember, quickFetch } from '../../actions/member.actions';
import withDrawer from '../../hocs/with-drawer.hoc';
import MemberForm from '../../libs/member/MemberForm.component';

import { mapFormData, unmap } from '../form.utils';

type Props = {
  id: ?number,
  initial: *,
  fetchMemberInitial: () => void,
  onSubmit: (*) => void,
  onCancel: () => void,
};

const MemberMap = {
  lastname: 'last_name',
  firstname: 'first_name',
  email: 'email',
  address_line_1: 'address.address_line_1',
  address_line_2: 'address.address_line_2',
  zipcode: 'address.zipcode',
  city: 'address.city',
  country: 'address.country',
  phone: 'phone.phone_number',
  gender: 'gender',
  avatar: 'photo',
  birthdayYear: 'birthday',
  membership_ID: 'membership_ID',
  rgpd: 'rgpd',
  date_joined: 'date_joined',
  address: 'address',
};

export class MemberFormPage extends Component<Props> {
  async componentDidMount() {
    if (this.props.id) {
      this.props.fetchMemberInitial();
    }
  }

  render() {
    const { initial, id, onCancel, onSubmit } = this.props;
    if (id && !initial) {
      return <CircularProgress />;
    }
    const initialData = initial
      ? {
          ...unmap(initial, MemberMap),
          rgpd: [],
          birthdayYear:
            initial && initial.birthday ? initial.birthday.slice(0, 4) : null,
        }
      : {};

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
      <Paper>
        <MemberForm
          onCancel={onCancel}
          onSubmit={onSubmit}
          initial={initialData}
        />
      </Paper>
    );
  }
}

function mapStateToProps(state, nextProps) {
  const { match } = nextProps;
  const id = (match && match.params && +match.params.id) || null;
  return {
    id,
    errors: state.member.upsert.error,
    initial:
      id !== null ? state.member.quickFetched.find((m) => m.id === id) : null,
  };
}
function mapDispatchToProps(dispatch, { id }) {
  return {
    fetchMemberInitial() {
      dispatch(quickFetch(id));
    },
    upsertMember(data, options) {
      console.log(data);
      dispatch(createOrUpdateMember(data, false, options));
    },
    onCancel() {
      dispatch(goBack());
    },
  };
}

export default compose(
  withNamespaces(),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.memberFormPage')),
  withProps(({ upsertMember, initial }) => ({
    onSubmit: (values, options) => {
      console.log(values);
      if (
        values.address_line_1 ||
        values.address_line_2 ||
        values.city ||
        values.zipcode ||
        values.country
      ) {
        if (
          !values.address_line_1 ||
          !values.city ||
          !values.zipcode ||
          !values.country
        ) {
          // eslint-disable-next-line
          delete values.address_line_1;
          // eslint-disable-next-line
          delete values.address_line_2;
          // eslint-disable-next-line
          delete values.city;
          // eslint-disable-next-line
          delete values.zipcode;
          // eslint-disable-next-line
          delete values.country;
        }
      }
      const formData = mapFormData(values, MemberMap);

      if (initial) {
        formData.append('id', initial.id);
      }

      upsertMember(formData, options);
    },
  })),
)(MemberFormPage);
