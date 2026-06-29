import { z } from "zod";

export const messageComposerSchema = z.discriminatedUnion("channel", [
  z.object({
    channel: z.literal("email"),
    emailSubject: z.string(),
    emailBody: z.string(),
  }),
  z.object({
    channel: z.literal("sms"),
    smsBody: z.string(),
  }),
  z.object({
    channel: z.literal("push"),
    pushTitle: z.string(),
    pushBody: z.string(),
  }),
  z.object({
    channel: z.literal("in_app"),
    chatBody: z.string(),
  }),
]);

export type MessageComposerFormData = z.infer<typeof messageComposerSchema>;
