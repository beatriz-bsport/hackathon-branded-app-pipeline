import {
  Card,
  ErrorFallback,
  Loader,
  type VariantProps,
  cva,
} from "@bsport/kaizen-primitive-core";

export const PageLoader = () => (
  <div className="grid place-content-center h-screen">
    <Loader size="xl" />
  </div>
);

const cardLoaderVariants = cva("grid place-content-center", {
  variants: {
    size: {
      md: "min-h-36",
      lg: "min-h-96",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type CardLoaderProps = VariantProps<typeof cardLoaderVariants>;

export const CardLoader = ({ size }: CardLoaderProps) => (
  <Card padding="none" className="overflow-hidden">
    <div className={cardLoaderVariants({ size })}>
      <Loader size="lg" />
    </div>
  </Card>
);

type SectionErrorFallbackProps = {
  onRetry: () => void;
};

export const SectionErrorFallback = ({
  onRetry,
}: SectionErrorFallbackProps) => (
  <Card padding="none" className="overflow-hidden">
    <div className="grid place-content-center min-h-96 p-md">
      <ErrorFallback
        actionProps={{
          onClick: onRetry,
        }}
      />
    </div>
  </Card>
);
