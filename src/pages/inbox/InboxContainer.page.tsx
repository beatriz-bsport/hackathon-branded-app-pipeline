import React from 'react';
import { Route, Switch } from 'react-router';
import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import classnames from 'classnames';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { compose, withHandlers, withState } from 'recompose';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
// @ts-expect-error : Not typed hoc
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import type { RootState } from '../../reducers';
import InboxThreadList from './InboxThreadList.page';
import InboxThreadContainer from './InboxThreadContainer.page';
import { getInboxThreadFromSelectedId } from '#libs/communication-v2/selectors';
import { fetchInboxThreadFromId as fetchInboxThreadFromIdAction } from '#libs/communication-v2/actions';
import InboxPanel from './InboxPanel.page';
import { drawerIconsOnlyWith } from '#components/navigation/BackofficeDrawer/BackofficeDrawer.component';

const INBOX_PANEL_WIDTH = 550;

type State = {
  contextSelected: ChatThreadKinds;
  setContextSelected: (context: ChatThreadKinds, options?: () => void) => void;
  isPanelOpen: boolean;
  setIsPanelOpen: (isOpen: boolean) => void;
};

type InboxConnectedProps = { id?: number } & State &
  ConnectedProps<typeof connector>;

type WithHandlers = {
  fetchThreadOrRedirectToTheList: () => void;
};

type Props = {
  id: number | undefined;
  width: Breakpoint;
} & InboxConnectedProps &
  WithHandlers &
  WithStyles<typeof styles>;

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
    },
    threadList: {
      flex: 10,
      height: '100%',
    },
    threadContainer: {
      flex: 30,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 0,
    },
    noThread: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    inboxPanel: {
      height: '100%',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    noPanel: {
      display: 'none',
    },
    openPanel: {
      width: INBOX_PANEL_WIDTH,
      display: 'flex',
      flexDirection: 'column',
    },
    closedPanel: {
      width: drawerIconsOnlyWith,
    },
  });

class InboxContainer extends React.PureComponent<Props> {
  componentDidMount() {
    const { id, fetchThreadOrRedirectToTheList } = this.props;

    if (id) {
      fetchThreadOrRedirectToTheList();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { id, fetchThreadOrRedirectToTheList } = this.props;

    if (id && prevProps?.id !== id) {
      fetchThreadOrRedirectToTheList();
    }
  }

  render() {
    const {
      id,
      contextSelected,
      setContextSelected,
      thread,
      width,
      classes,
      isPanelOpen,
      setIsPanelOpen,
      isLoadingThread,
    } = this.props;

    const isMobile = isWidthDown('sm', width);

    if (isMobile) {
      return (
        <Switch>
          <Route exact path="/inbox/thread/:id/">
            <InboxThreadContainer selectedThreadId={id} thread={thread} />
          </Route>
          <Route exact path="/inbox/thread/">
            <InboxThreadList
              selectedThreadId={id}
              contextSelected={contextSelected}
              setContextSelected={setContextSelected}
            />
          </Route>
          <Route exact path="/inbox/thread/:id/detail/">
            <InboxPanel thread={thread} isLoadingThread={isLoadingThread} />
          </Route>
        </Switch>
      );
    }

    return (
      <div className={classes.container}>
        <div className={classes.threadList}>
          <InboxThreadList
            selectedThreadId={id}
            contextSelected={contextSelected}
            setContextSelected={setContextSelected}
            thread={thread}
          />
        </div>
        <Paper
          className={classnames(classes.threadContainer, {
            [classes.noThread]: !id,
          })}
          variant="outlined"
        >
          <InboxThreadContainer
            selectedThreadId={id}
            contextSelected={contextSelected}
            thread={thread}
          />
        </Paper>
        <div
          className={classnames(classes.inboxPanel, {
            [classes.noPanel]: !isLoadingThread && !thread,
            [classes.openPanel]: isPanelOpen,
            [classes.closedPanel]: !isPanelOpen,
          })}
        >
          <InboxPanel
            isPanelOpen={isPanelOpen}
            setIsPanelOpen={setIsPanelOpen}
            thread={thread}
            isLoadingThread={isLoadingThread}
          />
        </div>
      </div>
    );
  }
}

const connector = connect(
  (state: RootState, { id }: { id?: number }) => ({
    thread: getInboxThreadFromSelectedId(state, id),
    isLoadingThread: state.communicationV2.inboxThread.currentThread.loading,
  }),
  {
    fetchInboxThreadFromId: fetchInboxThreadFromIdAction,
    goToThreadList: () => push(`/inbox/thread/`),
  },
);

export default compose(
  withState('contextSelected', 'setContextSelected', ChatThreadKinds.Member),
  withState('isPanelOpen', 'setIsPanelOpen', false),
  routerParamsToProps({ id: 'id:number' }),
  connector,
  withHandlers({
    fetchThreadOrRedirectToTheList:
      ({ fetchInboxThreadFromId, id, goToThreadList }: InboxConnectedProps) =>
      () => {
        fetchInboxThreadFromId(id, {
          onError: () => {
            goToThreadList();
          },
        });
      },
  }),
  withWidth(),
  withStyles(styles),
)(InboxContainer);
