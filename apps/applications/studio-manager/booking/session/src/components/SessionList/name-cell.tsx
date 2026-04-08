import clsx from "clsx";
import React from "react";

import { CancelledSessionName } from "./CancelledSessionName";
import { SessionName } from "./session-name";

type NameCellProps = {
  name: string;
  available: boolean;
  zone: string;
  date_start: string;
  duration_minute: number;
};

const nameCellClassName = clsx(
  "truncate max-w-[202px] text-title-sm font-strong leading-md",
  "lg:text-body-md lg:font-weak lg:leading-sm",
);

export const NameCell: React.FC<NameCellProps> = ({
  name,
  available,
  zone,
  date_start,
  duration_minute,
}) => {
  if (!available) {
    return <CancelledSessionName name={name} className={nameCellClassName} />;
  }

  return (
    <SessionName
      name={name}
      className={nameCellClassName}
      zone={zone}
      date_start={date_start}
      duration_minute={duration_minute}
    />
  );
};
