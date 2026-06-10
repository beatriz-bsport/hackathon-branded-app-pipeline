import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { fromIsoString, getLocalNow } from "@bsport/datetime-manipulation";
import {
  Alert,
  Badge,
  Body,
  Divider,
  List,
  type ListItemChipsProps,
  type ListItemProps,
  Loader,
  SegmentedControl,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useSessionCredits } from "#src/hooks/booking/fetch/use-session-credits";
import { useRetrieveRefinedGroupSession } from "#src/hooks/group-session/use-retrieve-refined-group-session";
import { useFetchSessionsInGroup } from "#src/hooks/session-api/fetch/use-fetch-sessions-in-group";
import { useFetchSimilarSessions } from "#src/hooks/session-api/fetch/use-fetch-similar-sessions";
import { useFetchTeachers } from "#src/hooks/use-fetch-teachers";
import { setSessionIds } from "#src/stores/booking-flow/actions";
import { selectSessionIdsAsString } from "#src/stores/booking-flow/selectors";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
import { useTranslation } from "#src/utils/i18n";

import { GroupSessionHeader } from "./group-session-header";

type SessionSelectionStepProps = {
  currentSessionId: number;
  groupId?: number | null;
};

export const SessionSelectionStep: FC<SessionSelectionStepProps> = ({
  currentSessionId,
  groupId,
}) => {
  const { t, i18n } = useTranslation("sessionManagement");
  const locale = i18n.language;

  const isSeries = !!groupId;

  const companyTheme = dataAccessLayer.useCompanyTheme();

  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past">("upcoming");

  // Sessions
  const selectedIds = useBookingFlowStore(selectSessionIdsAsString);

  const { data: similarSessions, isLoading: similarSessionsLoading } =
    useFetchSimilarSessions(
      currentSessionId,
      !isSeries, // only fetch similar sessions when not in a group, otherwise the group sessions will be the options
    );

  const { data: sessionsInGroup, isLoading: sessionsInGroupLoading } =
    useFetchSessionsInGroup(
      groupId ?? null,
      {
        available: true,
      },
      isSeries, // only fetch sessions in group when groupId is provided
    );

  const {
    groupSession,
    isLoading: groupSessionIsLoading,
    level,
    metaActivity,
  } = useRetrieveRefinedGroupSession(groupId);

  const sessions = isSeries ? sessionsInGroup : similarSessions;
  const sessionsLoading = isSeries
    ? sessionsInGroupLoading
    : similarSessionsLoading;

  const now = getLocalNow({ locale, zone: companyTheme?.company.timezone });

  const filteredSessions = useMemo(() => {
    if (!sessions) return undefined;
    return sessions.filter((s) =>
      timeFilter === "upcoming"
        ? fromIsoString(s.date_start) >= now
        : fromIsoString(s.date_start) < now,
    );
  }, [sessions, timeFilter, now]);

  // IDs of sessions currently visible in the filtered list
  const filteredIds = useMemo(
    () => new Set(filteredSessions?.map((session) => String(session.id)) ?? []),
    [filteredSessions],
  );

  //
  const upcomingSessions = useMemo(() => {
    if (!sessions) return [];
    return sessions.filter((s) => fromIsoString(s.date_start) >= now);
  }, [sessions, now]);

  const upcomingSelectedCount = useMemo(
    () =>
      upcomingSessions.filter((s) => selectedIds.includes(String(s.id))).length,
    [upcomingSessions, selectedIds],
  );

  const hasPartialSeriesSelection =
    !!groupSession &&
    groupSession.full_booking_only &&
    !groupSession.allow_booking_after_start &&
    upcomingSessions.length > 0 &&
    upcomingSelectedCount < upcomingSessions.length;

  const [showPartialSeriesAlert, setShowPartialSeriesAlert] = useState(true);

  // Credits
  const keepCredits = useBookingFlowStore((state) => state.keepCredits);

  const {
    totalCreditsUsed,
    availableCredits,
    remainingCredits,
    isUnlimited,
    getSessionCreditCost,
  } = useSessionCredits({ currentSessionId, sessions });

  const areCreditsExhausted =
    !keepCredits &&
    !isUnlimited &&
    remainingCredits <= 0 &&
    filteredSessions &&
    filteredSessions.length > 0;

  const [showRemainingCredit, setShowRemainingCredit] = useState(true);

  const [showExhaustedCredits, setShowExhaustedCredits] = useState(true);

  // Teachers
  const coachIds = useMemo(
    () => [...new Set(filteredSessions?.map((s) => s.coach) ?? [])],
    [filteredSessions],
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

      // Preserve selections from the non-visible filter
      const hiddenSelections = selectedIds.filter((id) => !filteredIds.has(id));
      const merged = [...new Set([...hiddenSelections, ...next])];

      // When credits matter, cap selection to what the pass can afford
      if (!keepCredits && !isUnlimited && filteredSessions) {
        let budget = availableCredits;
        const capped: string[] = [...hiddenSelections];
        const currentId = String(currentSessionId);

        // Walk sessions in display order (chronological), keeping those in `next`
        for (const session of filteredSessions) {
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

      setSessionIds(merged.map(Number));
    },
    [
      selectedIds,
      keepCredits,
      isUnlimited,
      filteredSessions,
      filteredIds,
      availableCredits,
      getSessionCreditCost,
      currentSessionId,
    ],
  );

  const items = useMemo((): ListItemProps[] => {
    if (!filteredSessions) return [];

    return filteredSessions.map((session) => {
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
    filteredSessions,
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

  if (sessionsLoading || teachersLoading || groupSessionIsLoading) {
    return (
      <div className="flex w-full justify-center">
        <Loader size="xl" />
      </div>
    );
  }

  const shouldDisplayGroupSessionHeader =
    isSeries && groupSession && metaActivity && level;

  return (
    <div className="flex flex-col gap-md w-full">
      {shouldDisplayGroupSessionHeader && (
        <>
          <GroupSessionHeader
            groupSession={groupSession}
            metaActivity={metaActivity}
            level={level}
          />
          <Divider orientation="horizontal" weight="extra-thin" />
        </>
      )}
      <div className="flex gap-element-sm">
        <Body size="lg">
          {isSeries
            ? t("bookingFlow.sessionSelection.seriesDescription")
            : t("bookingFlow.sessionSelection.description")}
        </Body>
        <Badge
          color="default"
          size="lg"
          text={t("bookingFlow.sessionSelection.selected", {
            count: selectedIds.length,
          })}
        />
      </div>
      <SegmentedControl
        id="session-time-filter"
        options={[
          {
            label: t("bookingFlow.sessionSelection.upcoming"),
            value: "upcoming",
          },
          { label: t("bookingFlow.sessionSelection.past"), value: "past" },
        ]}
        value={timeFilter}
        onChangeValue={(value) => setTimeFilter(value as "upcoming" | "past")}
        fullWidth
      />
      <div className="max-h-component-content-centered overflow-y-auto">
        <List
          id="session-selection-list"
          items={items}
          isSelectable
          isCompact
          checkedIds={selectedIds}
          setCheckedIds={handleSessionSelect}
          header={{
            title: isSeries
              ? t("bookingFlow.sessionSelection.classesInSeries", {
                  count: filteredSessions?.length ?? 0,
                })
              : t("bookingFlow.sessionSelection.upcomingClasses", {
                  count: filteredSessions?.length ?? 0,
                }),
          }}
          emptyStateProps={{
            isEmpty: !filteredSessions || filteredSessions.length === 0,
            emptyConfig: {
              title: isSeries
                ? t("bookingFlow.sessionSelection.classesInSeries", {
                    count: 0,
                  })
                : t("bookingFlow.sessionSelection.upcomingClasses", {
                    count: 0,
                  }),
            },
          }}
        />
      </div>
      {hasPartialSeriesSelection && showPartialSeriesAlert && (
        <Alert
          status="warning"
          onClearClick={() => setShowPartialSeriesAlert(false)}
        >
          <Body size="md" color="inherit">
            {t("bookingFlow.sessionSelection.partialSeriesWarning", {
              count: upcomingSessions.length - upcomingSelectedCount,
            })}
          </Body>
        </Alert>
      )}
      {!keepCredits &&
        !isUnlimited &&
        !areCreditsExhausted &&
        showRemainingCredit && (
          <Alert
            status="info"
            onClearClick={() => setShowRemainingCredit(false)}
          >
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
      {areCreditsExhausted && showExhaustedCredits && (
        <Alert
          status="warning"
          onClearClick={() => setShowExhaustedCredits(false)}
        >
          <Body size="md" color="inherit">
            {t("bookingFlow.sessionSelection.creditsExhausted")}
          </Body>
        </Alert>
      )}
    </div>
  );
};
