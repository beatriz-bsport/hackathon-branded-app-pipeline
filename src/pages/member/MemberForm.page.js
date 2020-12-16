// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { TFunction } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { push as pushRouter, goBack } from 'connected-react-router';
import { compose, withProps } from 'recompose';
import moment from 'moment-timezone';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { snackbar } from '../../actions/snackbar.actions';
import MemberForm from '../../libs/member/MemberForm.component';
import { createOrUpdateMember, fetchMember } from '../../libs/member/actions';
import { getMember } from '../../libs/member/selectors';
import { getLatest as getLatestMember } from '../../libs/member/api';
import { MemberMap } from '../../libs/member/utils';
import themeSelectors from '../../libs/theme/selectors.ts';

import { mapFormData, unmap } from '../form.utils';
import withTitle from '../../hocs/with-title.hoc';

type Props = {
  id: number,
  theme: Object,
  initial: *,
  fetchMemberInitial: () => void,
  goToMember: (id: number) => void,
  goToMerge: (id: number, existingId: number) => void,
  goToMemberList: () => void,
  snackbarSuccess: (msg: string) => void,
  onSubmit: (*) => void,
  onCancel: () => void,
  country: string,
};

export class MemberFormPage extends Component<Props> {
  async componentDidMount() {
    if (this.props.id) {
      this.props.fetchMemberInitial(this.props.id);
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
      <Paper>
        <MemberForm
          onCancel={onCancel}
          memberId={id}
          theme={this.props.theme}
          onSubmit={onSubmit}
          initial={initialData}
          goToMember={this.props.goToMember}
          goToMerge={this.props.goToMerge}
          goToMemberList={this.props.goToMemberList}
          snackbarSuccess={this.props.snackbarSuccess}
          country={this.props.country}
        />
      </Paper>
    );
  }
}

export default compose(
  withTranslation(),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state, { id }) => ({
      id,
      errors: state.member.upsert.error,
      initial: id !== null ? getMember(state, id) : null,
      theme: themeSelectors.getTheme(state),
      country: state.theme.theme.locale.split('_')[1],
    }),
    {
      fetchMemberInitial: fetchMember,
      upsertMember: createOrUpdateMember,
      onCancel: goBack,
      goToMember: (pk) => pushRouter(`/member/${pk}/`),
      goToMerge: (memberPk, existingMemberPk) =>
        pushRouter(`/member/merge/${memberPk}/into/${existingMemberPk}`),
      goToMemberList: () => pushRouter('/member'),
      snackbarSuccess: snackbar.success,
    },
  ),
  withProps(({ upsertMember, initial, goToMember, goToMemberList }) => ({
    onSubmit: (values, options) => {
      if (!values.birthday) {
        // eslint-disable-next-line
        delete values.birthday;
      }
      const formData = mapFormData(values, MemberMap);

      if (initial) {
        formData.append('id', initial.id);
      }

      upsertMember(initial ? initial.id : null, formData, {
        ...options,
        onSuccess: () => {
          if (initial && initial.id) {
            goToMember(initial.id);
          } else {
            getLatestMember()
              .then((res) => goToMember(res.data))
              .catch((err) => {
                console.error(err);
                goToMemberList();
              });
          }
          options.onSuccess();
        },
      });
    },
  })),
  withTitle(({ t }: { t: TFunction }) => t('titles:member.memberFormPage')),
)(MemberFormPage);
