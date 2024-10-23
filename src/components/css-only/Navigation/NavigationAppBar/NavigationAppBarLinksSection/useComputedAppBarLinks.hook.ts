import { RefObject, useCallback, useEffect, useState } from 'react';

import useParentSize from '#src/hooks/useParentSize';

import type { AppBarTab } from '#src/components/css-only/Navigation/NavigationAppBar/types';
import type { SubmenuItem } from '#src/components/css-only/Fabrique/Submenu/types';

/** Compute not from the actual element size but from a restrained width to prevent potential overlaps */
const AVAILABLE_SPACE_SECURED_COMPUTING_WIDTH = 32;

/**
 * Computes the number of visible/hidden links in the app bar
 * Smart computation made on initial render + resize event
 *
 * @param links The list of initial marketplace tabs to render
 * @param computedRef The ref object of the hidden links app bar used for computation
 * @param visibleLinksRef The ref object of the available space for visible links
 */
export function useComputedAppBarLinks({
  links,
  computedRef,
  visibleLinksRef,
}: {
  links: AppBarTab[];
  computedRef: RefObject<HTMLDivElement>;
  visibleLinksRef: RefObject<HTMLDivElement>;
}) {
  const { width } = useParentSize(visibleLinksRef);
  const availableWidth = width - AVAILABLE_SPACE_SECURED_COMPUTING_WIDTH;

  const [visibleAppBarLinks, setVisibleAppBarLinks] = useState<AppBarTab[]>([]);
  const [hiddenAppBarLinks, setHiddenAppBarLinks] = useState<SubmenuItem[]>([]);

  const computeLinksSection = useCallback(() => {
    if (computedRef?.current && !!availableWidth) {
      let renderedButtonsWidth = 0;
      const visibleLinks: AppBarTab[] = [];
      const hiddenLinks: SubmenuItem[] = [];

      for (let i = 0; i < links?.length; i++) {
        const childNodeWidth = Math.round(
          computedRef?.current.children[i].clientWidth,
        );

        if (renderedButtonsWidth + childNodeWidth < availableWidth) {
          visibleLinks.push(links[i]);
          renderedButtonsWidth += childNodeWidth;
        } else {
          hiddenLinks.push({
            title: links[i].label,
            isSelected: links[i].isSelected,
            onClick: links[i].onClick,
          });
        }
      }

      setVisibleAppBarLinks(visibleLinks);
      setHiddenAppBarLinks(hiddenLinks);
    }
  }, [availableWidth, computedRef, links]);

  useEffect(() => {
    computeLinksSection();

    window.addEventListener('resize', computeLinksSection);
    return () => {
      window.removeEventListener('resize', computeLinksSection);
    };
  }, [computeLinksSection, computedRef, visibleLinksRef]);

  return {
    visibleAppBarLinks,
    hiddenAppBarLinks,
  };
}
