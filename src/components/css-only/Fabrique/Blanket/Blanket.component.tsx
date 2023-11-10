import React, { MouseEvent, useCallback } from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import './styles.css';

type Props = {
  children: React.ReactNode;
  className?: string;
  classes?: { content: string };
  isOpen: boolean;
  onClick?: () => void;
};

export const Blanket: React.FC<Props> = ({
  children,
  className,
  classes,
  isOpen,
  onClick,
}) => {
  /* We dont want to close the blanket when the content of the blanket is clicked */
  const handleOnContentClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => event.stopPropagation(),
    [],
  );

  return (
    isOpen && (
      <div
        className={classNames('bs-fabrique-blanket', className)}
        onClick={onClick}
        role="presentation"
      >
        <div
          className={classNames(
            'bs-fabrique-blanket-content',
            classes?.content,
          )}
          onClick={handleOnContentClick}
          role="presentation"
        >
          {children}
        </div>
      </div>
    )
  );
};

export const BlanketStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Blanket>>()(Blanket);

export default React.memo(Blanket);
