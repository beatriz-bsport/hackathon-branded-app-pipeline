export interface AiSummaryContent {
  status: string | null;
  winning: string | null;
  attention: string | null;
  next_step: string | null;
}

export interface AiSummaryResult {
  workbook_id: string;
  page_id: string;
  query_id: string;
  ai_summary?: AiSummaryContent;
}

export interface FetchAiSummaryParams {
  insightKey: string;
  variables?: Record<string, string>;
  pageId?: string;
}
