import React from 'react';

import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push as routerPush } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import { DateTime } from 'luxon';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core';

import {
  fetchOffersByDay as fetchOffersByDayAction,
  setFilters as setFiltersAction,
  toogleFilter as toogleFilterAction,
  offersFilterActions,
} from '#src/libs/offer/actions';
import {
  getAvailableOffersFiltered,
  getManagerFilters,
  withCoach,
  withEstablishment,
} from '#src/libs/offer/selectors';

import { getAvailableEstablishmentList } from '#src/libs/establishment/selectors';
import {
  fetchEstablishments,
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
} from '#src/libs/establishment/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '#src/libs/associated-coach/actions';
// @ts-expect-error
import CheckInOfferList from '#src/libs/check-in/components/CheckInOfferList.component';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import type { Offer } from '#src/libs/offer/types';
import { fetchLevelList as fetchLevelListAction } from '#src/libs/level/actions';
import { withCustomLevel } from '#src/libs/level/selectors';
import {
  lockCheckInFilter as lockCheckInFilterAction,
  unlockCheckInFilter as unlockCheckInFilterAction,
} from '#src/libs/user-preference/actions';
import { getIsCheckInFilterLocked } from '#src/libs/user-preference/selectors';
import {
  updateLocalStorageFilters,
  getOfferFilters,
  updateLocalStorageEstablishementList,
  getLocalStorageEstablishementList,
  isLocalStorageEstablishementListValid,
} from '#src/libs/check-in/utils';
import type { Dispatch } from '../../state/types';
// @ts-expect-error
import { requestLogin as requestLoginAction } from '../../actions/auth.actions';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import type { RootState } from '../../reducers';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '../../libs/theme/actions';

type State = {
  authenticationDialog: {
    isOpen: boolean;
    password: string;
    hasError: boolean;
  };
};

type OwnProps = {
  selectedOffers: Array<Offer>;
};
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  ReturnType<typeof loginDispatchToProps>;

type Props = OwnProps &
  ConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export class CheckInOfferListPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      authenticationDialog: {
        isOpen: false,
        password: '',
        hasError: false,
      },
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.establishments !== prevProps.establishments)
      updateLocalStorageEstablishementList(this.props.establishments);
  }

  UNSAFE_componentWillMount() {
    this.props.setFilters(getOfferFilters(this.props.offerFilters));
    this.refreshData();
    this.handleFetchLevel();
  }

  handleFetchLevel = () => {
    this.props.fetchLevelList({
      company: this.props.companyId,
    });
  };

  refreshData = () => {
    this.props.fetchEstablishments();
    const date = DateTime.now();
    this.props.fetchOffersByDay({
      year: date.year,
      month: date.month,
      day: date.day,
    });
  };

  handleSetAuthenticationPassword = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const eventTarget = event.target;
    this.setState((prevState) => ({
      authenticationDialog: {
        ...prevState.authenticationDialog,
        password: eventTarget.value,
      },
    }));
  };

  handleOpenAuthenticationDialog = () => {
    this.setState((prevState) => ({
      authenticationDialog: {
        ...prevState.authenticationDialog,
        password: '',
        hasError: false,
        isOpen: true,
      },
    }));
  };

  handleCloseAuthenticationDialog = () => {
    this.setState((prevState) => ({
      authenticationDialog: {
        ...prevState.authenticationDialog,
        password: '',
        hasError: false,
        isOpen: false,
      },
    }));
  };

  handleRequestAuthentication = (event: React.FormEvent) => {
    event.preventDefault();
    this.setState((prevState) => ({
      authenticationDialog: {
        ...prevState.authenticationDialog,
        hasError: false,
      },
    }));
    this.props.requestLogin(
      this.props.email,
      this.state.authenticationDialog.password,
      {
        onDone: () => {
          this.props.unlockCheckInFilter();
          this.setState({
            authenticationDialog: {
              password: '',
              isOpen: false,
              hasError: false,
            },
          });
        },
        onError: () => {
          this.setState((prevState) => ({
            authenticationDialog: {
              ...prevState.authenticationDialog,
              hasError: true,
            },
          }));
        },
      },
    );
  };

  handleLockCheckInFilter = () => {
    updateLocalStorageFilters(this.props.offerFilters);
    this.props.lockCheckInFilter();
  };

  render() {
    const establishmentList =
      this.props.establishments?.length === 0 &&
      isLocalStorageEstablishementListValid()
        ? getLocalStorageEstablishementList()
        : this.props.establishments;

    return (
      <div className={this.props.classes.container}>
        <CheckInOfferList
          establishments={establishmentList}
          isCheckInFilterLocked={this.props.isCheckInFilterLocked}
          minutesToConvert={this.props.totalCheckInCutOffMinutes}
          offerFilters={this.props.offerFilters}
          offers={this.props.offers}
          offersLoading={this.props.offersLoading}
          onLockCheckInFilter={this.handleLockCheckInFilter}
          onOfferSelected={this.props.onOfferSelected}
          onOpenAuthenticationDialog={this.handleOpenAuthenticationDialog}
          refreshData={this.refreshData}
          selectedOffers={this.props.selectedOffers}
          setFilters={this.props.setFilters}
          setOpen={this.props.setOpen}
        />

        <GenericResponsiveDialog
          maxWidth="sm"
          onClose={this.handleCloseAuthenticationDialog}
          open={this.state.authenticationDialog.isOpen}
        >
          <form onSubmit={this.handleRequestAuthentication}>
            <DialogTitle>
              {this.props.t('selfCheckIn:authenticationDialog.title')}
            </DialogTitle>
            <DialogContent>
              <Typography
                className={this.props.classes.dialogText}
                variant="body1"
              >
                {this.props.t('selfCheckIn:authenticationDialog.description')}
              </Typography>

              <TextField
                fullWidth
                required
                className={this.props.classes.passwordField}
                error={this.state.authenticationDialog.hasError}
                helperText={
                  this.state.authenticationDialog.hasError &&
                  this.props.t('selfCheckIn:authenticationDialog.error')
                }
                onChange={this.handleSetAuthenticationPassword}
                placeholder={this.props.t('login:forms.password.label')}
                type="password"
                value={this.state.authenticationDialog.password}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseAuthenticationDialog}>
                {this.props.t('common:cancel')}
              </Button>
              <Button color="primary" type="submit">
                {this.props.t('common:confirm')}
              </Button>
            </DialogActions>
          </form>
        </GenericResponsiveDialog>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
    width: '100%',
  },
  dialogText: {
    color: theme.palette.text.secondary,
  },
  passwordField: {
    marginTop: theme.spacing(3),
  },
});

