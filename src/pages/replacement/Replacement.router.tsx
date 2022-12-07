import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import { Tab } from '@material-ui/core';
import { compose } from 'redux';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

import themeSelectors from '../../libs/theme/selectors';
import ReplacementManagement from './ReplacementManagement.page';
import ReplacementDisciplineGroup from './ReplacementDisciplineGroup.page';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import { RootState } from '../../reducers';

type OwnProps = {
  tab: string;
};

type Props = OwnProps & WithTranslation & ConnectedProps<typeof connector>;

export const ReplacementRouter: React.FC<Props> = (props) => {
  const { t } = props;
  const classes = useStyles();
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
          <Tab label={t('management')} value="management" />
          <Tab label={t('disciplineGroup.title')} value="discipline-group" />
        </Tabs>
      </AppBar>
      <div className={classes.content}>
        <Switch>
          <Route
            exact
            path="/replacement/discipline-group"
            component={ReplacementDisciplineGroup}
          />
          <Route
            exact
            path="/replacement/management"
            component={ReplacementManagement}
          />
          <Redirect to="/replacement/management" />
        </Switch>
      </div>
    </div>
  );
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
  pushToTab: (tab: string) => push(`/replacement/${tab}`),
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose<any>(
  withTranslation(['replacement', 'titles']),
  withTitle(({ t }: { t: TFunction }) => t('titles:replacement')),
  routerParamsToProps({
    tab: 'tab',
  }),
  connector,
)(ReplacementRouter);
