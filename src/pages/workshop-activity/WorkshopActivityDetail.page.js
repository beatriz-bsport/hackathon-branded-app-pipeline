// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import { compose } from 'recompose';
import Tab from '@material-ui/core/Tab';
import { connect } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import WorkshopActivityDetailPack from './WorkshopActivityDetailPack.page';
import WorkshopActivityDetailGeneral from './WorkshopActivityDetailGeneral.page';

import { getWorkshops } from '../../libs/meta-activity/selectors';
import { fetchAll as fetchAllWorkshops } from '../../libs/meta-activity/actions';

type Props = {
  t: TFunction,
  pushToTab: (id: number, tab: string) => void,
  tab: string,
  id: number,
  classes: Object,
  fetchAllWorkshops: () => void,
};

export class WorkshopActivityDetail extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllWorkshops();
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
              path="/workshop-activity/:id/pack/:packId"
              component={WorkshopActivityDetailPack}
            />
            <Route
              exact
              path="/workshop-activity/:id/pack"
              component={WorkshopActivityDetailPack}
            />
            <Route
              exact
              path="/workshop-activity/:id/general"
              component={WorkshopActivityDetailGeneral}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing(4),
    marginTop: -theme.spacing(3),
    width: '100vw',
    [theme.breakpoints.up('md')]: {
      marginLeft: -theme.spacing(3),
      width: 'auto',
      marginRight: -theme.spacing(3),
      marginTop: -theme.spacing(2),
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
});

export default compose(
  withTranslation(['metaActivity']),
  routerParamsToProps({ tab: 'tab', id: 'id:number' }),
  withStyles(styles),
  connect(
    (state, { id }) => ({
      workshopActivity: getWorkshops(state).find((ma) => ma.id === id),
    }),
    {
      pushToTab: (id, tab) => push(`/workshop-activity/${id}/${tab}`),
      fetchAllWorkshops,
    },
  ),
  withTitle(({ workshopActivity }) => {
    if (workshopActivity) {
      return workshopActivity.name;
    }
    return '';
  }),
)(WorkshopActivityDetail);
