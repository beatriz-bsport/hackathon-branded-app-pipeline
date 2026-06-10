import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useCallback,
  useMemo,
} from "react";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Alert,
  Body,
  List,
  type ListItemChipsProps,
  type ListItemProps,
  Loader,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useSessionCredits } from "#src/hooks/booking/fetch/use-session-credits";
import { useFetchSimilarSessions } from "#src/hooks/session-api/fetch/use-fetch-similar-sessions";
import { useFetchTeachers } from "#src/hooks/use-fetch-teachers";
import { setSessionIds } from "#src/stores/booking-flow/actions";
import { selectSessionIdsAsString } from "#src/stores/booking-flow/selectors.js";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
import { useTranslation } from "#src/utils/i18n";

type SessionSelectionStepProps = {
  currentSessionId: number;
};

export const SessionSelectionStep: FC<SessionSelectionStepProps> = ({
  currentSessionId,
}) => {
  const { data: sessions, isLoading: sessionsLoading } =
    useFetchSimilarSessions(currentSessionId);
  const { t, i18n } = useTranslation("sessionManagement");

  //Store
  const selectedIds = useBookingFlowStore(selectSessionIdsAsString);

  const keepCredits = useBookingFlowStore((state) => state.keepCredits);

  // Credits
  const {
    totalCreditsUsed,
    availableCredits,
    remainingCredits,
    isUnlimited,
    getSessionCreditCost,
  } = useSessionCredits({ currentSessionId, sessions });
  const companyTheme = dataAccessLayer.useCompanyTheme();

  // Teachers
  const coachIds = useMemo(
    () => [...new Set(sessions?.map((s) => s.coach) ?? [])],
    [sessions],
  );

  const { data: teachers, isLoading: teachersLoading } = useFetchTeachers({
    id__in: coachIds,
    company: companyTheme?.company,
  });

  const teacherMap = useMemo(() => {
    if (!teachers) return new Map<number, string>();
    return new Map(teachers.map((t) => [t.id, t.name]));
  }, [teachers]);

  // List items
  const handleSessionSelect: Dispatch<SetStateAction<string[]>> = useCallback(
    (value) => {
      const next = typeof value === "function" ? value(selectedIds) : value;

      // When credits matter, cap selection to what the pass can afford
      if (!keepCredits && !isUnlimited && sessions) {
        let budget = availableCredits;
        const capped: string[] = [];
        const currentId = String(currentSessionId);

        // Walk sessions in display order (chronological), keeping those in `next`
        for (const session of sessions) {
          const id = String(session.id);
          if (!next.includes(id)) continue;

          const cost = getSessionCreditCost(session);
          // Always keep the current session; for others, check budget
          if (id === currentId || budget >= cost) {
            capped.push(id);
            budget = Math.round((budget - cost) * 10) / 10;
          }
        }

        setSessionIds(capped.map(Number));
        return;
      }

      setSessionIds(next.map(Number));
    },
    [
      selectedIds,
      keepCredits,
      isUnlimited,
      sessions,
      availableCredits,
      getSessionCreditCost,
      currentSessionId,
    ],
  );

  const items = useMemo((): ListItemProps[] => {
    if (!sessions) return [];

    return sessions.map((session) => {
      const startDate = formatDateTime(
        session.date_start,
        DATETIME_FORMATS.MEDIUM_DATE_WITH_WEEKDAY,
        { locale: i18n.language, timeZone: session.timezone_name },
      );
      const startTime = formatDateTime(
        session.date_start,
        DATETIME_FORMATS.TIME_SIMPLE,
        { locale: i18n.language, timeZone: session.timezone_name },
      );

      const creditCost = getSessionCreditCost(session);
      const coachName = teacherMap.get(session.coach) ?? "";
      const isCurrentSession = session.id === currentSessionId;

      const canAfford =
        keepCredits ||
        isUnlimited ||
        remainingCredits >= creditCost ||
        selectedIds.includes(String(session.id));

      const participantChip: ListItemChipsProps = {
        color: "default",
        size: "lg",
        iconLeft: "users-01",
        label: `${session.validated_booking_count} / ${session.effectif}`,
        type: "weak",
      };

      const currentSessionChip: ListItemChipsProps = {
        color: "main",
        size: "lg",
        label: t("bookingFlow.confirmation.thisClass"),
        type: "weak",
      };

      const chips:
        | [ListItemChipsProps]
        | [ListItemChipsProps, ListItemChipsProps] = isCurrentSession
        ? [currentSessionChip, participantChip]
        : [participantChip];

      return {
        id: String(session.id),
        title: `${startDate} • ${startTime}`,
        description: `${t("bookingFlow.sessionSelection.creditCost", { count: creditCost })} - ${coachName}`,
        disabled: isCurrentSession || !canAfford,
        chips,
        chipsDirection: "end",
      };
    });
  }, [
    sessions,
    i18n.language,
    currentSessionId,
    selectedIds,
    remainingCredits,
    keepCredits,
    isUnlimited,
    getSessionCreditCost,
    teacherMap,
    t,
  ]);

  if (sessionsLoading || teachersLoading) {
    return (
      <div className="flex w-full justify-center">
        <Loader size="xl" />
      </div>
    );
  }

  const areCreditsExhausted =
    !keepCredits &&
    !isUnlimited &&
    remainingCredits <= 0 &&
    sessions &&
    sessions.length > 0;

  return (
    <div className="flex flex-col gap-md w-full">
      <Body size="lg">{t("bookingFlow.sessionSelection.description")}</Body>
      <div className="max-h-component-content-centered overflow-y-auto">
        <List
          id="session-selection-list"
          items={items}
          isSelectable
          isCompact
          checkedIds={selectedIds}
          setCheckedIds={handleSessionSelect}
          header={{
            title: t("bookingFlow.sessionSelection.upcomingClasses", {
              count: sessions?.length ?? 0,
            }),
            description: t("bookingFlow.sessionSelection.selected", {
              count: selectedIds.length,
            }),
          }}
          emptyStateProps={{
            isEmpty: !sessions || sessions.length === 0,
            emptyConfig: {
              title: t("bookingFlow.sessionSelection.upcomingClasses", {
                count: 0,
              }),
            },
          }}
        />
      </div>
      {!keepCredits && !isUnlimited && (
        <Alert status="info">
          <Body size="md" color="inherit">
            {`${t("bookingFlow.sessionSelection.creditCost", { count: totalCreditsUsed })} · ${t(
              "bookingFlow.sessionSelection.creditsRemaining",
              {
                remaining: Math.max(0, remainingCredits),
              },
            )}`}
          </Body>
        </Alert>
      )}
      {areCreditsExhausted && (
        <Alert status="warning">
          <Body size="md" color="inherit">
            {t("bookingFlow.sessionSelection.creditsExhausted")}
          </Body>
        </Alert>
      )}
    </div>
  );
};
