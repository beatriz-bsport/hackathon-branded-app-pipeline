import { useState } from "react";

import {
  Alert,
  Body,
  Button,
  Divider,
  Icon,
  Label,
  Loader,
  Title,
} from "@bsport/kaizen-primitive-core";

import type { AiSummaryResult } from "#src/hooks/api";
import { useTranslation } from "#src/utils/i18n";

interface AiSummaryPanelProps {
  isLoading: boolean;
  error: string | null;
  data: AiSummaryResult | undefined;
  documentationUrl?: string;
}

export const AiSummaryPanel = ({
  isLoading,
  error,
  data,
  documentationUrl,
}: AiSummaryPanelProps) => {
  const { t } = useTranslation("insights");
  const summary = data?.ai_summary;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex min-h-[240px] items-center justify-center">
          <Loader size="lg" />
        </div>
      );
    }

    if (error) {
      return <Alert status="critical" title={error} />;
    }

    if (!summary) return null;

    return (
      <div className="flex flex-col gap-md">
        {summary.status && (
          <section className="flex flex-col gap-xs">
            <Title color="default" htmlVariant="h4" weight="strong">
              {t("aiSummary.overview")}
            </Title>
            <Body size="md" color="default">
              {summary.status}
            </Body>
          </section>
        )}

        {summary.winning && (
          <Alert
            className="!p-xs !gap-xs"
            layout="banner"
            status="positive"
            type="weak"
            customIcon="check-circle"
          >
            <Title htmlVariant="h5" color="positive" weight="strong">
              {t("aiSummary.positiveTrend")}
            </Title>
            <Body size="md" color="positive">
              {summary.winning}
            </Body>
          </Alert>
        )}

        {summary.attention && (
          <Alert
            className="!p-xs !gap-xs"
            layout="banner"
            status="critical"
            type="weak"
            customIcon="alert-circle"
          >
            <Title htmlVariant="h5" color="critical" weight="strong">
              {t("aiSummary.underperformance")}
            </Title>
            <Body size="md" color="critical">
              {summary.attention}
            </Body>
          </Alert>
        )}

        {summary.next_step && (
          <section className="flex flex-col gap-xs">
            <Title
              weight="strong"
              className="text-bsport-turquoise-700"
              htmlVariant="h4"
            >
              {t("aiSummary.recommendedActions")}
            </Title>
            <Body size="md">{summary.next_step}</Body>
          </section>
        )}

        <Divider />
        <FeedbackFooter documentationUrl={documentationUrl} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex items-center gap-xs">
        <Icon
          icon="sparkles"
          size="sm"
          className="text-content-action-default"
        />
        <Title htmlVariant="h3" weight="strong" color="default">
          {t("aiSummary.title")}
        </Title>
      </div>
      <Divider />
      {renderContent()}
    </div>
  );
};

function FeedbackFooter({ documentationUrl }: { documentationUrl?: string }) {
  const { t } = useTranslation("insights");
  const [vote, setVote] = useState<"yes" | "no" | null>(null);

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex items-center gap-sm">
        <Label label={t("aiSummary.usefulForYou")}></Label>
        <Button
          kind="default"
          intent="flat"
          color={vote === "yes" ? "main" : "default"}
          size="sm"
          label={t("aiSummary.yes")}
          iconLeft="thumb-up"
          onClick={() => setVote("yes")}
        />
        <Button
          kind="default"
          intent="flat"
          color={vote === "no" ? "critical" : "default"}
          size="sm"
          label={t("aiSummary.no")}
          iconLeft="thumb-down"
          onClick={() => setVote("no")}
        />
      </div>
      <Button
        kind="default"
        intent="default"
        color="main"
        size="md"
        label={t("aiSummary.detailedDocumentation")}
        iconLeft="link-external-02"
        onClick={
          documentationUrl
            ? () =>
                window.open(documentationUrl, "_blank", "noopener,noreferrer")
            : undefined
        }
        disabled={!documentationUrl}
        fullWidth
      />
    </div>
  );
}
