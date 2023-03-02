// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import { compose } from 'recompose';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { push } from 'connected-react-router';
import { withTranslation, TFunction } from 'react-i18next';
import { makeStyles } from '@material-ui/core';

import CoachDetail from './CoachDetail.page';
import CoachPrivateCalendar from './CoachPrivateCalendar.page';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withPageHeightHOC from '#hocs/with-page-height.hoc';
import { APP_HEIGHT } from '../constants.ts';

type Props = {
  tab: string,
  pushToTab: (id: number, tab: string) => void,
  coachId: number,
  t: TFunction,
  pageHeight: number,
};

export const CoachDetailRouter = (props: Props) => {
  const fieldRef = React.useRef<HTMLInputElement>(null);

  // Is scrolling to the top when the page is loaded or refreshed, after layout and paint
  React.useEffect(() => {
    if (fieldRef.current) {
      fieldRef.current.scrollIntoView();
    }
  }, []);

  const { pageHeight } = props;
  const classes = useStyles({ pageHeight });
  return (
    <div className={classes.container} ref={fieldRef}>
      <AppBar position="static" color="default">
        <Tabs
          scrollButtons="off"
          variant="scrollable"
          value={props.tab ? props.tab : 'general'}
          onChange={(e, newTab) => {
            props.pushToTab(props.coachId, newTab);
          }}
        >
          <Tab label={props.t('detail.tab.general')} value="general" />
          <Tab
            label={props.t('detail.tab.calendar')}
            value="private-calendar"
          />
        </Tabs>
      </AppBar>
      <div className={classes.content}>
        <div className={classes.insideContent}>
          <Switch>
            <Route
              exact
              path="/coach/:coachId/private-calendar"
              component={CoachPrivateCalendar}
            />
            <Route path="/coach/:coachId" component={CoachDetail} />
          </Switch>
        </div>
      </div>
    </div>
  );
};
const useStyles = makeStyles<{ pageHeight: number }>((theme) => ({
  container: {
    marginTop: theme.spacing(-3),
    width: '100vw',
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(-3),
      width: 'auto',
      marginRight: theme.spacing(-3),
      marginTop: theme.spacing(-2),
    },
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 100%',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    maxHeight: ({ pageHeight }) => pageHeight - APP_HEIGHT,
  },
  insideContent: {
    marginBottom: theme.spacing(8),
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(2),
      marginBottom: theme.spacing(8),
    },
    marginTop: theme.spacing(2),
  },
}));

export default compose(
  routerParamsToProps({
    tab: 'tab',
    coachId: 'coachId:number',
  }),
  withTranslation(['coach']),
  connect(null, {
    pushToTab: (id, tab) => push(`/coach/${id}/${tab}`),
  }),
  withPageHeightHOC(),
)(CoachDetailRouter);
