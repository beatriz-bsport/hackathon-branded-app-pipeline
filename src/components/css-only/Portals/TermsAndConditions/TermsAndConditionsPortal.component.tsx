import React from 'react';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import { TermsAndConditionsModal, TermsAndConditionsBottomDrawer } from '.';

import type { TermsPortalProps } from '#csscomponents/Portals/types';

const TermsAndConditionsPortal: React.FC<TermsPortalProps> = ({
  terms,
  isMobile,
  isOpen,
  onClose,
  subtitle,
  title,
  cancelLabel,
}) => {
  if (isMobile) {
    return (
      <TermsAndConditionsBottomDrawer
        cancelLabel={cancelLabel}
        isOpen={isOpen}
        onClose={onClose}
        subtitle={subtitle}
        terms={terms}
        title={title}
      />
    );
  }
  return (
    <TermsAndConditionsModal
      cancelLabel={cancelLabel}
      isOpen={isOpen}
      onClose={onClose}
      subtitle={subtitle}
      terms={terms}
      title={title}
    />
  );
};

export const TermsAndConditionsPortalStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof TermsAndConditionsPortal>
>()(TermsAndConditionsPortal);
export default React.memo(TermsAndConditionsPortal);
