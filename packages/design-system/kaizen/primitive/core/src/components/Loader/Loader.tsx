import { cva } from "class-variance-authority";
import classNames from "classnames";
import React from "react";

const defaultClasses = [
  "relative",
  "flex",
  "justify-center",
  "items-center",
] as const;

// "xl" size is for page loaders, so it has no default width or height
const variants = {
  size: {
    sm: "w-icon-sm h-icon-sm -top-[2px]",
    md: "w-icon-md h-icon-md -top-[5px]",
    lg: "w-icon-lg h-icon-lg -top-[7px]",
    xl: "-top-[17px]",
  },
} as const;

export const sizes = variants.size;

const loader = cva(defaultClasses, {
  variants,
});

export type LoaderProps = React.HTMLAttributes<HTMLDivElement> & {
  size: keyof typeof sizes;
};

/**
 * Rendering an animated loader with three circles.
 * It's wrapped inside a centered container where you can add custom classes to position it. * @param props.className Classname to add to the wrapper of the loader.
 * @param props.size Size of the loader. Can be "sm", "md", or "lg".
 */
const Loader: React.FC<LoaderProps> = ({ className, size, ...props }) => {
  const loaderStyle = {
    animation: "bblFadInOut 1.8s infinite ease-in-out",
    animationDelay: "-0.16s",
  };

  const circleStyle = (delay: string, left: string) => ({
    animation: "bblFadInOut 1.8s infinite ease-in-out",
    animationDelay: delay,
    left: left,
  });

  return (
    <div data-component="Kaizen-Loader" className={loader({ className, size })}>
      <div
        className={classNames(
          "transform translate-z-0 w-[2.5em] h-[2.5em] rounded-full",
          {
            "text-[1px]": size === "sm",
            "text-[2px]": size === "md",
            "text-[3px]": size === "lg",
            "text-[7px]": size === "xl",
          },
        )}
        {...props}
        style={loaderStyle}
      >
        <style>
          {`
            @keyframes bblFadInOut {
              0%, 80%, 100% { box-shadow: 0 2.5em 0 -1.3em; }
              40% { box-shadow: 0 2.5em 0 0; }
            }
          `}
        </style>
        <div
          className="absolute top-0 w-[2.5em] h-[2.5em] rounded-full"
          style={circleStyle("-0.32s", "-3.5em")}
        />
        <div
          className="absolute top-0 w-[2.5em] h-[2.5em] rounded-full"
          style={circleStyle("0s", "3.5em")}
        />
      </div>
    </div>
  );
};

Loader.displayName = "KaizenLoader";

export default Loader;
