import type { FC, ReactNode } from "react";

type MenuItemLayoutProps = {
  startSlot?: ReactNode;
  avatar?: ReactNode;
  icon?: ReactNode;
  label: ReactNode;
  description?: ReactNode;
  endSlot?: ReactNode;
};

/**
 * Create the areas for the grid alignment following these rules:
 * - label and description are vertically aligned
 * - startSlot and label are horizontally aligned
 */
function getGridTemplateAreas({
  hasStartSlot,
  hasDescription,
}: {
  hasStartSlot: boolean;
  hasDescription: boolean;
}) {
  // 'slot label' or 'label'
  const firstRow = hasStartSlot ? "slot label" : "label";

  if (!hasDescription) {
    return `'${firstRow}'`;
  }

  // 'none description' or 'description'
  const secondRow = hasStartSlot ? "none description" : "description";

  return `'${firstRow}''${secondRow}'`;
}

export const MenuItemLayout: FC<MenuItemLayoutProps> = ({
  startSlot,
  avatar,
  icon,
  label,
  description,
  endSlot,
}) => {
  // one slot for startSlot/avatar/icon (in this order)
  const hasStartSlot = !!startSlot || !!avatar || !!icon;
  const hasDescription = !!description;

  return (
    <div className="flex items-center justify-between w-full">
      <div
        style={{
          "--menu-item-areas": getGridTemplateAreas({
            hasDescription,
            hasStartSlot,
          }),
        }}
        className="grid [grid-template-areas:var(--menu-item-areas)] gap-x-xs"
      >
        {hasStartSlot && (
          <div className="[grid-area:slot] content-center">
            {startSlot ?? avatar ?? icon}
          </div>
        )}

        <div className="[grid-area:label]">{label}</div>

        {hasDescription && (
          <div className="[grid-area:description]">{description}</div>
        )}
      </div>

      {endSlot ?? null}
    </div>
  );
};
