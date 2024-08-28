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
  // DO NOT REMOVE - ICON GENERATOR
} as const;

export default icons;
