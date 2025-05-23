import LoadingState from "#src/components/private/LoadingState";

export type UseLoadingStateProps = {
  isLoading?: boolean;
  message?: string;
  className?: string;
};

export const useLoadingState = (props?: UseLoadingStateProps) => {
  const { isLoading, message, className } = props ?? {};
  return {
    shouldRenderLoadingState: !!isLoading,
    LoadingState: () => (
      <LoadingState message={message} className={className} />
    ),
  };
};
