export interface AiSummaryContent {
  status: string | null;
  winning: string | null;
  attention: string | null;
  next_step: string | null;
  trace_id?: string | null;
}

export interface AiSummaryResult {
  workbook_id: string;
  page_id: string;
  query_id: string;
  ai_summary?: AiSummaryContent;
}

export interface FetchAiSummaryParams {
  insightKey: string;
  elementIds: string[];
  controls?: Record<string, string>;
}
