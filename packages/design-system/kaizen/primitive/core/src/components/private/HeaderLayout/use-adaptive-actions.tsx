import React, { ReactElement, useId, useMemo } from "react";

import Button, { type ButtonProps } from "#src/components/Button";
import DropdownMenu from "#src/components/DropdownMenu";
import { useMatchMedia } from "#src/hooks/use-match-media";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

type AdaptiveAction = ReactElement<ButtonProps>;

export type AdaptiveActionsInput = {
  endGroupActions?: Array<AdaptiveAction>;
  startGroupActions?: Array<AdaptiveAction>;
};

export type AdaptiveActionsOutput = {
  endGroupActions: Array<React.ReactNode>;
  startGroupActions?: Array<React.ReactNode>;
};

function extractButtonProps(element: AdaptiveAction): ButtonProps {
  return element.props;
}

/**
 * Hook to transform button actions into a dropdown menu on mobile devices
 *
 * On mobile (!useMatchMedia("sm")), this hook takes button elements from
 * `startGroupActions` and `endGroupActions`, combines them, and returns a
 * dropdown menu containing all actions.
 *
 * On desktop (>= sm breakpoint), it returns the original props unchanged.
 *
 * @param props.endGroupActions - Array of Button elements to display
 * @param props.startGroupActions - Array of Button elements to display
 * @returns Object with startGroupActions (and optionally endGroupActions) as ReactNode arrays
 *
 * @example
 * ```tsx
 * const adaptiveActions = useAdaptiveActions({
 *   endGroupActions: [
 *     <Button label="Edit" iconLeft="pencil-02" intent="flat" color="default" size="md" />,
 *     <Button label="Delete" iconLeft="trash-01" intent="flat" color="default" size="md" />
 *   ],
 *   startGroupActions: [
 *     <Button label="Export" iconLeft="download-01" intent="default" color="main" size="md" />
 *   ]
 * });
 *
 * // Spread directly into HeaderLayout
 * <HeaderLayout
 *   pageTitle="My Page"
 *   {...adaptiveActions}
 * />
 * ```
 */
export function useAdaptiveActions({
  endGroupActions = [],
  startGroupActions = [],
}: AdaptiveActionsInput): AdaptiveActionsOutput {
  const i18n = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n });

  const isMobile = !useMatchMedia("sm");
  const dropdownItemId = useId();

  const allActions = useMemo(
    () => [...startGroupActions, ...endGroupActions],
    [endGroupActions, startGroupActions],
  );

  const dropdown = useMemo(() => {
    if (allActions.length === 0) {
      return null;
    }

    return (
      <DropdownMenu
        selectedValues={[]}
        onSelectedValuesChange={() => {}}
        onSelectItem={(id) => {
          const index = parseInt(id.replace(`${dropdownItemId}-`, ""), 10);
          const action = allActions[index];

          if (action) {
            const buttonProps = extractButtonProps(action);
            // @ts-expect-error we cannot provide the MouseEvent argument here
            buttonProps.onClick?.();
          }
        }}
      >
        <DropdownMenu.Trigger>
          {({ setIsOpen }) => (
            <Button
              kind="icon-button"
              icon="dots-vertical"
              label={t("headerLayout.actions.more")}
              intent="default"
              color="main"
              size="md"
              onClick={() => setIsOpen(true)}
            />
          )}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content placement="bottom-right">
          {allActions.map((action, index) => {
            const buttonProps = extractButtonProps(action);
            const icon =
              (buttonProps.kind === "icon-button"
                ? buttonProps.icon
                : buttonProps.iconLeft) || undefined;

            return (
              <DropdownMenu.Item
                key={`${dropdownItemId}-${index}`}
                id={`${dropdownItemId}-${index}`}
                icon={icon}
                disabled={buttonProps.disabled}
              >
                {buttonProps.label}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  }, [allActions, dropdownItemId]);

  if (!isMobile) {
    return {
      endGroupActions,
      startGroupActions,
    };
  }

  return {
    endGroupActions: dropdown ? [dropdown] : [],
  };
}
