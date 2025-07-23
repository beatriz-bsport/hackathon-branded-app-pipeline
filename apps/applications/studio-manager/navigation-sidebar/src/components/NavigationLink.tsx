import React from "react";
import { NavLink } from "react-router";

type NavigationLinkProps = {
  renderElement: (params: {
    isActive?: boolean;
    onClick?: () => void;
    disableSelection?: boolean;
  }) => React.ReactNode;
  item: {
    id: string;
    href?: string;
    onClick?: () => void;
    revamped?: boolean;
  };
  navigate?: (to: string) => void;
  wrapperConfig?: {
    withOnClick?: boolean;
  } & Partial<Partial<React.HTMLAttributes<HTMLElement>>>;
};

export const NavigationLink: React.FC<NavigationLinkProps> = ({
  item,
  navigate,
  renderElement,
  wrapperConfig = {},
}) => {
  const isBridged = !!navigate;
  const { withOnClick, ...otherWrapperConfig } = wrapperConfig;

  const isLegacyItemActive = item.href === window.location.pathname;

  // Handle action items (items with onClick but no href) - prevent navigation highlighting
  if (!item.href && item.onClick) {
    return renderElement({
      isActive: false, // Action items are never active
      onClick: item.onClick,
      disableSelection: true, // Prevent NavigationMenu.Item from setting selection state
    });
  }

  // Handle static items without href and without onClick
  if (!item.href) return renderElement({});

  // In Revamp Context, with a legacy link
  if (!isBridged && !item.revamped) {
    return (
      <a key={item.id} href={item.href} {...otherWrapperConfig}>
        {renderElement({ isActive: false })}
      </a>
    );
  }

  // In Legacy Context, with a revamp link
  if (isBridged && item.revamped) {
    return (
      <a key={item.id} href={`/studio${item.href}`} {...otherWrapperConfig}>
        {renderElement({ isActive: false })}
      </a>
    );
  }

  // In Legacy context, with a legacy link, we rely on navigate (history.push)
  if (isBridged && !item.revamped) {
    const onClick = () => navigate?.(item.href!);

    if (withOnClick) {
      // The element does not have native onClick, it needs a wrapper
      return (
        <div key={item.id} onClick={onClick} {...otherWrapperConfig}>
          {renderElement({ isActive: isLegacyItemActive })}
        </div>
      );
    }

    return renderElement({ onClick, isActive: isLegacyItemActive });
  }

  // In Revamp Context, with a revamp link, we can use React Router Context
  return (
    <NavLink key={item.id} to={item.href}>
      {({ isActive }) => {
        return renderElement({ isActive });
      }}
    </NavLink>
  );
};
