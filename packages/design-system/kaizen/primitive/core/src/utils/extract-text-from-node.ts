import { type ReactNode } from "react";

/**
 * Simple utility function to extract text from a single react node or default to empty string
 **/
export function extractTextFromNode(node: ReactNode) {
  return typeof node === "string" ? node : "";
}
