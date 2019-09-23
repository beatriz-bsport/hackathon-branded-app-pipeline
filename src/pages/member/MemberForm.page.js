// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import type { TFunction } from 'react-i18next';
import { withNamespaces } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { push as pushRouter, goBack } from 'react-router-redux';
import { compose, withProps } from 'recompose';
import moment from 'moment';
import { snackbar } from '../../actions/snackbar.actions';
import MemberForm from '../../libs/member/MemberForm.component';
import { createOrUpdateMember, fetchMember } from '../../libs/member/actions';
import memberSelectors from '../../libs/member/selectors';
import { getLatest as getLatestMember } from '../../libs/member/api';
import { MemberMap } from '../../libs/member/utils';

import { mapFormData, unmap } from '../form.utils';
import withTitle from '../../hocs/with-title.hoc';

type Props = {
  id: number,
  initial: *,
  fetchMemberInitial: () => void,
  goToMember: (id: number) => void,
  goToMemberList: () => void,
  snackbarSuccess: (msg: string) => void,
  onSubmit: (*) => void,
  onCancel: () => void,
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
          onSubmit={onSubmit}
          initial={initialData}
          goToMember={this.props.goToMember}
          goToMemberList={this.props.goToMemberList}
          snackbarSuccess={this.props.snackbarSuccess}
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
    initial: id !== null ? memberSelectors.get(state, id) : null,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    fetchMemberInitial(id) {
      dispatch(fetchMember(id));
    },
    upsertMember(data, options) {
      dispatch(createOrUpdateMember(data, options));
    },
    onCancel() {
      dispatch(goBack());
    },
    goToMember(pk) {
      dispatch(pushRouter(`/member/${pk}/`));
    },
    goToMemberList() {
      dispatch(pushRouter('/member'));
    },
    snackbarSuccess(msg) {
      dispatch(snackbar.success(msg));
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

      upsertMember(formData, {
        ...options,
        onSuccess: () => {
          if (formData.has('id')) {
            goToMember(formData.get('id'));
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
