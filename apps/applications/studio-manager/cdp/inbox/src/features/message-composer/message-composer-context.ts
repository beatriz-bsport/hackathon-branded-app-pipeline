import { createContext, useContext } from "react";

import { type ChannelType } from "#src/components/channel/constants";

export type MessageComposerContextValue = {
  /** Channel the composer is currently writing for. */
  channel: ChannelType;
  setChannel: (channel: ChannelType) => void;
  /** Expanded layout — fields switch from placeholders to labelled fields. */
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
};

export const MessageComposerContext =
  createContext<MessageComposerContextValue | null>(null);

export function useMessageComposer(): MessageComposerContextValue {
  const context = useContext(MessageComposerContext);
  if (!context) {
    throw new Error(
      "useMessageComposer must be used within a <MessageComposer>",
    );
  }
  return context;
}
