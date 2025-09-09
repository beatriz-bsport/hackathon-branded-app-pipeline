import { type VariantProps, cva, cx } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import React from "react";

import Avatar, { type AvatarProps } from "#src/components/Avatar";
import Icon, { type IconName } from "#src/components/Icon";

const defaultClasses = [
  "inline-flex items-center gap-2xs",
  "underline-offset-4",
  "disabled:opacity-sm",
] as const;

const variants = {
  color: {
    inherit: ["text-inherit", "fill-inherit"],
    main: [
      "text-onsurface-link-rest",
      "fill-onsurface-link-rest",
      "hover:text-onsurface-main-link-hovered",
      "hover:fill-onsurface-main-link-hovered",
    ],
  },
  weight: {
    weaker: ["font-weaker"],
    weak: ["font-weak"],
    strong: ["font-strong"],
    stronger: ["font-stronger"],
  },
} as const;

const link = cva(defaultClasses, {
  variants,
});

type LinkVariantProps = Omit<VariantProps<typeof link>, "underline">;

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkVariantProps &
  React.PropsWithChildren<{
    avatarProps?: AvatarProps;
    icon?: IconName;
    isUnderlined?: boolean;
    onClick?: () => void;
  }>;

const Wrapper = ({
  className,
  href,
  children,
  onClick,
  ...props
}: {
  className: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  if (!href) {
    // Render a <div> instead of an <a> to just have the styling
    return (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    );
  }
  return (
    <a className={className} href={href} {...props}>
      {children}
    </a>
  );
};

/**
 * The Link component is used to render hyperlinks with various customization options
 * including different colors, font weights, and an optional icon on the left.
 * @param props.className Classname to add to the link.
 * @param props.color Color of the link text.
 * @param props.weight Weight of the link text. Can be "weak" or "strong".
 * @param props.avatarProps Props to pass to the Avatar component, if needed. See Avatar component for more data
 * @param props.icon Name of the icon to use, as listed in the exported icons const.
 * @param props.isUnderlined Boolean to define if the link is underlined.
 * @param props.children Content of the link.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-link--docs
 */
const Link: React.FC<LinkProps> = ({
  className,
  color,
  weight,
  avatarProps,
  icon,
  isUnderlined,
  children,
  href,
  onClick,
  ...props
}) => {
  return (
    <Wrapper
      className={cx(link({ className, color, weight }), "group", {
        "cursor-pointer": !!href || !!onClick,
      })}
      href={href}
      onClick={onClick}
      {...props}
    >
      {avatarProps ? (
        <Avatar {...avatarProps} />
      ) : icon ? (
        <Icon icon={icon} className="h-[1em] w-[1em]" />
      ) : null}
      <span
        className={cx({
          underline: isUnderlined,
          "group-hover:underline": !isUnderlined,
        })}
        style={{ textUnderlinePosition: "from-font" }}
      >
        {children}
      </span>
    </Wrapper>
  );
};

Link.displayName = "KaizenLink";

export const colors = mapValues(variants.color, (_, key) => key) as {
  [key in keyof typeof variants.color]: key;
};
export const weights = mapValues(variants.weight, (_, key) => key) as {
  [key in keyof typeof variants.weight]: key;
};

export default Link;
