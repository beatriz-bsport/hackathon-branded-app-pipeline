import { useId } from "react";

import { ControlledForm, FormField, useFormController } from "@bsport/form";

import { type ChannelType } from "#src/components/channel/constants";

import { MessageComposerChannelBar } from "./channel-bar/message-composer-channel-bar";
import { MessageComposerMessageField } from "./fields/message-composer-message-field";
import { MessageComposerTitleField } from "./fields/message-composer-title-field";
import { MessageComposerFooter } from "./footer/message-composer-footer";
import { MessageComposerSendButton } from "./footer/message-composer-send-button";
import { MessageComposer } from "./message-composer";
import { type MessageComposerFormData, messageComposerSchema } from "./schema";

export type MessageComposerFormProps = {
  defaultChannel?: ChannelType;
  defaultExpanded?: boolean;
  notice?: string;
  className?: string;
  onSubmit?: (data: MessageComposerFormData) => void | Promise<void>;
};

export function MessageComposerForm({
  defaultChannel = "email",
  defaultExpanded = false,
  notice,
  className,
  onSubmit,
}: MessageComposerFormProps) {
  const formId = useId();
  const methods = useFormController({
    mode: "onBlur",
    schema: messageComposerSchema,
    defaultValues: {
      channel: defaultChannel,
      emailSubject: "",
      emailBody: "",
      smsBody: "",
      pushTitle: "",
      pushBody: "",
      chatBody: "",
    },
  });
  const channel = methods.watch("channel");

  const handleChannelChange = (nextChannel: ChannelType) => {
    methods.setValue("channel", nextChannel, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleSubmit = async (data: MessageComposerFormData) => {
    await onSubmit?.(data);
  };

  return (
    <ControlledForm id={formId} onSubmit={handleSubmit} {...methods}>
      <MessageComposer
        channel={channel}
        onChannelChange={handleChannelChange}
        defaultExpanded={defaultExpanded}
        className={className}
      >
        <MessageComposerChannelBar />
        <FormField<MessageComposerFormData, "emailSubject"> name="emailSubject">
          <MessageComposerTitleField channel="email" />
        </FormField>
        <FormField<MessageComposerFormData, "emailBody"> name="emailBody">
          <MessageComposerMessageField channel="email" />
        </FormField>
        <FormField<MessageComposerFormData, "smsBody"> name="smsBody">
          <MessageComposerMessageField channel="sms" />
        </FormField>
        <FormField<MessageComposerFormData, "pushTitle"> name="pushTitle">
          <MessageComposerTitleField channel="push" />
        </FormField>
        <FormField<MessageComposerFormData, "pushBody"> name="pushBody">
          <MessageComposerMessageField channel="push" />
        </FormField>
        <FormField<MessageComposerFormData, "chatBody"> name="chatBody">
          <MessageComposerMessageField channel="chat" />
        </FormField>
        <MessageComposerFooter notice={notice}>
          <MessageComposerSendButton
            type="submit"
            form={formId}
            disabled={methods.formState.isSubmitting}
            loading={methods.formState.isSubmitting}
          />
        </MessageComposerFooter>
      </MessageComposer>
    </ControlledForm>
  );
}
