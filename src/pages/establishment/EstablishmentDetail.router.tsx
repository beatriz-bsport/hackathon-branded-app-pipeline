// @flow

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Route, Switch } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import { compose } from 'recompose';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { push } from 'connected-react-router';
import { withTranslation, WithTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core/styles';
import EstablishmentDetail from './EstablishmentDetail.page';
import EstablishmentCalendar from './EstablishmentCalendar.page';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

type OwnProps = {
  tab: string;
  id: number;
};

type Props = OwnProps & WithTranslation & ConnectedProps<typeof connector>;

export const EstablishmentDetailRouter = (props: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <AppBar position="static" color="default">
        <Tabs
          scrollButtons="off"
          variant="scrollable"
          value={props.tab}
          onChange={(e, newTab) => {
            props.pushToTab(props.id, newTab);
          }}
        >
          <Tab label={props.t('detail.tab.general')} value="general" />
          <Tab label={props.t('detail.tab.calendar')} value="calendar" />
        </Tabs>
      </AppBar>
      <div className={classes.content}>
        <Switch>
          <Route
            exact
            path="/establishment/details/:id/calendar"
            component={EstablishmentCalendar}
          />
          <Route
            path="/establishment/details/:id/general"
            component={EstablishmentDetail}
          />
          <Route
            path="/establishment/details/:id"
            component={EstablishmentDetail}
          />
        </Switch>
      </div>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
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

const mapDispatchToProps = {
  pushToTab: (id: number, tab: string) =>
    push(`/establishment/details/${id}/${tab}`),
};

const connector = connect(null, mapDispatchToProps);

export default compose<any, Props>(
  routerParamsToProps({
    tab: 'tab',
    id: 'id:number',
  }),
  withTranslation('establishment'),
  connector,
)(EstablishmentDetailRouter);
