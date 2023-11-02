import React from 'react';
import classnames from 'classnames';
import { Route, Switch } from 'react-router';
import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { compose, withHandlers, withState } from 'recompose';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import { WithTranslation, withTranslation } from 'react-i18next';

// @ts-expect-error : Not typed hoc
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import type { RootState } from '../../reducers';
import InboxThreadList from './InboxThreadList.page';
import InboxThreadContainer from './InboxThreadContainer.page';
import { getInboxThreadFromSelectedId } from '#libs/communication-v2/selectors';
import { fetchInboxThreadFromId as fetchInboxThreadFromIdAction } from '#libs/communication-v2/actions';
import InboxPanel from './InboxPanel.page';
import { drawerIconsOnlyWith } from '#components/navigation/BackofficeDrawer/BackofficeDrawer.component';
import UpsellBlocker from '#libs/platform-billing/components/UpsellBlocker.component';
import { UPSELL_IDENTIFIER_INBOX } from '#libs/platform-billing/upsell-identifiers';
import {
  fetchUpsellPackage as fetchUpsellPackageAction,
  requestUpsellPackage as requestUpsellPackageAction,
  subscribeUpsellPackage as subscribeUpsellPackageAction,
} from '#libs/platform-billing/actions';
import { getFeatureList as getFeatureListAction } from '#libs/company/actions';
// @ts-expect-error
import { getUpsellPackageByIdentifier } from '#libs/platform-billing/selectors';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import UpsellPackageSubscriptionDrawer from '#libs/platform-billing/components/UpsellPackageSubscriptionDrawer.component';

import type { UpsellPackage } from '#libs/company/types';

const INBOX_PANEL_WIDTH = 378;

const { trackFormAdd, trackFormSubmitIntent, trackFormSuccess } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.UpsellSubscription,
  );

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
  onRequestUpsell: () => void;
};

type Props = {
  id: number | undefined;
  width: Breakpoint;
} & InboxConnectedProps &
  WithHandlers &
  WithStyles<typeof styles> &
  WithTranslation;

type ComponentState = {
  openSubscribtionForm: boolean;
  openConfirmationDialog: boolean;
  upsellSubscriptionLoading: boolean;
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
    openSubscribtionForm: false,
    openConfirmationDialog: false,
    upsellSubscriptionLoading: false,
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
      openSubscribtionForm: true,
    });
    trackFormAdd(this.props.upsellPackage?.id);
  };

  handleSubscribeUpsellPackage = () => {
    if (!this.props.upsellPackage) {
      return;
    }
    this.setState({ upsellSubscriptionLoading: true });
    trackFormSubmitIntent(this.props.upsellPackage?.id);
    this.props.subscribeUpsellPackage(this.props.upsellPackage?.id, {
      onSuccess: () => {
        trackFormSuccess(this.props.upsellPackage?.id);
        this.handleCloseSubscriptionForm();
        this.setState({ upsellSubscriptionLoading: false });
        this.setState({ openConfirmationDialog: true });
      },
      onError: () => {
        this.handleCloseSubscriptionForm();
        this.setState({ upsellSubscriptionLoading: false });
      },
    });
  };

  handleCloseSubscriptionForm = () => {
    this.setState({ openSubscribtionForm: false });
  };

  handleCloseConfirmationDialog = () =>
    this.setState({ openConfirmationDialog: false });

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
          className={classnames(classes.threadContainer, {
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
          className={classnames(classes.inboxPanel, {
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
        <UpsellPackageSubscriptionDrawer
          loading={this.state.upsellSubscriptionLoading}
          onClose={this.handleCloseSubscriptionForm}
          onCloseDialog={this.handleCloseConfirmationDialog}
          onKnowMore={this.props.onRequestUpsell}
          onSubscribe={this.handleSubscribeUpsellPackage}
          open={this.state.openSubscribtionForm}
          openDialog={this.state.openConfirmationDialog}
          upsellPackage={this.props.upsellPackage}
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
    onRequestUpsell:
      ({ requestUpsellPackage }: InboxConnectedProps) =>
      () => {
        requestUpsellPackage(UPSELL_IDENTIFIER_INBOX);
        // // @ts-expect-error
        // window.Intercom('trackEvent', 'Upsell feature requested', {
        //   upsellIdentifier: UPSELL_IDENTIFIER_INBOX,
        // });
      },
  }),
  withWidth(),
  withStyles(styles),
)(InboxContainer);
