import { type FC, type ReactNode } from "react";

export const FormSection: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-lg w-full">{children}</div>
);
