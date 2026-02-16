import React from 'react';
import clsx from 'clsx';
import { Route, Switch } from 'react-router';
import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { compose, withHandlers, withState } from 'recompose';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';
import { WithTranslation, withTranslation } from 'react-i18next';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { getInboxThreadFromSelectedId } from '#src/libs/communication-v2/selectors';
import { fetchInboxThreadFromId as fetchInboxThreadFromIdAction } from '#src/libs/communication-v2/actions';
import { drawerIconsOnlyWith } from '#src/components/navigation/BackofficeDrawer/BackofficeDrawer.component';
import UpsellBlocker from '#src/libs/platform-billing/components/UpsellBlocker.component';
import { UPSELL_IDENTIFIER_INBOX } from '#src/libs/platform-billing/upsell-identifiers';
import {
  fetchUpsellPackage as fetchUpsellPackageAction,
  requestUpsellPackage as requestUpsellPackageAction,
  subscribeUpsellPackage as subscribeUpsellPackageAction,
} from '#src/libs/platform-billing/actions';
import { getFeatureList as getFeatureListAction } from '#src/libs/company/actions';
// @ts-expect-error
import { getUpsellPackageByIdentifier } from '#src/libs/platform-billing/selectors';
import FeatureRequestDialog from '#src/libs/platform-billing/components/FeatureRequestDialog.component';

import type { UpsellPackage } from '#src/libs/company/types';
import InboxPanel from './InboxPanel.page';
import InboxThreadContainer from './InboxThreadContainer.page';
import InboxThreadList from './InboxThreadList.page';
import type { RootState } from '../../reducers';

const INBOX_PANEL_WIDTH = 378;

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
  WithStyles<typeof styles> &
  WithTranslation;

type ComponentState = {
  openFeatureRequestDialog: boolean;
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      position: 'relative',
    },
    threadList: {
      height: '100%',
      backgroundColor: theme.palette.common.white,
    },
    threadContainer: {
      flex: 1,
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
      backgroundColor: theme.palette.common.white,
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
    responsiveDrawerHeader: {
      marginBottom: theme.spacing(3),
    },
    responsiveDrawerContent: {
      padding: 0,
    },
  });

class InboxContainer extends React.PureComponent<Props, ComponentState> {
  state: ComponentState = {
    openFeatureRequestDialog: false,
  };

  componentDidMount() {
    const {
      id,
      width,
      fetchThreadOrRedirectToTheList,
      fetchUpsellPackage,
      setIsPanelOpen,
    } = this.props;

    if (isWidthUp('lg', width)) {
      setIsPanelOpen(true);
    }

    if (id) {
      fetchThreadOrRedirectToTheList();
    }

    fetchUpsellPackage(UPSELL_IDENTIFIER_INBOX);
  }

  componentDidUpdate(prevProps: Props) {
    const { id, fetchThreadOrRedirectToTheList } = this.props;

    if (id && prevProps?.id !== id) {
      fetchThreadOrRedirectToTheList();
    }
  }

  handleOpenSubscribtionForm = () => {
    if (!this.props.upsellPackage) {
      return;
    }
    this.setState({
      openFeatureRequestDialog: true,
    });
    this.props.requestUpsellPackage(UPSELL_IDENTIFIER_INBOX);
  };

  handleCloseFeatureRequestDialog = () => {
    this.setState({ openFeatureRequestDialog: false });
  };

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
            <>
              <UpsellBlocker
                handleOpenSubscriptionForm={this.handleOpenSubscribtionForm}
                upsellIdentifier={UPSELL_IDENTIFIER_INBOX}
                upsellPackage={this.props.upsellPackage}
              />
              <InboxThreadContainer thread={thread} />
            </>
          </Route>
          <Route exact path="/inbox/thread/">
            <>
              <UpsellBlocker
                handleOpenSubscriptionForm={this.handleOpenSubscribtionForm}
                upsellIdentifier={UPSELL_IDENTIFIER_INBOX}
                upsellPackage={this.props.upsellPackage}
              />
              <InboxThreadList
                contextSelected={contextSelected}
                setContextSelected={setContextSelected}
              />
            </>
          </Route>
          <Route exact path="/inbox/thread/:id/detail/">
            <>
              <UpsellBlocker
                handleOpenSubscriptionForm={this.handleOpenSubscribtionForm}
                upsellIdentifier={UPSELL_IDENTIFIER_INBOX}
                upsellPackage={this.props.upsellPackage}
              />
              <InboxPanel isLoadingThread={isLoadingThread} thread={thread} />
            </>
          </Route>
        </Switch>
      );
    }

    return (
      <div className={classes.container}>
        <UpsellBlocker
          handleOpenSubscriptionForm={this.handleOpenSubscribtionForm}
          upsellIdentifier={UPSELL_IDENTIFIER_INBOX}
          upsellPackage={this.props.upsellPackage}
        />
        <InboxThreadList
          contextSelected={contextSelected}
          setContextSelected={setContextSelected}
          thread={thread}
        />
        <Paper
          className={clsx(classes.threadContainer, {
            [classes.noThread]: !id,
          })}
          variant="outlined"
        >
          <InboxThreadContainer
            contextSelected={contextSelected}
            thread={thread}
          />
        </Paper>
        <div
          className={clsx(classes.inboxPanel, {
            [classes.noPanel]: !isLoadingThread && !id,
            [classes.openPanel]: isPanelOpen && !!id,
            [classes.closedPanel]: !isPanelOpen && !!id,
          })}
        >
          <InboxPanel
            isLoadingThread={isLoadingThread}
            isPanelOpen={isPanelOpen}
            setIsPanelOpen={setIsPanelOpen}
            thread={thread}
          />
        </div>
        <FeatureRequestDialog
          onClose={this.handleCloseFeatureRequestDialog}
          open={this.state.openFeatureRequestDialog}
        />
      </div>
    );
  }
}

const connector = connect(
  (state: RootState, { id }: { id?: number }) => ({
    thread: getInboxThreadFromSelectedId(state, id),
    isLoadingThread: state.communicationV2.inboxThread.currentThread.loading,
    upsellPackage: getUpsellPackageByIdentifier(
      state,
      UPSELL_IDENTIFIER_INBOX,
      { must_expensive: true },
    ) as UpsellPackage,
  }),
  {
    fetchInboxThreadFromId: fetchInboxThreadFromIdAction,
    goToThreadList: () => push(`/inbox/thread/`),
    fetchUpsellPackage: fetchUpsellPackageAction,
    subscribeUpsellPackage: subscribeUpsellPackageAction,
    getFeatureList: getFeatureListAction,
    requestUpsellPackage: requestUpsellPackageAction,
  },
);

export default compose(
  withTranslation(['platformBilling']),
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
