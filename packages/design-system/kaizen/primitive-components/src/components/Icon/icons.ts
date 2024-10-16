// DO NOT REMOVE - ICON GENERATOR
import React from "react";

const icons = {
  "arrow-left": React.lazy(
    async () => await import("./assets/arrow-left.svg?react"),
  ),
  "arrow-right": React.lazy(
    async () => await import("./assets/arrow-right.svg?react"),
  ),
  loading: React.lazy(async () => await import("./assets/loading.svg?react")),
  "message-alert-square": React.lazy(
    async () => await import("./assets/message-alert-square.svg?react"),
  ),
  "message-check-square": React.lazy(
    async () => await import("./assets/message-check-square.svg?react"),
  ),
  "message-question-square": React.lazy(
    async () => await import("./assets/message-question-square.svg?react"),
  ),
  "message-text-square-02": React.lazy(
    async () => await import("./assets/message-text-square-02.svg?react"),
  ),
  "message-text-square-2": React.lazy(
    async () => await import("./assets/message-text-square-2.svg?react"),
  ),
  "message-x-square": React.lazy(
    async () => await import("./assets/message-x-square.svg?react"),
  ),
  save: React.lazy(async () => await import("./assets/save.svg?react")),
  "x-close": React.lazy(async () => await import("./assets/x-close.svg?react")),
} as const;

export default icons;
