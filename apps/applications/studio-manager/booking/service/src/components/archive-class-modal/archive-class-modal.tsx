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
};

type ContentProps = {
  classToArchive: { id: number; name: string };
  onClose: () => void;
};

const ArchiveCheckContent = ({ classToArchive, onClose }: ContentProps) => {
  const { t } = useTranslation("list");
  const { mutate: archiveClass } = useArchiveClass({ onSuccess: onClose });

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
      title={t("list.archiveModal.title")}
      onClose={onClose}
      confirmButton={
        canDestroy
          ? {
              label: t("list.archiveModal.confirm"),
              color: "critical",
              onClick: () => archiveClass(classToArchive.id),
            }
          : undefined
      }
      cancelButton={{
        label: t("list.archiveModal.cancel"),
        onClick: onClose,
      }}
    >
      <Trans
        i18nKey={
          canDestroy
            ? "list.archiveModal.modalContent"
            : "list.archiveModal.cantArchive"
        }
        ns={getFixedNamespace("list")}
        values={{ className: classToArchive.name }}
      />
    </Modal>
  );
};

export const ArchiveClassModal = ({ open, onClose, classToArchive }: Props) => {
  const { t } = useTranslation("list");

  if (!open || !classToArchive) return null;

  return (
    <QueryBoundary
      loadingFallback={
        <Modal
          open
          size="md"
          title={t("list.archiveModal.title")}
          onClose={onClose}
          cancelButton={{
            label: t("list.archiveModal.cancel"),
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
          title={t("list.archiveModal.title")}
          onClose={onClose}
          confirmButton={{
            label: t("list.archiveModal.retry"),
            onClick: onRetry,
          }}
          cancelButton={{
            label: t("list.archiveModal.cancel"),
            onClick: onClose,
          }}
        >
          <Trans
            i18nKey="list.archiveModal.checkError"
            ns={getFixedNamespace("list")}
          />
        </Modal>
      )}
    >
      <ArchiveCheckContent classToArchive={classToArchive} onClose={onClose} />
    </QueryBoundary>
  );
};
