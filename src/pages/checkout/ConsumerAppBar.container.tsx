// @ts-nocheck
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';
import { compose, withHandlers } from 'recompose';
import { DIALOG_MODE_DEACTIVATED } from '@bsport/common/lib/master-data/widget-dialog-mode';
import { navigateBackToMasterRelation as navigateBackToMasterRelationAction } from '../../actions/auth.actions';
import { auth as authActions } from '../../actions';
import MarketplaceAppBar from '#marketplacecomponents/@AppBar/MarketplaceAppBar';
import WidgetUtils from '../../libs/widget/WidgetUtils';

import Analytics from '../../components/analytics/Analytics.component';
import themeSelectors from '../../libs/theme/selectors';
import { getTheme } from '../../theme';
import { getCurrentBasket } from '../../libs/checkout/selectors';

import { Theme } from '../../libs/theme/types';
import { fetchProfile as fetchProfileAction } from '../../libs/consumer-space/actions';
import { RootState } from '../../reducers';
import MinimalMarketplaceAppBarCSSOnly from '#libs/marketplace/components/@AppBar/MarketplaceAppBar/MinimalMarketplaceAppBarCSSOnly';

type OwnProps = {
  companyId?: number;
  children: any;
  backgroundColor?: string;

  navigateBackToMasterRelation: () => void;
};
type Props = OwnProps & ConnectedProps<typeof connector>;
type StyleProps = {
  backgroundColor?: string;
};
export const ConsumerAppBar: React.FC<Props> = ({
  companyId,
  children,
  backgroundColor,
  consumerProfile,
  fetchProfile,
  auth,
  navigateBackToMasterRelation,
  theme,
  goToUserSpace,
  disconnect,
}) => {
  const isWidget = WidgetUtils.isWidget();
  const isWidgetNoPopUp =
    isWidget && WidgetUtils.getDialogMode() === DIALOG_MODE_DEACTIVATED;

  const isRelationNavigation = !!window.localStorage.getItem(
    'bsport:relatedMemberMaster:http:token',
  );
  const classes = useStyles({ backgroundColor });

  React.useEffect(() => {
    if (auth.authenticated && !consumerProfile) {
      fetchProfile();
    }
  }, [auth, consumerProfile, fetchProfile]);

  return (
    <MuiThemeProvider theme={getTheme(theme)}>
      <div className={classes.container}>
        <Analytics theme={theme} />
        {isWidgetNoPopUp && theme?.display_new_checkout_flow ? (
          <MinimalMarketplaceAppBarCSSOnly
            auth={auth}
            disconnect={disconnect}
            photo={consumerProfile?.photo}
          />
        ) : (
          <MarketplaceAppBar
            auth={auth}
            companyId={companyId}
            disconnect={disconnect}
            goToUserSpace={() => goToUserSpace(theme.company)}
            isRelationNavigation={isRelationNavigation}
            isWidget={isWidget}
            logo={theme && theme.cover}
            navigateBackToMasterRelation={navigateBackToMasterRelation}
            photo={consumerProfile?.photo}
            theme={theme}
            websiteURL={theme.websiteURL}
          />
        )}

        {children}
      </div>
    </MuiThemeProvider>
  );
};

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: ({ backgroundColor }) => backgroundColor || '#efefef',
    overflow: 'auto',
  },
}));
const connector = connect(
  (state: RootState) => ({
    currentBasket: getCurrentBasket(state),
    theme: themeSelectors.getTheme(state),
    auth: state.auth,
    consumerProfile: state.consumer.profile,
  }),
  {
    fetchProfile: fetchProfileAction,
    disconnect: authActions.disconnect,
    goToUserSpace: (id: number) => push(`/c/${id}`),
    navigateBackToMasterRelation: navigateBackToMasterRelationAction,
  },
);
export default compose(
  connector,
  withHandlers({
    navigateBackToMasterRelation:
      ({
        theme,
        navigateBackToMasterRelation,
      }: ConnectedProps<typeof connector>) =>
      () => {
        navigateBackToMasterRelation({
          company: theme.company,
          companyName: theme.company_name,
        });
      },
  }),
)(ConsumerAppBar);
