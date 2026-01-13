import React from 'react';

import { Store } from 'redux';
import { compose } from 'recompose';

import { withStyles } from '@bsport/saas-legacy/node_modules/@material-ui/core/styles';
import themify from '@bsport/saas-legacy/src/hocs/company-themifier.hoc';
import { ConsumerReferralDetailsPage } from '@bsport/saas-legacy/src/pages/consumer/ConsumerReferralDetail.page';
import type { Theme } from '@bsport/saas-legacy/src/libs/theme/types';

import {
  closeUserInteractionPortal as closeUserInteractionPortalAction,
  genericShowLogin as genericShowLoginAction,
} from '../libs/modal/actions';
import type { DialogMode } from '../libs/modal/types';

const ReferralWidgetStyled = themify(ConsumerReferralDetailsPage);

type OwnProps = {
  companyId: number;
  store: Store;
  theme: Theme;
  authenticated: boolean;
  dialogMode: DialogMode;
  parentElement: string;
};

type Props = OwnProps & typeof mapDispatchToWidgetProps;

const ReferralWidget = (props: Props) => {
  const { showLogin, dialogMode, parentElement, companyId } = props;
  const onLoginClick = () => {
    showLogin({
      dialogMode: dialogMode,
      widgetType: 'referral',
      parentElementId: parentElement,
    });
  };

  return (
    <ReferralWidgetStyled
      {...props}
      companyId={companyId}
      onLoginClick={onLoginClick}
    />
  );
};

const styles = () => ({
  container: {
    width: '100%',
  },
});

const mapDispatchToWidgetProps = {
  showLogin: genericShowLoginAction,
  closeUserInteractionPortal: closeUserInteractionPortalAction,
};

export default compose<Props, OwnProps>(withStyles(styles))(ReferralWidget);
