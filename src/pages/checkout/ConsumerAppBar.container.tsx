import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';
import { compose, withHandlers } from 'recompose';
import {
  disconnect,
  navigateBackToMasterRelation as navigateBackToMasterRelationAction,
} from '../../actions/auth.actions';
import MarketplaceAppBar from '../marketplace/MarketplaceAppBar.component';
import WidgetUtils from '../../libs/widget/WidgetUtils';

import Analytics from '../../components/analytics/Analytics.component';
import themeSelectors from '../../libs/theme/selectors';
import { getTheme } from '../../theme';
import { getCurrentBasket } from '../../libs/checkout/selectors';

import { Theme } from '../../libs/theme/types';
import { RootState } from '../../reducers';

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
export const ConsumerAppBar = (props: Props) => {
  const isRelationNavigation = !!window.localStorage.getItem(
    'bsport:relatedMemberMaster:http:token',
  );
  const classes = useStyles({ backgroundColor: props.backgroundColor });
  return (
    <MuiThemeProvider theme={getTheme(props.theme)}>
      <div className={classes.container}>
        <Analytics theme={props.theme} />
        <MarketplaceAppBar
          navigateBackToMasterRelation={props.navigateBackToMasterRelation}
          isRelationNavigation={isRelationNavigation}
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
const connector = connect(
  (state: RootState) => ({
    currentBasket: getCurrentBasket(state),
    theme: themeSelectors.getTheme(state),
    auth: state.auth,
  }),
  {
    disconnect,
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
