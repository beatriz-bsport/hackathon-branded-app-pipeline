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

import mapRouterParamsToProps from '#hocs/router-params-to-props.hoc';
import withTitle from '#hocs/with-title.hoc';

import {
  fetchAssociatedCoach,
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
  coachId: number;
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
      initialEmail: null,
    };
  }

  componentDidMount() {
    this.props.coachId && this.props.fetchAssociatedCoach(this.props.coachId);
  }

  handleUserAlreadyRegisteredDialogClose = () =>
    this.setState({ isUserAlreadyRegisteredDialogOpen: false });

  onSubmit = (values: CoachUpdateOrCreatedPayload, options: OptionCallback) => {
    if (!values.birthday) {
      // eslint-disable-next-line
      delete values.birthday;
    }
    const formData = mapFormData(values, CoachMap);

    if (this.props.initial) {
      formData.append('id', this.props.initial.id);
    }

    this.props.upsertCoach(formData, {
      onSuccess: () => {
        if (options && options.onSuccess) options.onSuccess();
        this.props.goToCoachList();
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
        this.props.goToCoachList();
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
          open={!initial && this.state.isEmailChecking}
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
          // @ts-expect-error
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
  withTitle(({ t }) => t('titles:coach.coachFormPage')),
)(CoachFormPage);
