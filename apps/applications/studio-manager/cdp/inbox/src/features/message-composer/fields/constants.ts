import { type ChannelType } from "#src/components/channel/constants";

/** Channels that have a title input (SMS and in_app are message-only). */
export type TitleFieldChannel = Extract<ChannelType, "email" | "push">;

type FieldConfig = {
  /** Character cap; when set, the field shows a `n/max` counter. */
  maxLength?: number;
  /** Marks the field required (asterisk) in the expanded, labelled layout. */
  requiredWhenExpanded?: boolean;
  /** Whether the placeholder stays visible in the expanded layout. */
  placeholderWhenExpanded?: boolean;
};

export const TITLE_FIELD_CONFIG: Record<TitleFieldChannel, FieldConfig> = {
  email: {},
  push: { maxLength: 25 },
};

export const MESSAGE_FIELD_CONFIG: Record<ChannelType, FieldConfig> = {
  email: {},
  sms: { maxLength: 160, placeholderWhenExpanded: true },
  push: { maxLength: 200, placeholderWhenExpanded: true },
  in_app: { placeholderWhenExpanded: true },
};
