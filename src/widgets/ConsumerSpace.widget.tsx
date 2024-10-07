import React from 'react';
import { compose, withHandlers } from 'recompose';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';

import {
  withStyles,
  createStyles,
} from 'bsport-saas/node_modules/@material-ui/core/styles';
import type { WithStyles } from 'bsport-saas/node_modules/@material-ui/core/styles';
import { connect } from 'react-redux';
import withLoginDisconnectedStatus from '../hocs/withLoginDisconnectedStatus.hoc';

/* IMPORT WIDGETS */
import { UnconnectedConsumerBookingPage } from 'bsport-saas/src/pages/consumer/ConsumerBookingReworked.page';
import { UnconnectedConsumerPass } from 'bsport-saas/src/pages/consumer/ConsumerPassReworked.page';
import {
  UnconnectedConsumerSubscription,
  consumerSubscriptionMapWithHandlers,
} from 'bsport-saas/src/pages/consumer/ConsumerSubscriptionReworked.page';
import { UnconnectedConsumerProfile } from 'bsport-saas/src/pages/consumer/ConsumerProfileReworked.page';
import {
  UnconnectedConsumerInvoiceReworked,
  mapWithConsumerInvoiceReworkedHandlers,
} from 'bsport-saas/src/pages/consumer/ConsumerInvoiceReworked.page';

/* COMPONENTS & UTILS */
import ConsumerNavigation from 'bsport-saas/src/libs/consumer-space/components/reworked/@Navigation/ConsumerNavigation/ConsumerNavigation.component';
import {
  consumerBookingBridgeSelectors,
  consumerInvoiceBridgeSelectors,
  consumerPassBridgeSelectors,
  consumerProfileBridgeSelectors,
  consumerSpaceCommonBridgeSelectors,
  consumerSubscriptionBridgeSelectors,
} from '../libs/bridge/consumer-space/consumerSpaceBridgeSelectors';
import withPostMessageOnPropsUpdate from 'bsport-saas/src/hocs/postMessages/with-post-message-on-props-update';
import withPostMessageToUpdateProps from 'bsport-saas/src/hocs/postMessages/with-post-message-to-update-props';
import { ConsumerSpacePageValidationSchema } from 'bsport-saas/src/libs/marketplace/utils/post-message-props-update';

/* TYPES */
import type { CompanyTheme } from 'bsport-saas/src/libs/theme/types';
import type {
  ConsumerSpaceWidgetConfig,
  ConsumerSpaceWidgetPage,
} from 'bsport-saas/src/libs/exportable-components/types';
import {
  consumerBookingBridgeActions,
  consumerInvoiceBridgeActions,
  consumerPassBridgeActions,
  consumerProfileBridgeActions,
  consumerSpaceCommonBridgeActions,
  consumerSubscriptionBridgeActions,
} from '../libs/bridge/consumer-space/consumerSpaceBridgeActions';
import { ConsumerSpaceContextEnum } from 'bsport-saas/src/libs/consumer-space/constants';

type OwnProps = {
  companyId: number,
  theme: CompanyTheme,
  timezone: string,
  config: ConsumerSpaceWidgetConfig,
  /** Dynamic prop that can change  with postMessages */
  page: ConsumerSpaceWidgetPage,
};

type ConnectedProps = ReturnType<typeof consumerSpaceCommonBridgeSelectors> &
  typeof consumerSpaceCommonBridgeActions;

type State = {
  selectedPage: ConsumerSpaceWidgetPage,
};

type Props = OwnProps & WithStyles<ReturnType<typeof styles>> & ConnectedProps;

/* IMPORT CONSUMER SPACE PAGES */
const ConsumerBookingPageStyled = themify(UnconnectedConsumerBookingPage);
const ConsumerPassPageStyled = themify(UnconnectedConsumerPass);
const ConsumerSubscriptionPageStyled = themify(UnconnectedConsumerSubscription);
const ConsumerProfilePageStyled = themify(UnconnectedConsumerProfile);
const ConsumerInvoicePageStyled = themify(UnconnectedConsumerInvoiceReworked);

const ConsumerBookingWidget = compose(
  connect(consumerBookingBridgeSelectors, consumerBookingBridgeActions),
)(ConsumerBookingPageStyled);

const ConsumerPassWidget = compose(
  connect(consumerPassBridgeSelectors, consumerPassBridgeActions),
)(ConsumerPassPageStyled);

const ConsumerSubscriptionWidget = compose(
  connect(
    consumerSubscriptionBridgeSelectors,
    consumerSubscriptionBridgeActions,
  ),
  withHandlers(consumerSubscriptionMapWithHandlers),
)(ConsumerSubscriptionPageStyled);

const ConsumerProfileWidget = compose(
  connect(consumerProfileBridgeSelectors, consumerProfileBridgeActions),
)(ConsumerProfilePageStyled);

const ConsumerInvoiceWidget = compose(
  connect(consumerInvoiceBridgeSelectors, consumerInvoiceBridgeActions),
  withHandlers(mapWithConsumerInvoiceReworkedHandlers),
)(ConsumerInvoicePageStyled);

class ConsumerSpaceWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedPage:
        props.page || props.config?.defaultPage || 'consumerBooking',
    };
  }

  componentDidUpdate(prevProps: Props) {
    /** If page prop changed from a post message, change state */
    if (prevProps.page !== this.props.page) {
      this.changePage(this.props.page);
    }
    if (
      !!this.props.membership?.id &&
      prevProps.membership?.id !== this.props.membership?.id
    ) {
      this.props.fetchMember(this.props.membership?.id);
    }
  }

  /** Set the current member profile page */
  changePage = (page: OwnProps['page']) => {
    this.setState(() => ({
      selectedPage: page,
    }));
  };

  signOut = () => this.props.bridgeRequestLogout();

  getCurrentConsumerWidget = () => {
    switch (this.state.selectedPage) {
      case 'consumerBooking':
        return <ConsumerBookingWidget {...this.props} />;
      case 'consumerInvoice':
        return <ConsumerInvoiceWidget {...this.props} />;
      case 'consumerPass':
        return <ConsumerPassWidget {...this.props} />;
      case 'consumerProfile':
        return <ConsumerProfileWidget {...this.props} />;
      case 'consumerSubscription':
        return <ConsumerSubscriptionWidget {...this.props} />;
      default:
        return <ConsumerBookingWidget {...this.props} />;
    }
  };

  render() {
    return (
      // @ts-expect-error children prop typing
      <ConsumerNavigation
        context={ConsumerSpaceContextEnum.WIDGET}
        memberName={
          this.props.getMember(this.props.membership?.id)?.firstname ?? ''
        }
        changeWidgetPage={this.changePage}
        selectedWidgetPage={this.state.selectedPage}
        widgetSignOut={this.signOut}
        widgetHideNavigation={this.props.config?.hideNavigation}
      >
        {this.getCurrentConsumerWidget()}
      </ConsumerNavigation>
    );
  }
}

const styles = () =>
  createStyles({
    container: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  });

export default compose<Props, OwnProps>(
  connect(consumerSpaceCommonBridgeSelectors, consumerSpaceCommonBridgeActions),
  withStyles(styles),
  withLoginDisconnectedStatus,
  withPostMessageOnPropsUpdate([
    { propName: 'page', messageType: 'bsport:consumerspace:page:change' },
  ]),
  withPostMessageToUpdateProps([
    {
      propName: 'page',
      messageType: 'bsport:consumerspace:page:change',
      validationSchema: ConsumerSpacePageValidationSchema,
    },
  ]),
)(ConsumerSpaceWidget);
