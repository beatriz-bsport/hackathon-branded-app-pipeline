import {
  QueryBoundary as BackboneQueryBoundary,
  type QueryBoundaryProps as BackboneQueryBoundaryProps,
} from "@bsport/sm-backbone";

export type QueryBoundaryProps = Omit<BackboneQueryBoundaryProps, "appName">;

export const QueryBoundary = (props: QueryBoundaryProps) => {
  return (
    <BackboneQueryBoundary
      {...props}
      appName={__SERVICE__.__SENTRY_SCOPE_TAG__}
    />
  );
};
