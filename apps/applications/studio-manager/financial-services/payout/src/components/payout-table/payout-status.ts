import type { ChipProps } from "@bsport/kaizen-primitive-core";

export const STATUS_KEYS = [
  "pending",
  "processing",
  "successful",
  "failed",
  "canceled",
  "unknown",
] as const;

type StatusKey = (typeof STATUS_KEYS)[number];

const STATUS_BY_CODE: Record<number, Exclude<StatusKey, "unknown">> = {
  0: "pending",
  1: "processing",
  2: "successful",
  3: "failed",
  4: "canceled",
};

export const STATUS_COLORS: Record<number, ChipProps["color"]> = {
  0: "warning",
  1: "info",
  2: "positive",
  3: "critical",
  4: "critical",
};

export const getStatusKey = (status: number): StatusKey =>
  STATUS_BY_CODE[status] ?? "unknown";

export const getStatusColor = (status: number): ChipProps["color"] =>
  STATUS_COLORS[status] ?? "default";
