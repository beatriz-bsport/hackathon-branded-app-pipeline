// Statistics from metadata or DynamoDB
interface RecipientStatistics {
  read?: string; // ISO datetime of first read
  click?: string[]; // Array of clicked URLs
  spamreport?: boolean;
  unsubscribe?: boolean;
  // Other statistics fields
}

/**
 * Model CommunicationRecipient
 * Serializer: CommunicationRecipientSerializer
 */
export type CommunicationRecipient = {
  id: number;
  member: number;
  email: string;
  communication_sent: number;
  recipient_raw_address: string;
  status: string; // "delivered", "bounced", "failed", etc.
  has_been_read: boolean;
  is_answer: boolean;
  last_read?: string | null; // ISO datetime
  date_created: string; // ISO datetime
  read_count: number;

  // Annotated fields
  statistics?: RecipientStatistics;
  campaign_id: string; // From annotation

  // SMS-specific fields (if applicable)
  sms_num_segments?: number;
  sms_error_code?: string;
  provider_id?: string; // Twilio message SID
};
