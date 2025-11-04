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
    alt?: string;
  } & ComponentPropsWithRef<"div">;

function Illustration({
  name,
  className,
  alt,
  size,
  ref,
  ...rest
}: IllustrationProps & { ref?: React.Ref<HTMLDivElement> }) {
  const SvgIllustration = useMemo(() => {
    return React.lazy(async () => await import(`./assets/${name}.svg?react`));
  }, [name]);

  if (!ILLUSTRATION_NAMES.includes(name)) {
    console.error(
      `Invalid value for props name: ${name}. Available values: ${ILLUSTRATION_NAMES.join(", ")}`,
    );
    return null;
  }

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
}

Illustration.displayName = "KaizenIllustration";

export default Illustration;
