import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import {
  ButtonBase,
  CircularProgress,
  Dialog,
  DialogContent,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import {
  MarketplaceVideo,
  MarketplaceVideoDataProvider,
} from 'bsport-saas/src/pages/marketplace/MarketplaceVideo.page';
import {
  MarketplaceVideoDetail,
  MarketplaceVideoDetailDataProvider,
} from 'bsport-saas/src/pages/marketplace/MarketplaceVideoDetail.page';
import {
  MarketplacePlaylistDetailPage,
  MarketplacePlaylistDetailDataProvider,
} from 'bsport-saas/src/pages/marketplace/MarketplacePlaylistDetail.page';
import {
  MarketplacePlaylistData,
  MarketplaceVODData,
} from 'bsport-saas/src/libs/marketplace/types';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import { Theme } from 'bsport-saas/src/libs/theme/types';
import { getMarketplaceRoute } from 'bsport-saas/src/pages/marketplace/routing-utils';
import { auth as authActions } from 'bsport-saas/src/actions';

import '../../vendor/video.css';

// BEGIN DEPREACTED TO DELETE BECAUSE WE WILL ADD A DEDICATED PAGE TO BUY VOD
// ----------------------------------------------------------------------

import SignUpForm from 'bsport-saas/src/components/form/SignUpForm.component';
import ConsumerLogin from 'bsport-saas/src/components/consumer/login/ConsumerLogin.component';
import { RootState } from '../store/reducer';
import { getEnv } from '../utils/utils';

const ConsumerLoginStyled = themify(ConsumerLogin);
const SignUpFormStyled = themify(SignUpForm);

type AuthOwnProps = {
  showLogin: boolean,
  showSignup: boolean,
  authenticated: boolean,
  loading: boolean,
  error: any,
  errorFields: any,
  emailExists: boolean,
  checkEmailExists: boolean,
  checkEmailExistsLoading: boolean,
  theme: Theme,
  onLogin: (data: any) => void,
  onSignup: (data: any) => void,
  onLoginClose: () => void,
  onSignupClose: () => void,
  onSignupShow: () => void,
};

const AuthDialog = (props: AuthOwnProps) => {
  return (
    <>
      <Dialog open={props.showLogin} onClose={props.onLoginClose}>
        <DialogContent>
          <React.Suspense fallback={<CircularProgress />}>
            <ConsumerLoginStyled
              doEmailLogin={props.onLogin}
              errorFields={props.errorFields}
              error={props.error}
              loading={props.loading}
              requestSignUp={props.onSignupShow}
            />
          </React.Suspense>
        </DialogContent>
      </Dialog>

      <Dialog open={props.showSignup} onClose={props.onSignupClose}>
        <React.Suspense fallback={<CircularProgress />}>
          <div className="cleanslate" style={{ padding: 16 }}>
            <div style={{ padding: 16 }}>
              <SignUpFormStyled
                loading={props.loading}
                theme={props.theme}
                emailExists={props.emailExists}
                checkEmailExistsLoading={props.checkEmailExistsLoading}
                checkEmailExists={props.checkEmailExists}
                onComplete={props.onSignup}
                onCancel={props.onSignupClose}
                consumerProfile={props.consumerProfile}
              />
            </div>
          </div>
        </React.Suspense>
      </Dialog>
    </>
  );
};

// END DEPREACTED
// --------------------------------------------------------------------------------

type OwnProps = {
  companyId: number,
  store: any,
  config: MarketplacePlaylistData & MarketplaceVODData,
  onRequestLogin: () => void,
  theme: Theme,
  onWindowOpen: (popupWindow: any) => void,
  dialogMode: number,
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>;

interface State {
  videoId?: number;
  playlistId?: number;
  searchParams: {
    coaches: string,
    duration_second_range: string,
    SCTs: string,
    search: string,
    levels: string,
  };
  showLogin: boolean;
  showSignup: boolean;
}

const MarketPlaceVideoStyled = themify(
  MarketplaceVideoDataProvider(MarketplaceVideo)
);

const MarketplaceVideoDetailStyled = themify(
  MarketplaceVideoDetailDataProvider(MarketplaceVideoDetail)
);

const MarketplacePlaylistStyled = themify(
  MarketplacePlaylistDetailDataProvider(MarketplacePlaylistDetailPage)
);

class VODWidget extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      videoId: props.config.videoId,
      playlistId: props.config.playlistId,
      searchParams: {
        coaches: '',
        duration_second_range: '',
        SCTs: '',
        search: '',
        levels: '',
      },
      showLogin: false,
      showSignup: false,
    };
  }

  openVideo = (videoId: number) => {
    this.setState({ videoId });
  };

  openPlaylist = (playlistId: number, videoId?: number) => {
    this.setState({ playlistId, videoId });
  };

  setSearchParams = (key: string) => (value: string) => {
    this.setState((prevState) => ({
      searchParams: {
        ...prevState.searchParams,
        [key]: value,
      },
    }));
  };

  onRequestBuyPass = () => {
    const { PUBLIC_URL } = getEnv();
    const path = getMarketplaceRoute(
      this.props.theme.company_name,
      this.props.companyId,
      'pass'
    );
    const url = `${PUBLIC_URL}${path}?authToken=${this.props.auth.token}`;
    window.open(url, '_blank');
  };

  login = (data: { email: string, password: string }) => {
    const _this = this;
    this.props.login(data, () => {
      _this.setState({ showLogin: false });
    });
  };

  signup = (data: any) => {
    const _this = this;
    this.props.signup(data, () => {
      _this.setState({ showSignup: false, showLogin: false });
    });
  };

  render() {
    const showVODList =
      (this.state.videoId === undefined || this.state.videoId === null) &&
      this.state.playlistId === undefined;

    const showVODDetail =
      this.state.videoId !== undefined &&
      this.state.videoId !== null &&
      !this.state.playlistId;

    return (
      <div className={this.props.classes.container}>
        {showVODList && (
          <MarketPlaceVideoStyled
            companyId={this.props.companyId}
            searchParams={this.state.searchParams}
            setSearchParams={this.setSearchParams}
            companyName=""
            openVideo={this.openVideo}
            openPlaylist={(playlistId: number) => this.openPlaylist(playlistId)}
            store={this.props.store}
            theme={this.props.theme}
          />
        )}

        {showVODDetail && (
          <div className={this.props.classes.videoContainer}>
            <ButtonBase
              onClick={() => {
                this.setState({ videoId: undefined });
              }}
            >
              <ChevronLeftIcon
                className={this.props.classes.icon}
                fontSize="large"
              />
            </ButtonBase>

            <div className={this.props.classes.videoDetail}>
              <MarketplaceVideoDetailStyled
                companyId={this.props.companyId}
                videoId={this.state.videoId}
                companyName=""
                requestSignUp={() => this.setState({ showLogin: true })}
                onRequestBuyPass={this.onRequestBuyPass}
                openVideo={this.openVideo}
                requestVideoAccessRefreshFlag={
                  this.props.requestVideoAccessRefreshFlag
                }
                store={this.props.store}
                theme={this.props.theme}
              />
            </div>
          </div>
        )}

        {this.state.playlistId !== undefined && (
          <div className={this.props.classes.videoContainer}>
            <ButtonBase
              onClick={() => {
                this.setState({ videoId: undefined, playlistId: undefined });
              }}
            >
              <ChevronLeftIcon
                className={this.props.classes.icon}
                fontSize="large"
              />
            </ButtonBase>

            <div className={this.props.classes.videoDetail}>
              <MarketplacePlaylistStyled
                companyId={this.props.companyId}
                companyName=""
                id={this.state.playlistId}
                videoId={this.state.videoId}
                requestSignUp={() => this.setState({ showLogin: true })}
                goToVideoInPlaylist={this.openPlaylist}
                replaceVideoInPlaylist={this.openPlaylist}
                store={this.props.store}
                theme={this.props.theme}
              />
            </div>
          </div>
        )}

        {(!!this.state.showLogin || !!this.state.showSignup) &&
          !this.props.auth.authenticated && (
            <AuthDialog
              showLogin={this.state.showLogin}
              showSignup={this.state.showSignup}
              loading={this.props.auth.loading}
              error={this.props.auth.error}
              errorFields={this.props.errorFields}
              emailExists={this.props.emailExists}
              checkEmailExists={this.props.checkEmailExists}
              checkEmailExistsLoading={this.props.checkEmailExistsLoading}
              theme={this.props.theme}
              onLogin={this.login}
              onSignup={this.signup}
              onLoginClose={() => this.setState({ showLogin: false })}
              onSignupClose={() => this.setState({ showSignup: false })}
              onSignupShow={() => this.setState({ showSignup: true })}
            />
          )}
      </div>
    );
  }
}

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  icon: {},
  videoContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
  },
  videoDetail: {
    display: 'block',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
});

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  requestVideoAccessRefreshFlag: state.widget.requestVideoAccessRefreshFlag,
  errorFields: state.auth.invalidFields,
  checkEmailExistsLoading: state.auth.emailExists.loading,
  emailExists: state.auth.emailExists.exists,
});

const mapDispatchToProps = {
  signup: (data: any, callback: () => void) =>
    authActions.signup(data, { onDone: callback }),
  login: ({ email, password }: any, callback: () => void) =>
    authActions.requestLogin(email, password, { onDone: callback }),
  checkEmailExists: authActions.checkEmailExists,
};

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(VODWidget);
