import Tooltip from "#src/components/Tooltip";
import type { TooltipProps } from "#src/components/Tooltip";

/**
 * Returns the passed type with `tooltipProps` added, recursively if an `Array` is provided.
 */
export type WithTooltip<T> = T extends object
  ? { tooltipProps?: TooltipProps } & T
  : T extends Array<unknown>
    ? { [K in keyof T]: WithTooltip<T[K]> }
    : never;

/**
 * A higher-order component (HOC) that wraps a given component with optional tooltip functionality.
 *
 * This HOC enhances the provided React component by allowing it to accept an additional
 * `tooltipProps` property. When `tooltipProps` is provided, the component is rendered within
 * a `<Tooltip>` wrapper; otherwise, it is rendered normally.
 */
export const withTooltip = <P extends object>(Component: React.FC<P>) => {
  const WrappedComponent: React.FC<WithTooltip<P>> = ({
    tooltipProps,
    ...rest
  }: WithTooltip<P>) => {
    if (tooltipProps) {
      return (
        <Tooltip {...tooltipProps}>
          <Component {...(rest as P)} />
        </Tooltip>
      );
    }

    return <Component {...(rest as P)} />;
  };

  return WrappedComponent;
};

export default withTooltip;
