import { Card, ErrorFallback, Loader } from "@bsport/kaizen-primitive-core";

export const PageLoader = () => (
  <div className="grid place-content-center h-screen">
    <Loader size="xl" />
  </div>
);

export const CardLoader = () => (
  <Card padding="none" className="overflow-hidden">
    <div className="h-36 grid place-items-center">
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
