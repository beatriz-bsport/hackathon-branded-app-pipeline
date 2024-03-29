import React from 'react';

import { connect } from 'react-redux';
import { compose, withProps, withState } from 'recompose';
import { goBack, push } from 'connected-react-router';
import { withTranslation, WithTranslation } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import {
  Button,
  createStyles,
  DialogActions,
  DialogContent,
  Typography,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

import mapRouterParamsToProps from '#hocs/router-params-to-props.hoc';
import withTitle from '#hocs/with-title.hoc';

import {
  fetchAssociatedCoachesList,
  createOrUpdateCoach,
  linkByEmail as linkCoachViaEmail,
} from '#libs/associated-coach/actions';
import { getCoach } from '#libs/associated-coach/selectors';
// @ts-expect-error
import { mapFormData, unmap } from '../form.utils';
// @ts-expect-error
import { browserCountryCode } from '../../i18n';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';

import CoachForm from '#libs/associated-coach/components/CoachForm.component';
import CoachEmailCheckDialog from '#libs/associated-coach/components/CoachEmailCheckDialog.component';
import GenericResponsiveDialog from '../../components/genericDialog/GenericResponsiveDialog';

import type { OptionCallback } from '../../state/types';
import type { RootState } from '../../reducers';
import type { CoachUpdateOrCreatedPayload } from '#libs/associated-coach/types';

type OwnProps = {
  initial: any;
  onSubmit: () => void;
  onCancel: () => void;
  classes: {
    container: string;
  };

  coachId?: number;
  initialEmail?: string;
  setInitialEmail: (email: string) => void;

  goToCoachList: () => void;
  fetchAssociatedCoachesList: () => void;
  linkCoachViaEmail: (
    email: string,
    options: { onSuccess: () => void; onError: () => void },
  ) => void;
  isEmailChecking: boolean;
  setIsEmailChecking: (isChecking: boolean) => void;
  isUserAlreadyRegisteredDialogOpen: boolean;
  setIsUserAlreadyRegisteredDialogOpen: (open: boolean) => void;
};

type Props = OwnProps & WithTranslation;

const CoachMap = {
  avatar: 'photo',
  firstname: 'first_name',
  lastname: 'last_name',
  gender: 'gender',
  birthday: 'birthday',
  email: 'email',
  description: 'description',
  notes: 'notes',
  date_joined_company: 'date_joined_company',
  date_left_company: 'date_left_company',
  phone: 'phone.phone_number',
  facebook_url: 'facebook_url',
  instagram_url: 'instagram_url',
  color: 'color',
  id: 'id',
};

export class CoachFormPage extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAssociatedCoachesList();
  }

  handleUserAlreadyRegisteredDialogClose = () =>
    this.props.setIsUserAlreadyRegisteredDialogOpen(false);

  render() {
    const {
      initial,
      isEmailChecking,
      isUserAlreadyRegisteredDialogOpen,
      onCancel,
      goToCoachList,
      t,
    } = this.props;

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
              this.props.linkCoachViaEmail(email?.toLowerCase() || '', {
                onSuccess: () => {
                  goToCoachList();
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

        <GenericResponsiveDialog
          onClose={this.handleUserAlreadyRegisteredDialogClose}
          open={isUserAlreadyRegisteredDialogOpen}
        >
          <DialogContent>
            <Typography variant="body1">
              {t('coach:forms.update.errors.emailAlreadyInUse')}
            </Typography>
            <DialogActions>
              <Button
                color="primary"
                onClick={() =>
                  this.props.setIsUserAlreadyRegisteredDialogOpen(false)
                }
                type="submit"
              >
                {t('navigation:backofficeMenu.goBack')}
              </Button>
              <Button
                color="primary"
                onClick={goToCoachList}
                type="submit"
                variant="contained"
              >
                {t('common.ok')}
              </Button>
            </DialogActions>
          </DialogContent>
        </GenericResponsiveDialog>

        <CoachForm
          country={browserCountryCode()}
          // @ts-expect-error
          defaultEmail={this.props.initialEmail}
          initial={initialData}
          onCancel={onCancel}
          onSubmit={this.props.onSubmit}
        />
      </div>
    );
  }
}

const styles = () =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  });

export default compose(
  withTranslation(),
  mapRouterParamsToProps({ id: 'coachId:number' }),
  withState('isEmailChecking', 'setIsEmailChecking', true),
  withState('initialEmail', 'setInitialEmail', null),
  withState(
    'isUserAlreadyRegisteredDialogOpen',
    'setIsUserAlreadyRegisteredDialogOpen',
    false,
  ),
  connect(
    (state: RootState, { coachId }: { coachId: number }) => ({
      pending: state.coach.upsert.loading,
      errors: state.coach.upsert.error,
      initial: coachId !== null ? getCoach(state, coachId) : null,
    }),
    {
      fetchAssociatedCoachesList,
      onCancel: goBack,
      upsertCoach: createOrUpdateCoach,
      linkCoachViaEmail,
      push,
      goToCoachList: () => push('/coach'),
    },
  ),
  withProps(
    ({
      upsertCoach,
      initial,
      goToCoachList,
      setIsUserAlreadyRegisteredDialogOpen,
      setIsEmailChecking,
    }) => ({
      onSubmit: (
        values: CoachUpdateOrCreatedPayload,
        options: OptionCallback,
      ) => {
        if (!values.birthday) {
          // eslint-disable-next-line
          delete values.birthday;
        }
        const formData = mapFormData(values, CoachMap);

        if (initial) {
          formData.append('id', initial.id);
        }

        upsertCoach(formData, {
          onSuccess: () => {
            if (options && options.onSuccess) options.onSuccess();
            goToCoachList();
          },
          onError: options?.onError,
          customErrorAction: () => {
            setIsUserAlreadyRegisteredDialogOpen(true);
            setIsEmailChecking(false);
          },
        });
      },
    }),
  ),
  withStyles(styles),
  withTitle(({ t }) => t('titles:coach.coachFormPage')),
)(CoachFormPage);
