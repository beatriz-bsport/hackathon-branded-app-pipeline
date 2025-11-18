import React from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { goBack, push } from 'connected-react-router';
import { withTranslation, WithTranslation } from 'react-i18next';

import {
  Button,
  createStyles,
  DialogActions,
  DialogContent,
  Typography,
} from '@material-ui/core';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import mapRouterParamsToProps from '#src/hocs/router-params-to-props.hoc';
import withTitle from '#src/hocs/with-title.hoc';

import {
  fetchAssociatedCoach,
  createOrUpdateCoach,
  linkByEmail as linkCoachViaEmail,
} from '#src/libs/associated-coach/actions';
import { getCoach } from '#src/libs/associated-coach/selectors';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import CoachForm from '#src/libs/associated-coach/components/CoachForm.component';
import CoachEmailCheckDialog from '#src/libs/associated-coach/components/CoachEmailCheckDialog.component';
import type { CoachUpdateOrCreatedPayload } from '#src/libs/associated-coach/types';
// @ts-expect-error
import { mapFormData, unmap } from '../form.utils';
// @ts-expect-error
import { browserCountryCode } from '../../i18n';

import GenericResponsiveDialog from '../../components/genericDialog/GenericResponsiveDialog';

import type { OptionCallback } from '../../state/types';
import type { RootState } from '../../reducers';
import withQueryParamsToProps from '#src/hocs/query-params-to-props.hoc';
import { getTheme } from '#src/libs/theme/selectors';

import { REVAMPED_TEACHER_URL } from '#src/revamp';

type OwnProps = {
  coachId: number;
  email?: string;
};

type Props = OwnProps &
  WithTranslation &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles>;

const CoachMap = {
  avatar: 'photo',
  birthday: 'birthday',
  color: 'color',
  date_joined_company: 'date_joined_company',
  date_left_company: 'date_left_company',
  description: 'description',
  email: 'email',
  facebook_url: 'facebook_url',
  firstname: 'first_name',
  gender: 'gender',
  id: 'id',
  instagram_url: 'instagram_url',
  lastname: 'last_name',
  notes: 'notes',
  phone: 'phone.phone_number',
};

type State = {
  isUserAlreadyRegisteredDialogOpen: boolean;
  isEmailChecking: boolean;
  initialEmail: null | string;
};
export class CoachFormPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isUserAlreadyRegisteredDialogOpen: false,
      isEmailChecking: true,
      initialEmail: props.email ?? null,
    };
  }

  componentDidMount() {
    this.props.coachId && this.props.fetchAssociatedCoach(this.props.coachId);
  }

  handleUserAlreadyRegisteredDialogClose = () =>
    this.setState({ isUserAlreadyRegisteredDialogOpen: false });

  navigateToCoachList = () => {
    if (this.props.revampedBackofficeEnabled) {
      // No better way to navigate to the revamp for now
      window.location.assign(REVAMPED_TEACHER_URL);
    } else {
      this.props.goToCoachList();
    }
  };

  onSubmit = (values: CoachUpdateOrCreatedPayload, options: OptionCallback) => {
    if (!values.birthday) {
      delete values.birthday;
    }
    const formData = mapFormData(values, CoachMap);

    if (this.props.initial) {
      formData.append('id', this.props.initial.id);
    }

    this.props.upsertCoach(formData, {
      onSuccess: () => {
        if (options && options.onSuccess) options.onSuccess();
        this.navigateToCoachList();
      },
      onError: options?.onError,
      customErrorAction: () => {
        this.setState({
          isUserAlreadyRegisteredDialogOpen: true,
          isEmailChecking: false,
        });
      },
    });
  };

  onConfirmLinkCoachByEmail = (email: string) => {
    this.props.linkCoachViaEmail(email?.toLowerCase() || '', {
      onSuccess: () => {
        this.navigateToCoachList();
        this.setState({ isEmailChecking: false });
      },
      onError: () => {
        this.setState({ initialEmail: email });
        this.setState({ isEmailChecking: false });
      },
    });
  };

  handleCloseIsUserAlreadyRegisteredDialog = () =>
    this.setState({ isUserAlreadyRegisteredDialogOpen: false });

  render() {
    const { initial, classes, onCancel, goToCoachList, t } = this.props;

    if (this.props.coachId && !initial) {
      return <LinearProgress />;
    }
    const initialData = initial
      ? {
          ...unmap(initial, CoachMap),
        }
      : null;

    return (
      <div className={classes.container}>
        <GenericResponsiveDialog
          maxWidth="sm"
          open={
            !initial && !this.state.initialEmail && this.state.isEmailChecking
          }
        >
          <CoachEmailCheckDialog
            onCancel={this.props.onCancel}
            submit={this.onConfirmLinkCoachByEmail}
          />
        </GenericResponsiveDialog>

        <GenericResponsiveDialog
          onClose={this.handleUserAlreadyRegisteredDialogClose}
          open={this.state.isUserAlreadyRegisteredDialogOpen}
        >
          <DialogContent>
            <Typography variant="body1">
              {t('coach:forms.update.errors.emailAlreadyInUse')}
            </Typography>
            <DialogActions>
              <Button
                color="primary"
                onClick={this.handleCloseIsUserAlreadyRegisteredDialog}
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
                {t('common:ok')}
              </Button>
            </DialogActions>
          </DialogContent>
        </GenericResponsiveDialog>

        <CoachForm
          country={browserCountryCode()}
          defaultEmail={this.state.initialEmail}
          initial={initialData}
          onCancel={onCancel}
          onSubmit={this.onSubmit}
        />
      </div>
    );
  }
}

const connector = connect(
  (state: RootState, { coachId }: { coachId: number }) => ({
    initial: coachId !== null ? getCoach(state, coachId) : null,
    revampedBackofficeEnabled:
      getTheme(state)?.revamped_backoffice_enabled &&
      state.auth?.has_enabled_revamped_backoffice,
  }),
  {
    fetchAssociatedCoach,
    onCancel: goBack,
    upsertCoach: createOrUpdateCoach,
    linkCoachViaEmail,
    push,
    goToCoachList: () => push('/coach'),
  },
);

const styles = () =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  });

export default compose<OwnProps, Props>(
  withTranslation(['navigation, coach', 'common']),
  mapRouterParamsToProps({ id: 'coachId:number' }),
  connector,
  withStyles(styles),
  withQueryParamsToProps(['email']),
  withTitle(({ t }) => t('titles:coach.coachFormPage')),
)(CoachFormPage);
