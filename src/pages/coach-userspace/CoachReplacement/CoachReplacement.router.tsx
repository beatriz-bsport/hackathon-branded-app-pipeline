import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { compose } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import { Tab } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

import themeSelectors from '../../../libs/theme/selectors';
import CoachReplacementCalendar from './CoachReplacementCalendar.page';
import CoachReplacementRequests from './CoachReplacementRequests.page';
import CoachReplacementConfirmations from './CoachReplacementConfirmations.page';
import CoachReplacementMarketplace from './CoachReplacementMarketplace.page';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import withTitle from '../../../hocs/with-title.hoc';
import { RootState } from '../../../reducers';

type OwnProps = {
  companyId: string;
  tab: string;
};

type Props = OwnProps & WithTranslation & ConnectedProps<typeof connector>;

export const CoachReplacementRouter = (props: Props) => {
  const { t } = props;
  const classes = useStyles();

  const handleTabChange = React.useCallback(
    (e, newTab) => props.pushToTab(props.companyId, newTab),
    [props],
  );

  if (!props.tab && props.companyId) {
    return <Redirect to={`/co/${props.companyId}/replacement/calendar/`} />;
  }

  return (
    <div className={classes.container}>
      <AppBar position="static" color="default">
        <Tabs
          scrollButtons="off"
          variant="scrollable"
          value={props.tab}
          onChange={handleTabChange}
        >
          <Tab label={t('calendar.title')} value="calendar" />
          <Tab label={t('requests.title')} value="requests" />
          <Tab label={t('confirmations.title')} value="confirmations" />
          <Tab label={t('marketplace.title')} value="marketplace" />
        </Tabs>
      </AppBar>
      <div className={classes.content}>
        <Switch>
          <Route
            exact
            path="/co/:companyId/replacement/requests/"
            component={CoachReplacementRequests}
          />
          <Route
            exact
            path="/co/:companyId/replacement/confirmations/"
            component={CoachReplacementConfirmations}
          />
          <Route
            exact
            path="/co/:companyId/replacement/marketplace/"
            component={CoachReplacementMarketplace}
          />
          <Route path="/" component={CoachReplacementCalendar} />
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
  pushToTab: (companyId: string, tab: string) =>
    push(`/co/${companyId}/replacement/${tab}`),
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withTranslation(['replacement', 'titles']),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:coachUserSpace.replacement'),
  ),
  routerParamsToProps({
    tab: 'tab',
    companyId: 'companyId',
  }),
  connector,
)(CoachReplacementRouter);
