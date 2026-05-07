import {
  QueryBoundary as BackboneQueryBoundary,
  type QueryBoundaryProps as BackboneQueryBoundaryProps,
} from "@bsport/sm-backbone";

export type QueryBoundaryProps = Omit<BackboneQueryBoundaryProps, "appName">;

export const QueryBoundary = (props: QueryBoundaryProps) => {
  return (
    <BackboneQueryBoundary appName={__VOD__.__SENTRY_SCOPE_TAG__} {...props} />
  );
};