const loginDispatchToProps = (dispatch: Dispatch) => ({
  requestLogin(
    email: string,
    password: string,
    { onDone, onError }: { onDone: () => void; onError: () => void },
  ) {
    dispatch(
      requestLoginAction(
        email,
        password,
        {
          onDone: (data?: { status: string }) => {
            if (data?.status === 'ok') onDone();
          },
          onError,
        },
        true,
      ),
    );
  },
  lockCheckInFilter: () => {
    dispatch(lockCheckInFilterAction());
  },
  unlockCheckInFilter: () => {
    dispatch(unlockCheckInFilterAction());
  },
});

const loginConnector = connect(null, loginDispatchToProps);

const mapStateToProps = (state: RootState) => ({
  offersLoading: state.offer.byDay.loading,
  establishments: withCoach(withEstablishment(getAvailableEstablishmentList))(
    state,
  ),
  offerFilters: getManagerFilters(state),
  offers: withCustomLevel(
    withCoach(withEstablishment(getAvailableOffersFiltered)),
  )(state),
  companyId: state.theme.theme.company,
  email: state.auth.username,
  isCheckInFilterLocked: getIsCheckInFilterLocked(state),
  totalCheckInCutOffMinutes:
    state.theme.theme.checkin_tablet_visible_session_cutoff_minute,
});
const mapDispatchToProps = {
  fetchEstablishments,
  fetchOffersByDay: fetchOffersByDayAction,
  onOfferSelected: (offerId: number) =>
    routerPush(`/check-in/offer/${offerId}`),
  fetchCoachBulk: fetchCoachBulkAction,
  fetchEstablishmentBulk: fetchEstablishmentBulkAction,
  setFilters: setFiltersAction,
  setOpen: offersFilterActions.setOpen,
  toogleFilter: toogleFilterAction,
  fetchLevelList: fetchLevelListAction,
  fetchCompanyTheme: fetchCompanyThemeAction,
};
const mapWithHandlers = {
  fetchOffersByDay:
    (props: ConnectedProps) =>
    (params: { year: number; month: number; day: number }) => {
      props.fetchOffersByDay(params, {
        onSuccess: (offers: Array<Offer>) => {
          props.fetchCoachBulk([
            ...offers.map((o) => o.coach),
            ...offers.map((o) => o.coach_override),
          ]);
          props.fetchEstablishmentBulk([...offers.map((o) => o.establishment)]);
        },
      });
    },
};
export default compose<any, OwnProps>(
  withTranslation(['common', 'selfCheckIn', 'login']),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
  loginConnector,
)(CheckInOfferListPage);
