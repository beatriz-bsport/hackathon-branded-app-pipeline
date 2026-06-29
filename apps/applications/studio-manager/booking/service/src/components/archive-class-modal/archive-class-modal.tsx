import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import {
  checkCanArchiveGroupActivity,
  groupActivityKeys,
} from "@bsport/api-book";
import { Alert, Body, Loader, Modal } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useArchiveClass } from "#src/hooks/use-archive-class";
import { CALENDAR_URL } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  open: boolean;
  onClose: () => void;
  classToArchive: { id: number; name: string } | null;
  onSuccess?: () => void;
};

type ContentProps = {
  classToArchive: { id: number; name: string };
  onClose: () => void;
  onSuccess?: () => void;
};

const ArchiveCheckContent = ({
  classToArchive,
  onClose,
  onSuccess,
}: ContentProps) => {
  const { t } = useTranslation("class-actions");
  const navigate = useNavigate();
  const { mutate: archiveClass } = useArchiveClass({
    onSuccess: () => {
      onClose();
      onSuccess?.();
    },
  });

  const { data: canArchive } = useSuspenseQuery({
    queryKey: [...groupActivityKeys.detail(classToArchive.id), "can-archive"],
    queryFn: () =>
      checkCanArchiveGroupActivity(fetch, classToArchive.id.toString()).then(
        (r) => r.can_destroy,
      ),
  });

  const handleViewUpcomingClassesClick = () => {
    onClose();
    navigate(CALENDAR_URL);
  };

  return (
    <Modal
      open
      size="md"
      title={t(
        canArchive
          ? "classActions.archiveModal.title"
          : "classActions.archiveModal.cantArchiveTitle",
        {
          className: classToArchive.name,
        },
      )}
      onClose={onClose}
      confirmButton={
        canArchive
          ? {
              label: t("classActions.archiveModal.confirm"),
              color: "critical",
              onClick: () => archiveClass(classToArchive.id),
            }
          : {
              label: t("classActions.archiveModal.viewUpcomingClasses"),
              iconRight: "link-external-02",
              onClick: handleViewUpcomingClassesClick,
            }
      }
      cancelButton={{
        label: t(
          canArchive
            ? "classActions.archiveModal.keep"
            : "classActions.archiveModal.cancel",
        ),
        onClick: onClose,
      }}
    >
      {canArchive ? (
        <Body htmlVariant="p" size="md" weight="weak">
          {t("classActions.archiveModal.modalContent", {
            className: classToArchive.name,
          })}
        </Body>
      ) : (
        <Alert status="warning" type="weak">
          {t("classActions.archiveModal.cantArchive", {
            className: classToArchive.name,
          })}
        </Alert>
      )}
    </Modal>
  );
};

export const ArchiveClassModal = ({
  open,
  onClose,
  classToArchive,
  onSuccess,
}: Props) => {
  const { t } = useTranslation("class-actions");

  if (!open || !classToArchive) return null;

  return (
    <QueryBoundary
      loadingFallback={
        <Modal
          open
          size="md"
          title={t("classActions.archiveModal.title", {
            className: classToArchive.name,
          })}
          onClose={onClose}
          cancelButton={{
            label: t("classActions.archiveModal.cancel"),
            onClick: onClose,
          }}
        >
          <div className="grid place-content-center py-md">
            <Loader size="md" />
          </div>
        </Modal>
      }
      errorFallback={({ onRetry }) => (
        <Modal
          open
          size="md"
          title={t("classActions.archiveModal.title", {
            className: classToArchive.name,
          })}
          onClose={onClose}
          confirmButton={{
            label: t("classActions.archiveModal.retry"),
            onClick: onRetry,
          }}
          cancelButton={{
            label: t("classActions.archiveModal.cancel"),
            onClick: onClose,
          }}
        >
          {t("classActions.archiveModal.checkError")}
        </Modal>
      )}
    >
      <ArchiveCheckContent
        classToArchive={classToArchive}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </QueryBoundary>
  );
};
