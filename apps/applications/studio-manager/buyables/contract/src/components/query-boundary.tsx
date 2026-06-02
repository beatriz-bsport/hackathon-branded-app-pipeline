import {
  QueryBoundary as BackboneQueryBoundary,
  type QueryBoundaryProps as BackboneQueryBoundaryProps,
} from "@bsport/sm-backbone";

export type QueryBoundaryProps = Omit<BackboneQueryBoundaryProps, "appName">;

export const QueryBoundary = ({
  children,
  loadingFallback,
  errorFallback,
}: QueryBoundaryProps) => {
  return (
    <BackboneQueryBoundary
      appName={__CONTRACT__.__SENTRY_SCOPE_TAG__}
      loadingFallback={loadingFallback}
      errorFallback={errorFallback}
    >
      {children}
    </BackboneQueryBoundary>
  );
};
