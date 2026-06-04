import { describe, expect, it } from "vitest";

import { CommunicationKind } from "@bsport/api-cdp/automated-campaign";

import { EMAIL_TYPE_MARKETING } from "#src/components/EmailCampaignForm/constants";
import type { EmailCampaignFormData } from "#src/components/EmailCampaignForm/types";
import { DELIVERY_MODE_SCHEDULE_LATER } from "#src/components/campaign-generic-fields/campaign-delivery-mode.constants";
import type { PushCampaignFormData } from "#src/components/push-campaign-form/types";
import type { SmsCampaignFormData } from "#src/components/sms-campaign-form/types";
import { formatSchedulePrebuiltSegmentEmailCampaignPayload } from "#src/pages/EmailCampaign/utils/format-email-campaign-payload";
import { formatSchedulePrebuiltSegmentPushCampaignPayload } from "#src/pages/push-campaign/utils/format-push-campaign-payload";
import { formatSchedulePrebuiltSegmentSmsCampaignPayload } from "#src/pages/sms-campaign/utils/format-sms-campaign-payload";

const SEGMENT_IDENTIFIER = "customers";
const DATETIME_SCHEDULED = "2026-07-01T09:30:00.000Z";

describe("prebuilt scheduled campaign payloads", () => {
  it("formats a text-only email campaign with a segment identifier target", () => {
    const data = {
      emailType: EMAIL_TYPE_MARKETING,
      campaignName: "Customer update",
      deliveryMode: DELIVERY_MODE_SCHEDULE_LATER,
      isTextOnly: true,
      emailSubject: "New schedule",
      emailBody: "Here is the new schedule.",
    } satisfies EmailCampaignFormData;

    const payload = formatSchedulePrebuiltSegmentEmailCampaignPayload({
      segmentIdentifier: SEGMENT_IDENTIFIER,
      data,
      datetimeScheduled: DATETIME_SCHEDULED,
    });

    expect(payload).toEqual({
      segment_identifier: SEGMENT_IDENTIFIER,
      communication_kind: CommunicationKind.EMAIL,
      title: "New schedule",
      text: "Here is the new schedule.",
      datetime_scheduled: DATETIME_SCHEDULED,
    });
    expect(payload).not.toHaveProperty("smartlist");
  });

  it("formats an email template campaign with a segment identifier target", () => {
    const data = {
      emailType: EMAIL_TYPE_MARKETING,
      campaignName: "Customer update",
      deliveryMode: DELIVERY_MODE_SCHEDULE_LATER,
      isTextOnly: false,
      emailSubject: "New schedule",
      emailTemplateId: 42,
      emailTemplateHtml: "<p>Here is the new schedule.</p>",
    } satisfies EmailCampaignFormData;

    const payload = formatSchedulePrebuiltSegmentEmailCampaignPayload({
      segmentIdentifier: SEGMENT_IDENTIFIER,
      data,
      datetimeScheduled: DATETIME_SCHEDULED,
    });

    expect(payload).toEqual({
      segment_identifier: SEGMENT_IDENTIFIER,
      communication_kind: CommunicationKind.EMAIL,
      title: "New schedule",
      email_design: 42,
      text: "",
      datetime_scheduled: DATETIME_SCHEDULED,
    });
    expect(payload).not.toHaveProperty("smartlist");
  });

  it("formats an SMS campaign with a segment identifier target", () => {
    const data = {
      campaignName: "Customer SMS",
      deliveryMode: DELIVERY_MODE_SCHEDULE_LATER,
      message: "Class starts at 9.",
    } satisfies SmsCampaignFormData;

    const payload = formatSchedulePrebuiltSegmentSmsCampaignPayload({
      segmentIdentifier: SEGMENT_IDENTIFIER,
      data,
      datetimeScheduled: DATETIME_SCHEDULED,
    });

    expect(payload).toEqual({
      segment_identifier: SEGMENT_IDENTIFIER,
      communication_kind: CommunicationKind.SMS,
      title: "",
      text: "Class starts at 9.",
      datetime_scheduled: DATETIME_SCHEDULED,
    });
    expect(payload).not.toHaveProperty("smartlist");
  });

  it("formats a push campaign with a segment identifier target", () => {
    const data = {
      campaignName: "Customer push",
      deliveryMode: DELIVERY_MODE_SCHEDULE_LATER,
      title: "Class reminder",
      message: "Class starts at 9.",
    } satisfies PushCampaignFormData;

    const payload = formatSchedulePrebuiltSegmentPushCampaignPayload({
      segmentIdentifier: SEGMENT_IDENTIFIER,
      data,
      datetimeScheduled: DATETIME_SCHEDULED,
    });

    expect(payload).toEqual({
      segment_identifier: SEGMENT_IDENTIFIER,
      communication_kind: CommunicationKind.PUSH,
      title: "Class reminder",
      text: "Class starts at 9.",
      datetime_scheduled: DATETIME_SCHEDULED,
    });
    expect(payload).not.toHaveProperty("smartlist");
  });
});
