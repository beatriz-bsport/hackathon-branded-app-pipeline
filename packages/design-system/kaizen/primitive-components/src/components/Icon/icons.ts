import React from "react";

const icons = {
  loading: React.lazy(async () => await import("./assets/loading.svg?react")),
  "arrow-right": React.lazy(
    async () => await import("./assets/arrow-right.svg?react"),
  ),
  "arrow-left": React.lazy(
    async () => await import("./assets/arrow-left.svg?react"),
  ),
  save: React.lazy(async () => await import("./assets/save.svg?react")),
  "message-text-square-02": React.lazy(
    async () => await import("./assets/message-text-square-02.svg?react"),
  ),
  "message-question-square": React.lazy(
    async () => await import("./assets/message-question-square.svg?react"),
  ),
  "message-check-square": React.lazy(
    async () => await import("./assets/message-check-square.svg?react"),
  ),
  "message-alert-square": React.lazy(
    async () => await import("./assets/message-alert-square.svg?react"),
  ),
  "message-x-square": React.lazy(
    async () => await import("./assets/message-x-square.svg?react"),
  ),
  "x-close": React.lazy(async () => await import("./assets/x-close.svg?react")),
  // DO NOT REMOVE - ICON GENERATOR
} as const;

export default icons;
