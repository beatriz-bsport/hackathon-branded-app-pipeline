// Member information in recipient
interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  // Additional member fields from serializer
}

// Statistics from metadata or DynamoDB
interface RecipientStatistics {
  read?: string; // ISO datetime of first read
  click?: string[]; // Array of clicked URLs
  spamreport?: boolean;
  unsubscribe?: boolean;
  // Other statistics fields
}

// Individual Communication Recipient
export type CommunicationRecipient = {
  id: number;
  member: Member;
  communication_sent: number;
  recipient_raw_address: string;
  status: string; // "delivered", "bounced", "failed", etc.
  has_been_read: boolean;
  is_answer: boolean;
  last_read?: string | null; // ISO datetime
  date_created: string; // ISO datetime

  // Annotated fields
  statistics?: RecipientStatistics;
  campaign_id: string; // From annotation

  // SMS-specific fields (if applicable)
  sms_num_segments?: number;
  sms_error_code?: string;
  provider_id?: string; // Twilio message SID
};
