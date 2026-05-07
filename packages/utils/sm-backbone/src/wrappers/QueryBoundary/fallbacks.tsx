import {
  Card,
  ErrorFallback,
  Loader,
  cva,
} from "@bsport/kaizen-primitive-core";

export const QueryBoundaryPageLoader = () => (
  <div className="grid place-content-center h-screen">
    <Loader size="xl" />
  </div>
);

export type QueryBoundaryLoaderProps = {
  size?: "md" | "lg";
};

const queryBoundaryLoaderVariants: (
  props?: QueryBoundaryLoaderProps,
) => string = cva("grid place-content-center", {
  variants: {
    size: {
      md: "min-h-[9rem]",
      lg: "min-h-[24rem]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const QueryBoundaryLoader = ({ size }: QueryBoundaryLoaderProps) => (
  <div className={queryBoundaryLoaderVariants({ size })}>
    <Loader size="lg" />
  </div>
);

export const QueryBoundaryCardLoader = ({ size }: QueryBoundaryLoaderProps) => (
  <Card padding="none" className="overflow-hidden">
    <QueryBoundaryLoader size={size} />
  </Card>
);

export type QueryBoundarySectionErrorFallbackProps = {
  onRetry: () => void;
};

export const QueryBoundarySectionErrorFallback = ({
  onRetry,
}: QueryBoundarySectionErrorFallbackProps) => (
  <Card padding="none" className="overflow-hidden">
    <div className="grid place-content-center min-h-[24rem] p-md">
      <ErrorFallback
        actionProps={{
          onClick: onRetry,
        }}
      />
    </div>
  </Card>
);
