import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import { compose } from 'recompose';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { push } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { TFunction } from 'i18next';
import { Theme } from '@material-ui/core/styles';
import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { MaterialStyleType } from '../../utils/types';
import CustomFormDetail from './CustomFormDetail.page';
import CustomFormStatistics from './CustomFormStatistics.page';
import { CustomForm } from '../../libs/custom-form/types';

type OwnProps = {
  classes: Object;
  tab: string;
  pushToTab: (id: number, tab: string) => void;
  id: number;
  t: TFunction;
};

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;
export const CustomFormDetailRouter = (props: Props) => (
  <div className={props.classes.container}>
    <AppBar position="static" color="default">
      <Tabs
        scrollButtons="off"
        variant="scrollable"
        value={props.tab}
        onChange={(e, newTab) => {
          props.pushToTab(props.id, newTab);
        }}
      >
        <Tab label={props.t('customForm.tab.general')} value="general" />
        <Tab label={props.t('customForm.tab.statistics')} value="statistics" />
      </Tabs>
    </AppBar>
    <div className={props.classes.content}>
      <Switch>
        <Route
          exact
          path="/custom-form/details/:id/statistics"
          component={CustomFormStatistics}
        />
        <Route
          path="/custom-form/details/:id/general"
          component={CustomFormDetail}
        />
        <Route path="/custom-form/details/:id" component={CustomFormDetail} />
      </Switch>
    </div>
  </div>
);
const styles = (theme: Theme) => ({
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
});

export default compose<any, Props>(
  routerParamsToProps({
    tab: 'tab',
    id: 'id:number',
  }),
  withTranslation('marketing'),
  withStyles(styles),
  connect(null, {
    pushToTab: (id: number, tab: string) =>
      push(`/custom-form/details/${id}/${tab}`),
  }),
  withTitle(({ customForm }: { customForm: CustomForm }) => {
    return customForm ? `${customForm.name}` : '';
  }),
)(CustomFormDetailRouter);
