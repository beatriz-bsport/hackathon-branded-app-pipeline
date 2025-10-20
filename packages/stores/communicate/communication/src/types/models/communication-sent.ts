import type { PaginatedResponse } from "@bsport/store-base";

/**
 * Represents a recipient in the communication recipient list
 * Contains member information and marketing preferences
 */
interface CommunicationRecipientLightWeight {
  user_id: number;
  member_id: number;
  name: string;
  email: string;
  phone_number: string;
  accept_marketing_email: boolean;
  accept_marketing_sms: boolean;
}

/**
 * Tag groups used for email templating and personalization
 * Maps template tags to their replacement values
 * @example { "{lastname}": "Smith", "{firstname}": "John" }
 */
interface TagGroup {
  [tagName: string]: string;
}

/**
 * Contains the main communication content and recipient information
 */
interface CommunicationData {
  subject: string;
  body: string; // HTML content of the email
  provider_id: string; // UUID string identifying the provider
  recipient_list: CommunicationRecipientLightWeight[];
  tags_groups: TagGroup[]; // Array of tag replacements for each recipient
}

/**
 * Statistics about the communication campaign
 */
interface CommunicationStatistics {
  total_recipients: number;
  member_ids_truncated: number[]; // List of member IDs that received the communication
  set_from_bsport_database: boolean; // Whether stats were set from BSport database
}

/**
 * Metadata containing additional context and statistics about the communication
 */
interface CommunicationMetadata {
  total_statistics?: CommunicationStatistics;
  marketing_notification_id?: number;
  smartlist_id?: number;
  offer_id?: number;
  automated_campaign_id?: number | null;
  member_id?: number;
  cadence_id?: number;
  are_metrics_stored_in_dynamo?: boolean;
}

/**
 * Base interface containing common fields for all communication types
 */
interface CommunicationSentBase {
  // Basic identification
  id: number;
  campaign_id: string; // UUID string
  uuid: string; // UUID string

  // Communication content and data
  data: CommunicationData;

  // Common status and metadata
  date_created: string; // ISO datetime string
  has_been_read: boolean;
  is_answer: boolean;

  // Content fields
  sms_text: string;
  text: string;
  title: string;

  // Statistics (also available in metadata.total_statistics)
  total_click: number;
  total_read: number;
  total_recipients: number;

  // Member information
  recipient_member_id_list: number[];
  sender_member_id: number | null;

  // Additional fields
  answer_id: string;
  metadata: CommunicationMetadata;
}

/**
 * Email communication with email-specific status
 */
export interface EmailCommunication extends CommunicationSentBase {
  kind: CommunicationKind.EMAIL;
  status: EmailStatus;
}

/**
 * SMS communication with SMS-specific status
 */
export interface SmsCommunication extends CommunicationSentBase {
  kind: CommunicationKind.SMS;
  status: SmsStatus;
}

/**
 * Push notification communication with push-specific status
 */
export interface PushNotificationCommunication extends CommunicationSentBase {
  kind: CommunicationKind.PUSH_NOTIFICATION;
  status: PushNotificationStatus;
}

/**
 * Discriminated union type for all communication types
 * TypeScript will narrow the type based on the 'kind' field
 *
 * Legacy CommunicationSent type for backwards compatibility
 * Serializer: CommunicationSentSerializer
 */
export type CommunicationSent =
  | EmailCommunication
  | SmsCommunication
  | PushNotificationCommunication;

/**
 * Type guards for checking communication types
 */
export const isEmailCommunication = (
  comm: CommunicationSent,
): comm is EmailCommunication => {
  return comm.kind === CommunicationKind.EMAIL;
};

export const isSmsCommunication = (
  comm: CommunicationSent,
): comm is SmsCommunication => {
  return comm.kind === CommunicationKind.SMS;
};

export const isPushNotificationCommunication = (
  comm: CommunicationSent,
): comm is PushNotificationCommunication => {
  return comm.kind === CommunicationKind.PUSH_NOTIFICATION;
};

/**
 * Utility type to get the status type for a given communication kind
 */
export type StatusForKind<T extends CommunicationKind> =
  T extends CommunicationKind.EMAIL
    ? EmailStatus
    : T extends CommunicationKind.SMS
      ? SmsStatus
      : T extends CommunicationKind.PUSH_NOTIFICATION
        ? PushNotificationStatus
        : never;

/**
 * Utility function to get status enum values for a given kind
 */
export const getStatusEnumForKind = (kind: CommunicationKind) => {
  switch (kind) {
    case CommunicationKind.EMAIL:
      return EmailStatus;
    case CommunicationKind.SMS:
      return SmsStatus;
    case CommunicationKind.PUSH_NOTIFICATION:
      return PushNotificationStatus;
    default:
      throw new Error(`Unknown communication kind: ${kind}`);
  }
};

/**
 * Legacy CampaignSummary type for backwards compatibility
 * Serializer: CampaignSummarizeSerializer
 */
export type CampaignSummary = {
  total_recipients: number;
  total_read: number;
  total_click: number;
};

export type CampaignSummaryState = CampaignSummary & {
  emailOpeningRate: number;
};

// Main response types
export type CommunicationSentListResponse =
  PaginatedResponse<CommunicationSent>;

/**
 * Usage Examples:
 *
 * @example
 * // TypeScript will automatically narrow the type based on 'kind'
 * function handleCommunication(comm: CommunicationSent) {
 *   switch (comm.kind) {
 *     case CommunicationKind.EMAIL:
 *       // comm is now typed as EmailCommunication
 *       // comm.status is EmailStatus
 *       if (comm.status === EmailStatus.OPENED) {
 *         console.log('Email was opened');
 *       }
 *       break;
 *
 *     case CommunicationKind.SMS:
 *       // comm is now typed as SmsCommunication
 *       // comm.status is SmsStatus
 *       if (comm.status === SmsStatus.DELIVERED) {
 *         console.log('SMS was delivered');
 *       }
 *       break;
 *   }
 * }
 *
 * @example
 * // Using type guards
 * if (isEmailCommunication(comm)) {
 *   // comm is now EmailCommunication
 *   console.log('Email status:', EmailStatus[comm.status]);
 * }
 *
 * @example
 * // Getting status enum for a kind
 * const StatusEnum = getStatusEnumForKind(CommunicationKind.EMAIL);
 * console.log('Available statuses:', Object.keys(StatusEnum));
 */

/**
 * Communication Kind enum values
 * Represents the type of communication being sent
 */
export enum CommunicationKind {
  EMAIL = 0,
  SMS = 1,
  PUSH_NOTIFICATION = 2,
}

/**
 * Email-specific status values
 */
export enum EmailStatus {
  UNKNOWN = -1,
  PENDING = 0,
  PROCESSED = 1,
  DROPPED = 2,
  DEFERRED = 3,
  DELIVERED = 4,
  BOUNCED = 5,
}

/**
 * SMS-specific status values
 */
export enum SmsStatus {
  QUEUED = 0,
  SENDING = 1,
  UNDELIVERED = 2,
  DELIVERED = 4,
  FAILED = 5,
}

/**
 * Push notification-specific status values
 */
export enum PushNotificationStatus {
  PENDING = 0,
  PROCESSED = 1,
  DROPPED = 2,
  DEFERRED = 3,
  DELIVERED = 4,
}
