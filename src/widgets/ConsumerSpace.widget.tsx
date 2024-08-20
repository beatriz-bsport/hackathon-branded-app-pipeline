import React from 'react';
import { compose, withHandlers } from 'recompose';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';

import {
  withStyles,
  createStyles,
} from 'bsport-saas/node_modules/@material-ui/core/styles';
import type { WithStyles } from 'bsport-saas/node_modules/@material-ui/core/styles';
import { connect } from 'react-redux';
import { CompanyTheme } from 'bsport-saas/src/libs/theme/types';
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
import ConsumerNavigation from 'bsport-saas/src/libs/consumer-space/components/reworked/@Navigation/ConsumerNavigation/ConsumerNavigation.component';
import useViewport from 'bsport-saas/src/components/css-only/Fabrique/hooks/useViewport';
import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from 'bsport-saas/src/libs/consumer-space/constants';

import { consumerSpaceMapStateToWidgetProps } from '../libs/bridge/consumer-space/consumerSpaceBridgeSelectors';
import { mapDispatchToWidgetProps } from '../libs/bridge/consumer-space/consumerSpaceBridgeActions';
import withPostMessageOnPropsUpdate from 'bsport-saas/src/hocs/postMessages/with-post-message-on-props-update';
import withPostMessageToUpdateProps from 'bsport-saas/src/hocs/postMessages/with-post-message-to-update-props';
import { ConsumerSpacePageValidationSchema } from 'bsport-saas/src/libs/marketplace/utils/post-message-props-update';

type OwnProps = {
  companyId: number,
  theme: CompanyTheme,
  timezone: string,
  /** Dynamic prop that can change  with postMessages */
  page:
    | 'consumerBooking'
    | 'consumerPass'
    | 'consumerInvoice'
    | 'consumerProfile'
    | 'consumerSubscription',
};

type ConnectedProps = ReturnType<typeof consumerSpaceMapStateToWidgetProps> &
  typeof mapDispatchToWidgetProps;

type State = {
  selectedPage: OwnProps['page'],
};

type Props = OwnProps & WithStyles<ReturnType<typeof styles>> & ConnectedProps;

type WidgetContentProps = {
  selectedPage: OwnProps['page'],
} & ConnectedProps;

/* IMPORT CONSUMER SPACE WIDGETS */
const ConsumerBookingWidgetStyled = themify(UnconnectedConsumerBookingPage);
const ConsumerPassWidgetStyled = themify(UnconnectedConsumerPass);
const ConsumerSubscriptionWidgetStyled = themify(
  UnconnectedConsumerSubscription,
);
const ConsumerProfileWidgetStyled = themify(UnconnectedConsumerProfile);
const ConsumerInvoiceWidgetStyled = themify(UnconnectedConsumerInvoiceReworked);

export const ConsumerSpaceWidgetContent: React.FC<WidgetContentProps> = (
  props,
) => {
  const { width } = useViewport();
  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  // TODO performance - better rendering handling
  return (
    <>
      {props.selectedPage === 'consumerBooking' && (
        <ConsumerBookingWidgetStyled isMobile={isMobile} {...props} />
      )}
      {props.selectedPage === 'consumerPass' && (
        <ConsumerPassWidgetStyled isMobile={isMobile} {...props} />
      )}
      {props.selectedPage === 'consumerInvoice' && (
        <ConsumerInvoiceWidgetStyled isMobile={isMobile} {...props} />
      )}
      {props.selectedPage === 'consumerProfile' && (
        <ConsumerProfileWidgetStyled isMobile={isMobile} {...props} />
      )}
      {props.selectedPage === 'consumerSubscription' && (
        <ConsumerSubscriptionWidgetStyled isMobile={isMobile} {...props} />
      )}
    </>
  );
};

class ConsumerSpace extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedPage: props.page || 'consumerBooking',
    };
  }

  componentDidMount() {
    this.props.bridgeRequestAuthenticationStatus();
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.authenticated && this.props.authenticated) {
      this.props.fetchMembershipByCompany(this.props.companyId);
      this.props.bridgeRequestAuthenticationStatus();
    }

    if (prevProps.page !== this.props.page) {
      this.changePage(this.props.page);
    }
  }

  /** Set the current member profile page */
  changePage = (page: OwnProps['page']) =>
    this.setState(() => ({
      selectedPage: page,
    }));

  render() {
    return (
      <ConsumerNavigation
        memberName={this.props.membership?.name}
        changeWidgetPage={this.changePage}
        selectedWidgetPage={this.state.selectedPage}
      >
        <ConsumerSpaceWidgetContent
          selectedPage={this.state.selectedPage}
          // TODO performance - restrict props to local page scope
          {...this.props}
        />
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
  withStyles(styles),
  connect(consumerSpaceMapStateToWidgetProps, mapDispatchToWidgetProps),
  withHandlers(mapWithConsumerInvoiceReworkedHandlers),
  withHandlers(consumerSubscriptionMapWithHandlers),
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
)(ConsumerSpace);
