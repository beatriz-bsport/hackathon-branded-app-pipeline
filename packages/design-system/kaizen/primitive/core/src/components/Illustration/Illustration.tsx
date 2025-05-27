import { type VariantProps, cva } from "class-variance-authority";
import React, {
  type ComponentPropsWithRef,
  type HTMLAttributes,
  Suspense,
  useMemo,
} from "react";

import { ILLUSTRATION_NAMES, type IllustrationName } from "./constants";
import { variants } from "./variants";

const illustrationCva = cva("", {
  variants,
  defaultVariants: {
    size: "xl",
  },
});

export type IllustrationProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof illustrationCva> & {
    name: IllustrationName;
    /**
     * Accessibility label for the illustration. If not provided, the illustration will be treated as decorative
     * and hidden from screen readers.
     */
    alt?: string;
  } & ComponentPropsWithRef<"div">;

/**
 * Illustration component allowing to render supported illustrations.
 * @param name Name of the illustration to use, as listed in the exported illustrations const.
 * @param className Classes for styling the container of your illustration.
 * @param size Size of the illustration.
 * @param alt Accessibility label for the illustration. If not provided, the illustration will be treated as decorative
 * and hidden from screen readers.
 */
const Illustration: React.FC<IllustrationProps> = (
  { name, className, alt, size, ...rest },
  ref,
) => {
  const SvgIllustration = useMemo(() => {
    return React.lazy(async () => await import(`./assets/${name}.svg?react`));
  }, [name]);

  // With a string union type, TypeScript ensures only valid values are passed
  // This error handling is just for runtime safety
  if (!ILLUSTRATION_NAMES.includes(name)) {
    console.error(
      `Invalid value for props name: ${name}. Available values: ${ILLUSTRATION_NAMES.join(", ")}`,
    );
    return null;
  }

  // Prepare accessibility attributes - hidden by default unless alt is provided
  const a11yProps = alt
    ? { "aria-label": alt, role: "img" }
    : { "aria-hidden": true };

  return (
    <div
      ref={ref}
      className={illustrationCva({ className, size })}
      {...a11yProps}
      {...rest}
    >
      <Suspense fallback={null}>
        <SvgIllustration />
      </Suspense>
    </div>
  );
};

Illustration.displayName = "KaizenIllustration";

export default Illustration;
