import React, { memo, ReactNode } from 'react';
import clsx from 'clsx';
import Collapse from '#src/components/css-only/Fabrique/Collapse';
import { ChevronDown } from '#src/components/untitledui';
import Title from '#src/components/css-only/Fabrique/Title';
import './style.css';

type ExpandableContentProps = {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  id: string;
  initiallyOpen?: boolean;
  title: string;
};

/**
 * A styled collapsible content component using the Fabrique primitive Collapse.
 *
 * @param {string} [props.ariaLabel] - Optional aria-label for the expand/collapse button.
 * @param {ReactNode} props.children - The content to be displayed inside the collapsible section.
 * @param {string} [props.className] - Additional class names for styling the root collapse component.
 * @param {string} props.id - Unique identifier for the component.
 * @param {boolean} [props.initiallyOpen=false] - Determines whether the collapsible content is open by default.
 * @param {string} props.title - The title displayed on the collapsible header.
 *
 * @returns {JSX.Element} The rendered expandable content component.
 */
const ExpandableContent: React.FC<ExpandableContentProps> = ({
  ariaLabel,
  children,
  className,
  id,
  initiallyOpen = false,
  title,
}) => {
  const contentId = `${id}-content`;

  return (
    <Collapse className={className} id={id} initiallyOpen={initiallyOpen}>
      <Collapse.Controller>
        {({ isCollapseOpen, toggleCollapse, collapseProps }) => {
          return (
            <button
              {...collapseProps}
              aria-controls={contentId}
              aria-expanded={isCollapseOpen}
              aria-label={ariaLabel || title}
              className={clsx('bs-expandable-controller', {
                expanded: isCollapseOpen,
              })}
              onClick={toggleCollapse}
              type="button"
            >
              <Title
                className="bs-expandable-controller__title"
                title={title}
                variant="sm"
              />
              <ChevronDown
                aria-hidden="true"
                className="bs-expandable-controller__arrow"
                stroke="currentColor"
              />
            </button>
          );
        }}
      </Collapse.Controller>
      <Collapse.Content>
        <div
          aria-labelledby={id}
          className="bs-expandable-content"
          id={contentId}
          role="region"
        >
          {children}
        </div>
      </Collapse.Content>
    </Collapse>
  );
};

export default memo(ExpandableContent);
