import React from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import ConsumerGenericFooter from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericFooter';
import type { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';

import './styles.css';

export type Props = {
  buttonsData?: HeaderButton[];
  /** Content node of the page content container */
  children: React.ReactNode;
  /** Optional root element class name */
  className?: string;
  /** Optional root element class name */
  classes?: {
    children: string;
  };
  isMobile?: boolean;
};

/**
 * Harmonize page content behavior across all marketplace pages to avoid unwanted stuff
 */
const MarketplacePageContent: React.FC<Props> = ({
  buttonsData,
  children,
  className,
  classes,
  isMobile,
}) => {
  const buttons = buttonsData ?? [];
  return (
    <div className={classNames('bs-marketplace-page-content-root', className)}>
      <div
        className={classNames(
          'bs-marketplace-page-content-root__children',
          classes?.children,
        )}
      >
        {children}
      </div>
      {isMobile && !!buttons.length && (
        <ConsumerGenericFooter buttons={buttons} />
      )}
    </div>
  );
};

export const MarketplacePageContentStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof MarketplacePageContent>
>()(MarketplacePageContent);

export default React.memo(MarketplacePageContent);
