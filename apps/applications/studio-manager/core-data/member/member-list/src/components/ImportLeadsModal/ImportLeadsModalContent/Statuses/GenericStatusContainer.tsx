import React, { type PropsWithChildren } from "react";

import { Body, Illustration } from "@bsport/kaizen-primitive-core";

type GenericStatusContainerProps = {
  title: string;
  status: "success" | "partial-success" | "error";
};

export const GenericStatusContainer: React.FC<
  PropsWithChildren<GenericStatusContainerProps>
> = ({ children, title, status }) => {
  return (
    <div className="flex flex-col gap-md items-center my-md">
      <Illustration name={status === "partial-success" ? "warning" : status} />
      <Body size="lg" className="text-center">
        {title}
      </Body>
      {children}
    </div>
  );
};
