import { type VariantProps, cva } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import React, { type HTMLAttributes, Suspense } from "react";

import ICONS from "./icons";

export type IconName = keyof typeof ICONS;

const variants = {
  size: {
    xl: ["h-icon-xl", "w-icon-xl"],
    lg: ["h-icon-lg", "w-icon-lg"],
    md: ["h-icon-md", "w-icon-md"],
    sm: ["h-icon-sm", "w-icon-sm"],
    xs: ["h-icon-xs", "w-icon-xs"],
  },
} as const;

const iconCva = cva("shrink-0", { variants });

export type IconProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof iconCva> & {
    icon: IconName;
  };

/**
 * Generic Icon React component allowing to render any
 * @param icon Name of the icon to use, as listed in the exported icons const.
 * @param className Classe for style the container of your icon.
 * @param size Size of the icon.
 * @link Tutorial: https://medium.com/@mateuszpalka/creating-your-custom-svg-icon-library-in-react-a5ff1c4c704a
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-icon--docs
 */
const Icon: React.FC<IconProps> = ({ icon, className, size, ...rest }) => {
  const isValidIcon = icon in ICONS;

  if (!isValidIcon) {
    console.error(
      `Invalid value for props icon: ${icon}. Available values: ${Object.keys(ICONS).join(", ")}`,
    );

    return null;
  }

  const SvgIcon = ICONS[icon];

  return (
    <div
      className={iconCva({ className, size })}
      aria-label={icon}
      role="img"
      {...rest}
    >
      <Suspense fallback={null}>
        <SvgIcon />
      </Suspense>
    </div>
  );
};

Icon.displayName = "KaizenIcon";

export const icons = mapValues(ICONS, (_, key) => key) as {
  [key in keyof typeof ICONS]: key;
};
export const sizes = mapValues(variants.size, (_, key) => key) as {
  [key in keyof typeof variants.size]: key;
};

export default Icon;
