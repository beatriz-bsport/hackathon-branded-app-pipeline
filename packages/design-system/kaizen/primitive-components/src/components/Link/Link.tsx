import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import Icon, { type IconName } from "../Icon";

const defaultClasses = ["disabled:opacity-sm"] as const;

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

/**
 * Colors available for a body text.
 */
export const colors = mapValues(variants.color, (_, key) => key) as {
  [key in keyof typeof variants.color]: key;
};
/**
 * Font weights available for a body text.
 */
export const weights = mapValues(variants.weight, (_, key) => key) as {
  [key in keyof typeof variants.weight]: key;
};

type LinkVariantProps = Omit<VariantProps<typeof link>, "underline">;

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkVariantProps &
  React.PropsWithChildren<{
    icon: IconName;
    isUnderlined: boolean;
  }>;

const Link: React.FC<LinkProps> = ({
  className,
  children,
  color,
  weight,
  isUnderlined,
  icon,
  ...props
}) => {
  return (
    <a
      className={`${link({
        className,
        color,
        underline: isUnderlined ? "default" : "none",
        weight,
      })} inline-flex items-center gap-2xs`}
      {...props}
    >
      {!!icon && <Icon icon={icon} className="h-[1em] w-[1em]" />}
      <span>{children}</span>
    </a>
  );
};

Link.displayName = "KaizenLink";

export default Link;
