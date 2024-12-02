import classNames from "classnames";
import React from "react";

export type CheckboxSVGProps = {
  direction?: "start" | "end";
  value: "checked" | "unchecked" | "indeterminate";
};

const CheckboxSVG: React.FC<CheckboxSVGProps> = ({
  direction = "start",
  value,
}) => {
  return (
    <svg
      className={classNames(
        "absolute pointer-events-none",
        "fill-onsurface-default-onstrong",
        {
          "ml-[1px]": direction === "start",
          "mr-[1px]": direction === "end",
          hidden: value === "unchecked",
        },
      )}
      xmlns="http://www.w3.org/2000/svg"
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
    >
      {value === "checked" ? (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0791 3.08753C12.307 3.31533 12.307 3.68468 12.0791 3.91248L5.66248 10.3292C5.43467 10.557 5.06533 10.557 4.83752 10.3292L1.92085 7.41248C1.69305 7.18468 1.69305 6.81533 1.92085 6.58753C2.14866 6.35972 2.51801 6.35972 2.74581 6.58753L5.25 9.09171L11.2542 3.08753C11.482 2.85972 11.8513 2.85972 12.0791 3.08753Z"
        />
      ) : value === "indeterminate" ? (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.33325 7C2.33325 6.67783 2.59442 6.41666 2.91659 6.41666H11.0833C11.4054 6.41666 11.6666 6.67783 11.6666 7C11.6666 7.32216 11.4054 7.58333 11.0833 7.58333H2.91659C2.59442 7.58333 2.33325 7.32216 2.33325 7Z"
        />
      ) : null}
    </svg>
  );
};

CheckboxSVG.displayName = "KaizenCheckboxSVG";

export default React.memo(CheckboxSVG);
