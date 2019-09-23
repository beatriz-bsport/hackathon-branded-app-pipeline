// @flow

import React from 'react';
import { compose, withProps, withState } from 'recompose';

import { goBack, push } from 'connected-react-router';

import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import mapRouterParamsToProps from '../../hocs/router-params-to-props.hoc';

import {
  fetchAssociated,
  createOrUpdateCoach,
  linkByEmail as linkCoachViaEmail,
} from '../../libs/associated-coach/actions';
import CoachForm from '../../libs/associated-coach/components/CoachForm.component';
import CoachEmailCheckDialog from '../../libs/associated-coach/components/CoachEmailCheckDialog.component';

import { mapFormData, unmap } from '../form.utils';

import withTitle from '../../hocs/with-title.hoc';

type Props = {
  initial: *,
  onSubmit: (*) => void,
  onCancel: (*) => void,

  coachId: ?number,
  initialEmail: ?string,
  setInitialEmail: (email: string) => void,

  push: (path: string) => void,
  fetchAssociated: () => void,
  linkCoachViaEmail: (
    email: string,
    options: { onSuccess: () => void, onError: () => void },
  ) => void,
  setIsEmailChecking: (boolean) => void,
  isEmailChecking: boolean,
  classes: Object,
};

const CoachMap = {
  avatar: 'photo',
  firstname: 'first_name',
  lastname: 'last_name',
  gender: 'gender',
  birthday: 'birthday',
  email: 'email',
  description: 'description',
  phone: 'phone.phone_number',
  facebook_url: 'facebook_url',
  instagram_url: 'instagram_url',
};

export class CoachFormPage extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAssociated();
  }

  render() {
    const { initial, isEmailChecking, onSubmit, onCancel } = this.props;
    if (this.props.coachId && !initial) {
      return <LinearProgress />;
    }
    const initialData = initial
      ? {
          ...unmap(initial, CoachMap),
        }
      : null;

    return (
      <div className={this.props.classes.container}>
        <Dialog open={!initial && isEmailChecking}>
          <CoachEmailCheckDialog
            onCancel={this.props.onCancel}
            submit={(email) => {
              this.props.linkCoachViaEmail(email, {
                onSuccess: () => {
                  this.props.push('/coach');
                  this.props.setIsEmailChecking(false);
                },
                onError: () => {
                  this.props.setInitialEmail(email);
                  this.props.setIsEmailChecking(false);
                },
              });
            }}
          />
        </Dialog>
        <CoachForm
          onSubmit={onSubmit}
          onCancel={onCancel}
          initial={initialData}
          defaultEmail={this.props.initialEmail}
        />
      </div>
    );
  }
}

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default compose(
  withNamespaces(),
  mapRouterParamsToProps({ id: 'coachId:number' }),
  withState('isEmailChecking', 'setIsEmailChecking', true),
  withState('initialEmail', 'setInitialEmail', null),
  connect(
    (state, { coachId }) => ({
      pending: state.coach.upsert.loading,
      errors: state.coach.upsert.error,
      initial:
        coachId !== null
          ? state.coach.companyAssociated.find((c) => c.id === coachId)
          : null,
    }),
    {
      fetchAssociated,
      onCancel: goBack,
      upsertCoach: createOrUpdateCoach,
      linkCoachViaEmail,
      push,
    },
  ),
  withProps(({ upsertCoach, initial }) => ({
    onSubmit: (values, options) => {
      if (!values.birthday) {
        // eslint-disable-next-line
        delete values.birthday;
      }
      const formData = mapFormData(values, CoachMap);

      if (initial) {
        formData.append('id', initial.id);
      }

      upsertCoach(formData, options);
    },
  })),
  withStyles(styles),
  withTitle(({ t }: { t: TFunction }) => t('titles:coach.coachFormPage')),
)(CoachFormPage);
