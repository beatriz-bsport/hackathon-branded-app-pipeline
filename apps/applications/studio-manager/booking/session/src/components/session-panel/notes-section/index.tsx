import { type ChangeEvent, type FC, useEffect, useState } from "react";

import {
  Body,
  Button,
  Divider,
  TextArea,
  Title,
  toast,
} from "@bsport/kaizen-primitive-core";

import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useUpdateInternalNote } from "#src/hooks/session-api/session-actions/use-update-internal-note";
import { useTranslation } from "#src/utils/i18n";
import { useAnyObjectLevelPermissions } from "#src/utils/permission";

import { NOTES_MAX_LENGTH } from "./constants";
import { DeleteNoteModal } from "./delete-note-modal";

export const NotesSection: FC<{ sessionId: number }> = ({ sessionId }) => {
  const { t } = useTranslation("sessionManagement");
  const { data: session } = useRetrieveSession(sessionId);
  const persistedNote = session.internal_note ?? "";

  // The session-overview payload doesn't expose is_workshop, so grant if the
  // role has the permission on either session type (matches CalendarPage).
  const canViewNotes = useAnyObjectLevelPermissions([
    "session.activity.allowed_actions.viewNotes",
    "session.workshop.allowed_actions.viewNotes",
  ]);
  const canEditNotes = useAnyObjectLevelPermissions([
    "session.activity.allowed_actions.editNotes",
    "session.workshop.allowed_actions.editNotes",
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(persistedNote);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Resync draft from cache only when not editing — protects in-flight typing.
  useEffect(() => {
    if (!isEditing) setDraft(persistedNote);
  }, [persistedNote, isEditing]);

  const { mutate, isPending } = useUpdateInternalNote();

  if (!canViewNotes) return null;

  const showSaveError = () =>
    toast({
      status: "critical",
      description: t("sessionPanel.notes.errorToast"),
    });

  const handleCancel = () => {
    setDraft(persistedNote);
    setIsEditing(false);
  };

  const handleSave = () => {
    mutate(
      { sessionId, params: { internal_note: draft.trim() } },
      {
        onError: showSaveError,
        // Close the editor only on success; on failure the note is rolled back
        // so keep edit mode with the draft intact for retry (mirrors delete).
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  const handleDelete = () => {
    mutate(
      { sessionId, params: { internal_note: "" } },
      {
        onError: showSaveError,
        onSettled: (_data, error) => {
          setIsDeleteOpen(false);
          // On failure the note is rolled back; keep edit mode so the user can
          // retry without re-opening the editor (mirrors the save-error path).
          if (!error) setIsEditing(false);
        },
      },
    );
  };

  return (
    <>
      <Divider weight="extra-thin" />
      <section>
        <header className="flex items-center justify-between">
          <Title htmlVariant="h4" weight="strong">
            {t("sessionPanel.notes.title")}
          </Title>
          <div className="flex gap-xs">
            {canEditNotes &&
              (isEditing ? (
                <>
                  <Button
                    kind="icon-button"
                    icon="x-close"
                    size="md"
                    intent="flat"
                    color="default"
                    label={t("sessionPanel.notes.cancelAriaLabel")}
                    onClick={handleCancel}
                    disabled={isPending}
                  />
                  <Button
                    kind="icon-button"
                    icon="trash-01"
                    size="md"
                    intent="flat"
                    color="default"
                    label={t("sessionPanel.notes.deleteAriaLabel")}
                    onClick={() => setIsDeleteOpen(true)}
                    disabled={isPending}
                  />
                  <Button
                    kind="icon-button"
                    icon="check"
                    size="md"
                    intent="default"
                    color="main"
                    label={t("sessionPanel.notes.saveAriaLabel")}
                    onClick={handleSave}
                    loading={isPending}
                  />
                </>
              ) : (
                <Button
                  kind="icon-button"
                  icon="pencil-02"
                  size="md"
                  intent="flat"
                  color="default"
                  label={t("sessionPanel.notes.editAriaLabel")}
                  onClick={() => setIsEditing(true)}
                />
              ))}
          </div>
        </header>
        <div className="pt-sm">
          {isEditing ? (
            <TextArea
              id="session-notes"
              value={draft}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setDraft(e.target.value)
              }
              maxLength={NOTES_MAX_LENGTH}
              placeholder={t("sessionPanel.notes.placeholder")}
              // Auto-grow to fit the note via field-sizing (Chrome/Edge/Safari);
              // Firefox lacks it and falls back to the min-h floor
              // max-h caps runaway growth
              className="!bg-surface-default [field-sizing:content] !min-h-[8rem] overflow-y-auto"
            />
          ) : persistedNote ? (
            <Body
              htmlVariant="p"
              size="lg"
              weight="weak"
              className="whitespace-pre-wrap"
            >
              {persistedNote}
            </Body>
          ) : null}
        </div>
        <DeleteNoteModal
          isOpen={isDeleteOpen}
          isPending={isPending}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      </section>
    </>
  );
};
