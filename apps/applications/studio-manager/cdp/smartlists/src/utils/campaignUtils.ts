import { CommunicationStatus } from "#src/api/constants";
import { CampaignScheduled, CampaignSent } from "#src/api/types";

import {
  STREAMLINED_COMMUNICATION_STATUS_DELIVERED,
  STREAMLINED_COMMUNICATION_STATUS_FAILED,
  STREAMLINED_COMMUNICATION_STATUS_PROCESSING,
  StreamlinedCommunicationStatus,
} from "./types";

/**
 * Fallback display name for a sent campaign. Prefer title/text (push), then sms_text (SMS), then data.subject (email).
 * Order is an arbitrary product choice for consistency, not a business requirement.
 */
export function getFallbackCampaignName(campaignSent: CampaignSent) {
  if (campaignSent.title) {
    return campaignSent.title;
  }
  if (campaignSent.text) {
    return campaignSent.text;
  }
  if (campaignSent.sms_text) {
    return campaignSent.sms_text;
  }
  if (campaignSent.data?.subject) {
    return campaignSent.data.subject;
  }
  return "";
}

/**
 * Fallback display name for a scheduled campaign. Prefer title/text (push, email), then text (SMS).
 * Order is an arbitrary product choice for consistency, not a business requirement.
 */
export function getFallbackCampaignScheduledName(
  campaignScheduled: CampaignScheduled,
) {
  if (campaignScheduled.title) {
    return campaignScheduled.title;
  }
  if (campaignScheduled.text) {
    return campaignScheduled.text;
  }
  return "";
}

/**
 * Fallback title: push title first, then email subject. Order is an arbitrary product choice, not a requirement.
 */
export function getFallbackCampaignTitle(campaignSent: CampaignSent) {
  if (campaignSent.title) {
    return campaignSent.title;
  }
  if (campaignSent.data?.subject) {
    return campaignSent.data.subject;
  }
  return "";
}

/**
 * Fallback body: push/SMS text first, then email body. Order is an arbitrary product choice, not a requirement.
 */
export function getFallbackCampaignContent(campaignSent: CampaignSent) {
  if (campaignSent.text) {
    return campaignSent.text;
  }
  if (campaignSent.sms_text) {
    return campaignSent.sms_text;
  }
  if (campaignSent.data?.body) {
    return campaignSent.data.body;
  }
  return "";
}

/**
 * Maps API communication status to a streamlined status for the UI. Check order has no product meaning.
 */
export function getCampaignStatus(
  campaignSent: CampaignSent,
): StreamlinedCommunicationStatus | undefined {
  if (campaignSent.status === CommunicationStatus.FAILED) {
    return STREAMLINED_COMMUNICATION_STATUS_FAILED;
  }
  if (campaignSent.status === CommunicationStatus.DELIVERED) {
    return STREAMLINED_COMMUNICATION_STATUS_DELIVERED;
  }
  if (campaignSent.status === CommunicationStatus.PROCESSING) {
    return STREAMLINED_COMMUNICATION_STATUS_PROCESSING;
  }
  return undefined;
}
