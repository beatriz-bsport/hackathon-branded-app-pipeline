import React from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import './styles.css';

export type Props = {
  /** Content node of the page content container */
  children: React.ReactNode;
  /** Optional root element class name */
  className?: string;
  /** Optional root element class name */
  classes?: {
    children: string;
  };
};

/**
 * Harmonize page content behavior across all marketplace pages to avoid unwanted stuff
 */
const MarketplacePageContent: React.FC<Props> = ({
  children,
  className,
  classes,
}) => {
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
    </div>
  );
};

export const MarketplacePageContentStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof MarketplacePageContent>
>()(MarketplacePageContent);

export default React.memo(MarketplacePageContent);
