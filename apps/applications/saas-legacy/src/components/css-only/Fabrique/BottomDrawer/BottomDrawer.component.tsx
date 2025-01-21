import React, { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import Blanket, { Props as BlanketProps } from '#Fabrique/Blanket';
import ModalDialog, { Props as ModalDialogProps } from '#Fabrique/ModalDialog';
import { ModalDialogSizeEnum } from '#Fabrique/ModalDialog/constants';

import './styles.css';

export type Props = {
  /** If `true` the drawer dialog takes all of the screen */
  isExpanded?: boolean;
  /** Content displayed in the dialog */
  children?: React.ReactNode;
  /** Optional CSS class name to pass to blanket element (overrides `blanketProps.className`) */
  className?: string;
  /** Blanket component props */
  blanketProps?: Omit<BlanketProps, 'children'>;
  /** Modal component props */
  modalDialogProps?: Omit<ModalDialogProps, 'children'>;
};

export const BottomDrawer: React.FC<Props> = ({
  isExpanded,
  children,
  className,
  blanketProps,
  modalDialogProps,
}) => {
  /**
   * Internal state + useEffect and Ref to prevent double scrolling
   * from the body element. We set the overflow + padding whenever
   * the blanket is open and revert it on close.
   */
  const bodyElementRef = useRef<HTMLBodyElement | null>(null);
  const [isBlanketOpen, setIsBlanketOpen] = useState(false);

  useEffect(() => {
    /**
     * Set a body element ref on blanket opening. Used to apply
     * and revert styles on open/close of the drawer
     */
    if (blanketProps.isOpen) {
      const blanketElement = document.querySelector(
        '.bs-fabrique-bottom-drawer__blanket',
      );
      bodyElementRef.current = blanketElement?.closest('body');
    }
    /**
     * Apply here:
     * - Hidden overflow to prevent double scrolling and so 'freeze'
     * background container.
     *
     * more at https://github.com/mui/material-ui/blob/553cf822f6500075d374f3e89ad04b8308cd9f47/docs/data/base/components/modal/modal.md#overflow-layout-shift
     */
    if (blanketProps.isOpen && !isBlanketOpen && bodyElementRef.current) {
      bodyElementRef.current.style.cssText =
        'overflow: hidden; position: fixed; width: 100%';

      setIsBlanketOpen(true);
    }
    /**
     * Revert all styling applied on blanket opening.
     */
    if (!blanketProps.isOpen && isBlanketOpen && bodyElementRef.current) {
      bodyElementRef.current.style.cssText =
        'overflow: initial; padding-right: initial; position: initial;';

      setIsBlanketOpen(false);
    }
  }, [blanketProps.isOpen, isBlanketOpen]);

  return (
    <Blanket
      {...blanketProps}
      classes={{
        content: clsx(
          'bs-fabrique-bottom-drawer__blanket-content',
          {
            'bs-fabrique-bottom-drawer__blanket-content--expanded': isExpanded,
          },
          blanketProps?.classes?.content,
        ),
      }}
      className={clsx('bs-fabrique-bottom-drawer__blanket', className)}
    >
      <ModalDialog
        {...modalDialogProps}
        isFullWidth
        className={clsx(
          'bs-fabrique-bottom-drawer__modal-dialog',
          {
            'bs-fabrique-bottom-drawer__modal-dialog--expanded': isExpanded,
          },
          modalDialogProps?.className,
        )}
        size={ModalDialogSizeEnum.XS}
      >
        {children}
      </ModalDialog>
    </Blanket>
  );
};

export const BottomDrawerStorybook = marketplaceCssHoc<Props>()(BottomDrawer);

export default React.memo(BottomDrawer);
