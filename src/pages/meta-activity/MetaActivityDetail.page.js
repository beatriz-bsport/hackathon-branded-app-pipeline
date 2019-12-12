// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import { compose } from 'recompose';
import Tab from '@material-ui/core/Tab';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push } from 'react-router-redux';
import withStyles from '@material-ui/core/styles/withStyles';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import MetaActivityDetailPack from './MetaActivityDetailPack.page';
import MetaActivityDetailGeneral from './MetaActivityDetailGeneral.page';

import { getMetaActivity } from '../../libs/meta-activity/selectors';
import { fetchMetaActivityDetails } from '../../libs/meta-activity/actions/meta-activity.actions';

type Props = {
  t: TFunction,
  pushToTab: (id: number, tab: string) => void,
  tab: string,
  id: number,
  classes: Object,
  fetchMetaActivityDetails: (id: number) => void,
};

export class MetaActivityDetail extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchMetaActivityDetails(this.props.id);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.props.fetchMetaActivityDetails(this.props.id);
    }
  }

  render() {
    const { t, pushToTab, tab, id, classes } = this.props;
    return (
      <div className={classes.container}>
        <AppBar position="static" color="default">
          <Tabs
            scrollButtons="off"
            variant="scrollable"
            value={tab}
            onChange={(e, newTab) => {
              pushToTab(id, newTab);
            }}
          >
            <Tab label={t('detail.tab.general')} value="general" />
            <Tab label={t('detail.tab.pack')} value="pack" />
          </Tabs>
        </AppBar>
        <div className={classes.content}>
          <Switch>
            <Route
              exact
              path="/activity/:id/pack/:packId"
              component={MetaActivityDetailPack}
            />
            <Route
              exact
              path="/activity/:id/pack"
              component={MetaActivityDetailPack}
            />
            <Route
              exact
              path="/activity/:id/general"
              component={MetaActivityDetailGeneral}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing.unit * 4,
    marginTop: -theme.spacing.unit * 3,
    width: '100vw',
    [theme.breakpoints.up('md')]: {
      marginLeft: -theme.spacing.unit * 3,
      width: 'auto',
      marginRight: -theme.spacing.unit * 3,
      marginTop: -theme.spacing.unit * 2,
    },
  },
  content: {
    marginBottom: theme.spacing.unit * 8,
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 8,
    },
    marginTop: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['metaActivity']),
  routerParamsToProps({ tab: 'tab', id: 'id:number' }),
  withStyles(styles),
  connect(
    (state, { id }) => ({
      metaActivity: getMetaActivity(state, id),
    }),
    {
      pushToTab: (id, tab) => push(`/activity/${id}/${tab}`),
      fetchMetaActivityDetails,
    },
  ),
  withTitle(({ metaActivity }) => (metaActivity ? metaActivity.name : '')),
)(MetaActivityDetail);
