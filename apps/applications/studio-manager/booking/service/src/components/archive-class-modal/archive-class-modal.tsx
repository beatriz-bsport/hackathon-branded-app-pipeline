import { useSuspenseQuery } from "@tanstack/react-query";

import {
  checkCanArchiveGroupActivity,
  groupActivityKeys,
} from "@bsport/api-book";
import { Loader, Modal } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useArchiveClass } from "#src/hooks/use-archive-class";
import { fetch } from "#src/utils/fetch";
import { Trans, getFixedNamespace, useTranslation } from "#src/utils/i18n";

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
  const { mutate: archiveClass } = useArchiveClass({
    onSuccess: () => {
      onClose();
      onSuccess?.();
    },
  });

  const { data: canDestroy } = useSuspenseQuery({
    queryKey: [...groupActivityKeys.detail(classToArchive.id), "can-archive"],
    queryFn: () =>
      checkCanArchiveGroupActivity(fetch, classToArchive.id.toString()).then(
        (r) => r.can_destroy,
      ),
  });

  return (
    <Modal
      open
      size="md"
      title={t("classActions.archiveModal.title", {
        className: classToArchive.name,
      })}
      onClose={onClose}
      confirmButton={
        canDestroy
          ? {
              label: t("classActions.archiveModal.confirm"),
              color: "critical",
              onClick: () => archiveClass(classToArchive.id),
            }
          : undefined
      }
      cancelButton={{
        label: t("classActions.archiveModal.cancel"),
        onClick: onClose,
      }}
    >
      <Trans
        i18nKey={
          canDestroy
            ? "classActions.archiveModal.modalContent"
            : "classActions.archiveModal.cantArchive"
        }
        ns={getFixedNamespace("class-actions")}
        values={{ className: classToArchive.name }}
      />
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
          <Trans
            i18nKey="classActions.archiveModal.checkError"
            ns={getFixedNamespace("class-actions")}
          />
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
