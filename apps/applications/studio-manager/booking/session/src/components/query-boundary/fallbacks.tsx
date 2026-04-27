import {
  Card,
  ErrorFallback,
  Loader as PrimitiveLoader,
  type VariantProps,
  cva,
} from "@bsport/kaizen-primitive-core";

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

export const Loader = ({ size }: CardLoaderProps) => (
  <div className={cardLoaderVariants({ size })}>
    <PrimitiveLoader size="lg" />
  </div>
);

export const CardLoader = ({ size }: CardLoaderProps) => (
  <Card padding="none" className="overflow-hidden">
    <div className={cardLoaderVariants({ size })}>
      <PrimitiveLoader size="lg" />
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
