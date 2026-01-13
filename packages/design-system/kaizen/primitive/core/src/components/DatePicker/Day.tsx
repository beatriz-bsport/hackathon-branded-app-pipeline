import { cva, cx } from "class-variance-authority";
import React from "react";

const defaultClasses = [
  "relative",
  "flex",
  "w-xl",
  "h-xl",
  "p-0",
  "justify-center",
  "items-center",
  "shrink-0",
  "group",
] as const;

const variants = {
  status: {
    default: [
      "bg-surface-action-default-weak-rest",
      "hover:bg-surface-action-default-weak-hovered",
      "active:bg-surface-action-default-weak-pressed",
      "rounded-circle",
    ],
    disabled: "text-onsurface-weaker pointer-events-none",
    selected: [
      "bg-surface-action-main-strong-rest",
      "hover:bg-surface-action-main-strong-hovered",
      "active:bg-surface-action-main-strong-pressed",
      "rounded-circle",
      "text-onsurface-default-onstrong",
    ],
    start: ["text-onsurface-default-onstrong", "rounded-l-[999px]"],
    end: ["text-onsurface-default-onstrong", "rounded-r-[999px]"],
    weekStartDay: null,
    middle: null,
    endOfWeek: null,
  },
} as const;

const day = cva(defaultClasses, {
  variants,
  compoundVariants: [
    {
      status: ["weekStartDay", "middle", "endOfWeek"],
      class: [
        "bg-surface-main-weak",
        "hover:bg-surface-action-main-selected-hovered",
      ],
    },
  ],
});

export type DayStatus =
  | "default"
  | "disabled"
  | "selected"
  | "start"
  | "end"
  | "weekStartDay"
  | "middle"
  | "endOfWeek";

type DayProps = {
  isCurrentDay?: boolean;
  onClick?: () => void;
  status: DayStatus;
  value: number;
};

const Day: React.FC<DayProps> = ({ isCurrentDay, onClick, status, value }) => {
  const customRadiusStyle =
    status === "start" || status === "weekStartDay"
      ? {
          borderRadius:
            "var(--kz-border-radius-circle) 0 0 var(--kz-border-radius-circle)",
        }
      : status === "end" || status === "endOfWeek"
        ? {
            borderRadius:
              "0 var(--kz-border-radius-circle) var(--kz-border-radius-circle) 0",
          }
        : undefined;

  const styleBoundInRange = "absolute w-[20px] h-xl bg-surface-main-weak";
  const styleBoundSelected =
    "absolute w-xl h-xl rounded-circle bg-surface-action-main-strong-rest group-hover:bg-surface-action-main-strong-hovered group-active:bg-surface-action-main-strong-pressed";

  return (
    <td
      data-component="Kaizen-DatePicker-Day"
      className={day({ status })}
      style={customRadiusStyle}
      role="presentation"
    >
      {status === "start" && (
        <>
          <div className={cx(styleBoundInRange, "right-0")} />
          <div className={styleBoundSelected} />
        </>
      )}
      {status === "end" && (
        <>
          <div className={cx(styleBoundInRange, "left-0")} />
          <div className={styleBoundSelected} />
        </>
      )}
      <button
        className={cx("w-full h-full z-10 rounded-circle", {
          "border-stroke-thin border-stroke-default": isCurrentDay,
        })}
        role="gridcell"
        onClick={onClick}
      >
        <span className={cx("text-body-md font-weak leading-xs")}>{value}</span>
      </button>
    </td>
  );
};

export default Day;
