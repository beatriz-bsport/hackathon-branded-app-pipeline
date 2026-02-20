import { cva } from "class-variance-authority";
import React, { ReactNode, useId } from "react";

import Collapse from "../Collapse";
import Icon from "../Icon";

const accordionRoot = cva(["flex flex-col gap-lg"]);
const accordionItem = cva(["flex flex-col"]);
const headerButton = [
  "flex w-full flex-1 cursor-pointer items-center justify-between gap-xs",
  "border-none bg-transparent p-0 text-left font-inherit outline-none",
].join(" ");

type AccordionItemControllerRef = (
  value: boolean | ((prev: boolean) => boolean),
) => void;

export type AccordionItemProps = {
  /** Accessible label for the header trigger (required for a11y). */
  ariaLabel: string;
  /** Content to show when the section is open. */
  children: ReactNode;
  /** Additional classes for the collapsible container. */
  className?: string;
  /** Content inside the header button. The button and chevron are rendered by Accordion. */
  header: ReactNode;
  /** Optional actions between the header and the chevron. */
  headerActions?: ReactNode;
  /** Optional id for the section. */
  id?: string;
  /** When true, the section is expanded on mount. */
  initiallyOpen?: boolean;
  /** Optional ref that will receive the internal setOpen so the parent can open/close programmatically. */
  setOpenRef?: { current: AccordionItemControllerRef | null };
};

/**
 * Single accordion section: collapsible header + content.
 * The header is a div with role="button" (keyboard-accessible, aria-expanded) so
 * headerActions can contain real buttons without invalid nesting.
 * @unvalidated This component is not yet design-validated.
 */
const AccordionItem: React.FC<AccordionItemProps> = ({
  ariaLabel,
  children,
  className,
  header,
  headerActions,
  id: idProp,
  initiallyOpen,
  setOpenRef,
}) => {
  const generatedId = useId();
  const id = idProp ?? `accordion-${generatedId}`;

  return (
    <Collapse
      id={id}
      initiallyOpen={initiallyOpen}
      className={accordionItem({ className })}
    >
      <Collapse.Controller>
        {({ isCollapseOpen, setIsCollapseOpen }) => {
          if (setOpenRef) setOpenRef.current = setIsCollapseOpen;

          const onToggle = () => setIsCollapseOpen((prev) => !prev);

          const onKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle();
            }
          };

          return (
            <div
              role="button"
              tabIndex={0}
              className={headerButton}
              onClick={onToggle}
              onKeyDown={onKeyDown}
              aria-expanded={isCollapseOpen}
              aria-label={ariaLabel}
            >
              {header}
              <div className="flex items-center gap-xs">
                {headerActions != null ? (
                  <span
                    className="flex gap-xs"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    {headerActions}
                  </span>
                ) : null}
                <Icon
                  icon={isCollapseOpen ? "chevron-down" : "chevron-right"}
                  size="md"
                  className="shrink-0"
                />
              </div>
            </div>
          );
        }}
      </Collapse.Controller>
      <Collapse.Content>{children}</Collapse.Content>
    </Collapse>
  );
};

export type AccordionProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Accordion groups multiple collapsible sections. Each section has a header (trigger) and content.
 * Built on top of Collapse. Use Accordion.Item for each section.
 * @unvalidated This component is not yet design-validated.
 */
const AccordionRoot: React.FC<AccordionProps> = ({ children, className }) => (
  <div
    data-component="Kaizen-Accordion"
    className={accordionRoot({ className })}
  >
    {children}
  </div>
);

const Accordion = AccordionRoot as typeof AccordionRoot & {
  Item: typeof AccordionItem;
};

Accordion.Item = AccordionItem;
Accordion.displayName = "KaizenAccordion";

export default Accordion;
