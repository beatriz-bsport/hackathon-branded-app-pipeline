import React from 'react';
import { connect } from 'react-redux';
import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';
import MarketplaceAppBar from '../marketplace/MarketplaceAppBar.component';
import WidgetUtils from '../../libs/widget/WidgetUtils';

import { auth as authActions } from '../../actions';

import Analytics from '../../components/analytics/Analytics.component';
import themeSelectors from '../../libs/theme/selectors';
import { getTheme } from '../../theme';
import { getCurrentBasket } from '../../libs/checkout/selectors';

export const ConsumerAppBar = (props) => {
  const classes = useStyles();
  return (
    <MuiThemeProvider theme={getTheme(props.theme)}>
      <div className={classes.container}>
        <Analytics theme={props.theme} />
        {!WidgetUtils.isWidget() && (
          <MarketplaceAppBar
            paper
            auth={props.auth}
            logo={props.theme && props.theme.cover}
            goToUserSpace={() => props.goToUserSpace(props.theme.company)}
            disconnect={props.disconnect}
            companyId={props.companyId}
          />
        )}
        {props.children}
      </div>
    </MuiThemeProvider>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#efefef',
  },
}));

export default connect(
  (state) => ({
    currentBasket: getCurrentBasket(state),
    theme: themeSelectors.getTheme(state),
    auth: state.auth,
  }),
  {
    disconnect: authActions.disconnect,
    goToUserSpace: (id) => push(`/c/${id}`),
  },
)(ConsumerAppBar);
