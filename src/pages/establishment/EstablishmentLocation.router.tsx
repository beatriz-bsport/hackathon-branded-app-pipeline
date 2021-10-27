// @flow

import React from 'react';
import { Route, Switch } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import { Tab } from '@material-ui/core';
import { compose } from 'redux';
import { Theme } from '@material-ui/core/styles';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import { withTranslation, WithTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import themeSelectors from '../../libs/theme/selectors';
import EstablishmentList from './EstablishmentList.page';
import EstablishmentGroupPage from './EstablishmentGroup.page';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { RootState } from '../../reducers';

type OwnProps = {
  tab: string;
};

type Props = OwnProps & WithTranslation & ConnectedProps<typeof connector>;

export const EstablishmentRoomLocationRouter = (props: Props) => {
  const { t } = props;
  const classes = useStyles();
  if (props.companyTheme.enable_multi_localization) {
    return (
      <div className={classes.container}>
        <AppBar position="static" color="default">
          <Tabs
            scrollButtons="off"
            variant="scrollable"
            value={props.tab}
            onChange={(e, newTab) => {
              props.pushToTab(newTab);
            }}
          >
            <Tab label={t('room')} value="room" />
            {props.companyTheme.enable_multi_localization && (
              <Tab label={t('localisation')} value="location" />
            )}
          </Tabs>
        </AppBar>
        <div className={classes.content}>
          <Switch>
            <Route
              exact
              path="/establishment/location"
              component={EstablishmentGroupPage}
            />
            <Route path="/" component={EstablishmentList} />
          </Switch>
        </div>
      </div>
    );
  }

  return <Route path="/" component={EstablishmentList} />;
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(-3),
    width: '100vw',
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(-3),
      width: 'auto',
      marginRight: theme.spacing(-3),
      marginTop: theme.spacing(-2),
    },
  },
  content: {
    marginBottom: theme.spacing(8),
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(2),
      marginBottom: theme.spacing(8),
    },
    marginTop: theme.spacing(2),
  },
}));

const mapStateToProps = (state: RootState) => ({
  companyTheme: themeSelectors.getTheme(state),
});

const mapDispatchToProps = {
  pushToTab: (tab: string) => push(`/establishment/${tab}`),
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose<any>(
  withTranslation('establishment'),
  routerParamsToProps({
    tab: 'tab',
  }),
  connector,
)(EstablishmentRoomLocationRouter);
