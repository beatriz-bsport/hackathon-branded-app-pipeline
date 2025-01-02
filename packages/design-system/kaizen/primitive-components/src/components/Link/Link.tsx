import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import classNames from "classnames";
import mapValues from "lodash/mapValues";
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
  }>;

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
  ...props
}) => {
  return (
    <a
      className={classNames(link({ className, color, weight }), "group")}
      {...props}
    >
      {avatarProps ? (
        <Avatar {...avatarProps} />
      ) : icon ? (
        <Icon icon={icon} className="h-[1em] w-[1em]" />
      ) : null}
      <span
        className={classNames({
          underline: isUnderlined,
          "group-hover:underline": !isUnderlined,
        })}
        style={{ textUnderlinePosition: "from-font" }}
      >
        {children}
      </span>
    </a>
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
