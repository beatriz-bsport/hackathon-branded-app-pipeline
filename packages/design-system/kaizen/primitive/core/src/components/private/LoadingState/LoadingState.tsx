import { cva } from "class-variance-authority";
import React from "react";

import Body from "#src/components/Body";
import Loader from "#src/components/Loader";

const defaultClasses = [
  "w-full",
  "h-full",
  "flex",
  "flex-col",
  "items-center",
  "justify-center",
  "gap-md",
];

const loadingState = cva(defaultClasses);

type LoadingStateProps = {
  message?: string;
  className?: string;
};

const LoadingState: React.FC<LoadingStateProps> = ({ message, className }) => {
  return (
    <div
      data-component="Kaizen-LoadingState"
      className={loadingState({ className })}
    >
      <Loader size="xl" />
      {message && <Body htmlVariant="p">{message}</Body>}
    </div>
  );
};

LoadingState.displayName = "KaizenLoadingState";

export default LoadingState;
