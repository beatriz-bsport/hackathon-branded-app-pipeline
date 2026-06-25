import { type ReactNode, useMemo } from "react";

import { cx } from "@bsport/kaizen-primitive-core";

import { type ChannelType } from "#src/components/channel/constants";
import { useControllableState } from "#src/hooks/use-controllable-state";

import { MessageComposerContext } from "./message-composer-context";

export type MessageComposerProps = {
  /** Active channel. Pass it to control the composer; omit to let it manage its own. */
  channel?: ChannelType;
  /** Initial channel when uncontrolled. */
  defaultChannel?: ChannelType;
  onChannelChange?: (channel: ChannelType) => void;
  /** Expanded layout. Pass it to control the composer; omit to let it manage its own. */
  expanded?: boolean;
  /** Initial expanded state when uncontrolled. */
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
  children: ReactNode;
};

/**
 * Composable message composer frame. It owns the channel and expanded state
 * (controlled or uncontrolled) and shares them through context, so subcomponents
 * need no wiring props. The `TitleField` and `MessageField` leaves take
 * `channel` as a prop and render only while that channel is active, and speak the
 * `value`/`onChange`/`status`/`statusText` contract `@bsport/form`'s
 * `FormField` injects — wrap a leaf in `<FormField name="…">` or wire it
 * manually with `watch`/`setValue`:
 *
 * ```tsx
 * <MessageComposer>
 *   <MessageComposerChannelBar />
 *   <FormField name="subject"><MessageComposerTitleField channel="email" /></FormField>
 *   <FormField name="body"><MessageComposerMessageField channel="email" /></FormField>
 *   <MessageComposerMessageField channel="sms" value={…} onChange={…} />
 *   <MessageComposerTitleField channel="push" value={…} onChange={…} />
 *   <MessageComposerMessageField channel="push" value={…} onChange={…} />
 *   <MessageComposerMessageField channel="chat" value={…} onChange={…} />
 *   <MessageComposerFooter notice={…}>
 *     <MessageComposerSendButton onClick={…} />
 *   </MessageComposerFooter>
 * </MessageComposer>
 * ```
 */
export function MessageComposer({
  channel: channelProp,
  defaultChannel = "email",
  onChannelChange,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  className,
  children,
}: MessageComposerProps) {
  const [channel, setChannel] = useControllableState(
    channelProp,
    defaultChannel,
    onChannelChange,
  );
  const [expanded, setExpanded] = useControllableState(
    expandedProp,
    defaultExpanded,
    onExpandedChange,
  );

  const contextValue = useMemo(
    () => ({
      channel,
      setChannel,
      expanded,
      setExpanded,
    }),
    [channel, setChannel, expanded, setExpanded],
  );

  return (
    <section
      className={cx(
        "flex w-full flex-col gap-xs border-t-stroke-thin border-t-stroke-divider bg-surface-default px-sm py-xs",
        expanded && "min-h-[420px]",
        className,
      )}
    >
      <MessageComposerContext.Provider value={contextValue}>
        {children}
      </MessageComposerContext.Provider>
    </section>
  );
}
