import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import Icon, { type IconName } from "../Icon";

const defaultClasses = [
  "inline-flex items-center gap-2xs",
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
  underline: {
    none: [],
    default: ["underline"],
  },
  weight: {
    weak: ["font-weak"],
    strong: ["font-strong"],
  },
} as const;

const link = cva(defaultClasses, {
  variants,
});

type LinkVariantProps = Omit<VariantProps<typeof link>, "underline">;

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkVariantProps &
  React.PropsWithChildren<{
    icon: IconName;
    isUnderlined: boolean;
  }>;

/**
 * The Link component is used to render hyperlinks with various customization options
 * including different colors, font weights, and an optional icon on the left.
 * @param props.className Classname to add to the link.
 * @param props.color Color of the link text.
 * @param props.weight Weight of the link text. Can be "weak" or "strong".
 * @param props.icon Name of the icon to use, as listed in the exported icons const.
 * @param props.isUnderlined Boolean to define if the link is underlined.
 * @param props.children Content of the link.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-link--docs
 */
const Link: React.FC<LinkProps> = ({
  className,
  color,
  weight,
  icon,
  isUnderlined,
  children,
  ...props
}) => {
  return (
    <a
      className={link({
        className,
        color,
        underline: isUnderlined ? "default" : "none",
        weight,
      })}
      {...props}
    >
      {!!icon && <Icon icon={icon} className="h-[1em] w-[1em]" />}
      <span>{children}</span>
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
