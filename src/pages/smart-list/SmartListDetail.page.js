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
import { push } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import SmartListDetailMember from './SmartListDetailMember.page';
// import SmartListDetailEmail from './SmartListDetailEmail.page';
import SmartListDetailCampaign from './SmartListDetailCampaign.page';
import SmartListDetailCampaignReport from './SmartListDetailCampaignReport.page';
import SmartListDetailStatistic from './SmartListDetailStatistic.page';

import { getSmartList } from '../../libs/smart-list/selectors';
import { fetchSmartListDetail } from '../../libs/smart-list/actions';

type Props = {
  t: TFunction,
  pushToTab: (id: number, tab: string) => void,
  tab: string,
  id: number,
  classes: Object,
  fetchSmartListDetail: (id: number) => void,
};

export class SmartListDetail extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchSmartListDetail(this.props.id);
  }

  render() {
    const { t, pushToTab, tab, id, classes } = this.props;
    /*
     */
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
            <Tab label={t('detail.tab.member')} value="member" />
            <Tab label={t('detail.tab.campaign')} value="campaign" />
            <Tab label={t('detail.tab.statistic')} value="statistic" />
          </Tabs>
        </AppBar>
        <div className={classes.content}>
          <Switch>
            <Route
              exact
              path="/smart-list/:id/member/"
              component={SmartListDetailMember}
            />
            <Route
              exact
              path="/smart-list/:id/campaign/:campaignId/"
              component={SmartListDetailCampaignReport}
            />
            <Route
              exact
              path="/smart-list/:id/campaign/"
              component={SmartListDetailCampaign}
            />
            <Route
              exact
              path="/smart-list/:id/statistic/"
              component={SmartListDetailStatistic}
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
  withNamespaces(['smartList']),
  routerParamsToProps({ tab: 'tab', id: 'id:number' }),
  withStyles(styles),
  connect(
    (state, { id }) => ({
      smartlist: getSmartList(state, id),
    }),
    {
      pushToTab: (id, tab) => push(`/smart-list/${id}/${tab}`),
      fetchSmartListDetail,
    },
  ),
  withTitle(({ smartlist }) => (smartlist ? smartlist.name : '')),
)(SmartListDetail);
