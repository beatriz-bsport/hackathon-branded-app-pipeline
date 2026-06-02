import { useState } from "react";

import {
  Alert,
  Body,
  Button,
  Divider,
  Icon,
  Label,
  Loader,
  TextArea,
  Title,
} from "@bsport/kaizen-primitive-core";

import type { AiSummaryResult } from "#src/hooks/api";
import { useSubmitFeedback } from "#src/hooks/api";
import { useTranslation } from "#src/utils/i18n";

interface AiSummaryPanelProps {
  isLoading: boolean;
  error: string | null;
  data: AiSummaryResult | undefined;
  documentationUrl?: string;
  traceId?: string | null;
  initialFeedback?: { value: boolean; rationale?: string };
}

export const AiSummaryPanel = ({
  isLoading,
  error,
  data,
  documentationUrl,
  traceId,
  initialFeedback,
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
            <Body size="md" color="positive" weight="weaker">
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
            <Body size="md" color="critical" weight="weaker">
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
        {traceId && (
          <FeedbackFooter traceId={traceId} initialFeedback={initialFeedback} />
        )}
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

function FeedbackFooter({
  traceId,
  initialFeedback,
}: {
  traceId?: string | null;
  initialFeedback?: { value: boolean; rationale?: string };
}) {
  const { t } = useTranslation("insights");
  const { submitWithRationale, isPending, isError, isSuccess } =
    useSubmitFeedback();
  const [vote, setVote] = useState<"yes" | "no" | null>(
    initialFeedback ? (initialFeedback.value ? "yes" : "no") : null,
  );
  const [rationale, setRationale] = useState(initialFeedback?.rationale ?? "");

  const isSubmitted = initialFeedback !== undefined || isSuccess;
  const isDisabled = isPending || isSubmitted;

  const handleVote = (newVote: "yes" | "no") => {
    if (isDisabled) return;
    setVote(newVote);
    if (newVote === "yes") {
      submitWithRationale({
        value: true,
        trace_id: traceId,
        rationale: undefined,
      });
    }
  };

  const handleSubmit = () => {
    if (!vote || isDisabled) return;
    submitWithRationale({
      value: vote === "yes",
      trace_id: traceId,
      rationale: rationale.trim() || undefined,
    });
  };

  if (isSubmitted) {
    return (
      <Body size="md" color="weak" className="text-center">
        {t("aiSummary.feedbackThanks")}
      </Body>
    );
  }

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
          onClick={() => handleVote("yes")}
          disabled={isPending}
        />
        <Button
          kind="default"
          intent="flat"
          color={vote === "no" ? "critical" : "default"}
          size="sm"
          label={t("aiSummary.no")}
          iconLeft="thumb-down"
          onClick={() => handleVote("no")}
          disabled={isPending}
        />
      </div>

      {vote === "no" && (
        <div className="flex flex-col gap-xs">
          <TextArea
            id="feedback-rationale"
            autoFocus
            label={t("aiSummary.whatWentWrong")}
            className="!text-body-md"
            value={rationale}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setRationale(e.target.value)
            }
            placeholder={t("aiSummary.rationalePlaceholder")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            kind="default"
            intent="default"
            color="main"
            size="sm"
            label={t("aiSummary.send")}
            onClick={handleSubmit}
            loading={isPending}
            className="self-end"
          />
        </div>
      )}
      {isError && (
        <Alert status="critical">{t("aiSummary.feedbackError")}</Alert>
      )}
    </div>
  );
}
