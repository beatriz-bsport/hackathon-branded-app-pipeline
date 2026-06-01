import { useCallback, useRef, useState } from "react";

import {
  type UseDetailsLayoutReturnType,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { useGenerateSummary } from "#src/hooks/api";
import type { AiSummaryResult } from "#src/hooks/api";

interface SummaryParams {
  variables: Record<string, string>;
  pageId?: string;
  documentationUrl?: string;
}

export interface SummaryPanelProps {
  isLoading: boolean;
  error: string | null;
  data: AiSummaryResult | undefined;
  documentationUrl?: string;
  traceId?: string | null;
}

export interface UseAiSummaryReturn {
  handleVariablesChange: (vars: Record<string, string>) => void;
  handleCreateSummary: (values: {
    "page-id"?: string;
    "documentation-url"?: string;
  }) => void;
  summaryLayoutProps: {
    detailsLayoutProps: UseDetailsLayoutReturnType["detailsLayoutProps"];
    withPanel: boolean;
    summaryKey: number;
    summaryPanelProps: SummaryPanelProps;
  };
}

/**
 * Encapsulates all state and logic for the AI summary panel.
 * Returns stable callbacks for DashboardIframe and `summaryLayoutProps`
 * to wire into the page layout — panel rendering is the caller's responsibility.
 */
export const useAiSummary = (insightKey: string): UseAiSummaryReturn => {
  const { detailsLayoutProps, toggleIsPanelOpened } = useDetailsLayout();
  const [summaryEnabled, setSummaryEnabled] = useState(false);
  const [summaryKey, setSummaryKey] = useState(0);
  const [summaryParams, setSummaryParams] = useState<SummaryParams>({
    variables: {},
  });
  const latestVariablesRef = useRef<Record<string, string>>({});

  const handleVariablesChange = useCallback((vars: Record<string, string>) => {
    latestVariablesRef.current = vars;
  }, []);

  const handleCreateSummary = useCallback(
    (values: { "page-id"?: string; "documentation-url"?: string }) => {
      setSummaryParams({
        variables: { ...latestVariablesRef.current },
        pageId: values["page-id"],
        documentationUrl: values["documentation-url"],
      });
      setSummaryEnabled(true);
      setSummaryKey((k) => k + 1);
      toggleIsPanelOpened(true);
    },
    [toggleIsPanelOpened],
  );

  const {
    data,
    isLoading: isExporting,
    error: exportError,
  } = useGenerateSummary({
    insightKey,
    variables: summaryParams.variables,
    pageId: summaryParams.pageId,
    enabled: summaryEnabled,
  });

  const summaryLayoutProps = {
    detailsLayoutProps,
    withPanel: summaryEnabled,
    summaryKey,
    summaryPanelProps: {
      isLoading: isExporting,
      error: exportError,
      data,
      documentationUrl: summaryParams.documentationUrl,
      traceId: data?.ai_summary?.trace_id,
    } satisfies SummaryPanelProps,
  };

  return { handleVariablesChange, handleCreateSummary, summaryLayoutProps };
};
