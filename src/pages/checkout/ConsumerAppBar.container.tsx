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

import { Theme } from '../../libs/theme/types';
import { RootState } from '../../reducers';

type Props = {
  theme?: Theme;
  auth: any;
  goToUserSpace: (id: number) => void;
  disconnect: () => void;
  companyId?: number;
  children: any;
  backgroundColor?: string;
};
type StyleProps = {
  backgroundColor?: string;
};
export const ConsumerAppBar = (props: Props) => {
  const classes = useStyles({ backgroundColor: props.backgroundColor });
  return (
    <MuiThemeProvider theme={getTheme(props.theme)}>
      <div className={classes.container}>
        <Analytics theme={props.theme} />
        <MarketplaceAppBar
          paper
          isWidget={WidgetUtils.isWidget()}
          auth={props.auth}
          logo={props.theme && props.theme.cover}
          goToUserSpace={() => props.goToUserSpace(props.theme.company)}
          disconnect={props.disconnect}
          companyId={props.companyId}
        />
        {props.children}
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

export default connect(
  (state: RootState) => ({
    currentBasket: getCurrentBasket(state),
    theme: themeSelectors.getTheme(state),
    auth: state.auth,
  }),
  {
    disconnect: authActions.disconnect,
    goToUserSpace: (id: number) => push(`/c/${id}`),
  },
)(ConsumerAppBar);
