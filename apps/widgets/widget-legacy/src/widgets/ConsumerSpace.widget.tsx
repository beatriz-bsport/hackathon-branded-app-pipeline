import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';
import themify from '@bsport/saas-legacy/src/hocs/company-themifier.hoc';

import {
  withStyles,
  createStyles,
} from '@bsport/saas-legacy/node_modules/@material-ui/core/styles';
import type { WithStyles } from '@bsport/saas-legacy/node_modules/@material-ui/core/styles';
import { connect, ConnectedProps } from 'react-redux';
import withLoginDisconnectedStatus from '../hocs/withLoginDisconnectedStatus.hoc';

/* IMPORT WIDGETS */
import ConsumerBookingPage from '@bsport/saas-legacy/src/pages/consumer/ConsumerBookingReworked.page';
import ConsumerPassPage from '@bsport/saas-legacy/src/pages/consumer/ConsumerPassReworked.page';
import ConsumerSubscriptionPage from '@bsport/saas-legacy/src/pages/consumer/ConsumerSubscriptionReworked.page';
import ConsumerProfile from '@bsport/saas-legacy/src/pages/consumer/ConsumerProfileReworked.page';
import ConsumerInvoiceReworked from '@bsport/saas-legacy/src/pages/consumer/ConsumerInvoiceReworked.page';
import { bridgeRequestLogout as bridgeRequestLogoutAction } from '../libs/bridge/actions';

/* COMPONENTS & UTILS */
import ConsumerNavigation from '@bsport/saas-legacy/src/libs/consumer-space/components/reworked/@Navigation/ConsumerNavigation/ConsumerNavigation.component';
import withPostMessageOnPropsUpdate from '@bsport/saas-legacy/src/hocs/postMessages/with-post-message-on-props-update';
import withPostMessageToUpdateProps from '@bsport/saas-legacy/src/hocs/postMessages/with-post-message-to-update-props';
import { ConsumerSpacePageValidationSchema } from '@bsport/saas-legacy/src/libs/marketplace/utils/post-message-props-update';

/* TYPES */
import type { CompanyTheme } from '@bsport/saas-legacy/src/libs/theme/types';
import type {
  ConsumerSpaceWidgetConfig,
  ConsumerSpaceWidgetPage,
} from '@bsport/saas-legacy/src/libs/exportable-components/types';
import { ConsumerSpaceContextEnum } from '@bsport/saas-legacy/src/libs/consumer-space/constants';
import WidgetUtils from '@bsport/saas-legacy/src/libs/widget/WidgetUtils';
import { RootState } from '@bsport/saas-legacy/src/reducers';
import { getMembership } from '@bsport/saas-legacy/src/libs/membership/selectors';
import { fetchMembershipByCompany as fetchMembershipByCompanyAction } from '@bsport/saas-legacy/src/libs/membership/actions';

type OwnProps = {
  companyId: number;
  theme: CompanyTheme;
  timezone: string;
  config: ConsumerSpaceWidgetConfig;
  /** Dynamic prop that can change  with postMessages */
  page: ConsumerSpaceWidgetPage;
};

type Props = OwnProps &
  WithStyles<ReturnType<typeof styles>> &
  ConnectedProps<typeof connector>;

/* IMPORT CONSUMER SPACE PAGES */
// @ts-expect-error - Type mismatch between different @types/react versions
const ConsumerBookingWidget = themify(ConsumerBookingPage);
// @ts-expect-error - Type mismatch between different @types/react versions
const ConsumerInvoiceWidget = themify(ConsumerInvoiceReworked);
// @ts-expect-error - Type mismatch between different @types/react versions
const ConsumerPassWidget = themify(ConsumerPassPage);
// @ts-expect-error - Type mismatch between different @types/react versions
const ConsumerProfileWidget = themify(ConsumerProfile);
// @ts-expect-error - Type mismatch between different @types/react versions
const ConsumerSubscriptionWidget = themify(ConsumerSubscriptionPage);

const ConsumerSpaceWidget = (props: Props) => {
  const {
    page,
    config,
    bridgeRequestLogout,
    companyId,
    fetchMembershipByCompany,
    membership,
  } = props;
  const [selectedPage, setSelectedPage] = useState<ConsumerSpaceWidgetPage>(
    page || config?.defaultPage || 'consumerBooking',
  );

  const changePage = (page: ConsumerSpaceWidgetPage) => setSelectedPage(page);

  useEffect(() => {
    WidgetUtils.setConsumerSpaceContext(ConsumerSpaceContextEnum.WIDGET);
  }, []);

  useEffect(() => {
    changePage(page);
  }, [page]);

  useEffect(() => {
    fetchMembershipByCompany(companyId);
  }, [companyId]);

  const getCurrentConsumerWidget = () => {
    switch (selectedPage) {
      case 'consumerBooking':
        return <ConsumerBookingWidget {...props} />;
      case 'consumerInvoice':
        return <ConsumerInvoiceWidget {...props} />;
      case 'consumerPass':
        return <ConsumerPassWidget {...props} />;
      case 'consumerProfile':
        return <ConsumerProfileWidget {...props} />;
      case 'consumerSubscription':
        return <ConsumerSubscriptionWidget {...props} />;
      default:
        return <ConsumerBookingWidget {...props} />;
    }
  };

  return (
    // @ts-expect-error children prop typing
    <ConsumerNavigation
      memberName={membership?.name ?? ''}
      changeWidgetPage={changePage}
      selectedWidgetPage={selectedPage}
      widgetSignOut={bridgeRequestLogout}
      widgetHideNavigation={config?.hideNavigation}
    >
      {getCurrentConsumerWidget()}
    </ConsumerNavigation>
  );
};

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

const mapStateToProps = (state: RootState, { companyId }: OwnProps) => ({
  membership: getMembership(state, companyId),
});
const mapDispatchToProps = {
  bridgeRequestLogout: bridgeRequestLogoutAction,
  fetchMembershipByCompany: fetchMembershipByCompanyAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose<Props, OwnProps>(
  connector,
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
