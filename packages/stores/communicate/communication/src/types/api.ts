import { CommunicationObjectKey } from "#src/constants";

// #region Campaign Summary

export type FetchCommunicationSentCampaignSummaryPayload = {
  /** Type of campaign to fetch the summary of statistics from. */
  key: CommunicationObjectKey;

  /** Id of the campaign to fetch the data from. */
  value: number;
};

// #endregion

// #region Communication Sent

/**
 * Parameters for fetching sent communications.
 */
export type FetchCommunicationSentParams = {
  /** Context identifier for the request, the id of the type of communication campaign we want to fetch the communication sent. */
  context_identifier: number;

  /** ID of the communication campaign that we want to fetch the communication sent from. */
  context_object_id: string;

  /** Number of items per page (for pagination). */
  page_size?: number;

  /** Page number of the results (for pagination). */
  page?: number;

  /** ID of the member to filter communications by. */
  member?: number;

  /** If true, exclude automated campaigns from the results. */
  no_automated_campaign?: boolean;

  /** If true, include only automated campaigns in the results. */
  only_automated_campaign?: boolean;

  /** ID of the automated campaign to filter communications by. */
  automated_campaign?: number;

  /** Array of communication kind IDs to filter the results. */
  filter_kind?: number[];

  /** Array of channel names to filter the results. */
  filter_channel?: string[];

  /** Array of recipient IDs to filter the results. */
  filter_recipient?: number[];

  /** Parameter to filter communications by send parameter. */
  filter_send_parameter?: number;

  /** Parameter to filter communications by source or destination. */
  filter_src_or_dst?: number;

  /** Start date (Unix timestamp) to filter communications sent after this date. */
  filter_date_start?: number; // Unix timestamp

  /** End date (Unix timestamp) to filter communications sent before this date. */
  filter_date_end?: number; // Unix timestamp

  /** If true, exclude franchisor communications from the results. */
  exclude_franchisor_communication?: boolean;

  /** ID of the thread to filter communications by. */
  thread_id?: number;

  /** ID of the smartlist to filter communications by. */
  smartlist?: number;

  /** If true, filter communications that have been read. */
  has_been_read?: boolean;

  /** If true, filter communications that are answers. */
  is_answer?: boolean;

  /** If true, exclude member information from the results. */
  without_member_info?: boolean;
};

// #endregion

// #region Communication Recipients

export type FetchCommunicationRecipientFilters = {
  // Direct field filters
  member?: number;
  has_been_read?: boolean;
  is_answer?: boolean;

  // Custom filters
  campaign?: string; // campaign_id (UUID string)
  smartlist?: number; // smartlist_id from metadata
  communication_sent?: number; // communication_sent ID
  communication_sent_group_id?: number;

  // Array filters
  id__in?: number[]; // Multiple recipient IDs
  member_id__in?: number[]; // Multiple member IDs
  campaign__in?: string; // Comma-separated campaign IDs

  // Special filters
  offer_with_selected_categories?: string; // Offer ID for category filtering

  // Pagination
  page?: number;
  page_size?: number;
};

// #endregion
