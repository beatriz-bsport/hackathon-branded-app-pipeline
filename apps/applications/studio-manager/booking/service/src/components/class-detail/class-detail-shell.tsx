import {
  type FC,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router";

import type { MetaActivity } from "@bsport/api-book";
import { type PassCategory } from "@bsport/api-buyables";
import { ControlledForm, useFormController } from "@bsport/form";
import {
  Body,
  DetailsLayout,
  type FilterElementState,
  Modal,
  toast,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { ClassDetailHeader } from "#src/components/class-detail/class-detail-header";
import { CompatiblePassesTab } from "#src/components/class-detail/compatible-passes-tab";
import { ClassEditorForm } from "#src/components/class-editor/class-editor-form";
import { COMPATIBLE_PASSES_SEARCH_DEBOUNCE_MS } from "#src/hooks/constants";
import { useEditClass } from "#src/hooks/use-edit-class";
import { useModal } from "#src/hooks/use-modal";
import {
  type ClassFormValues,
  fromMetaActivityToFormData,
  toEditGroupActivityPayload,
  useClassFormSchema,
} from "#src/utils/class-form";
import { useTranslation } from "#src/utils/i18n";

const VALID_TABS = ["editor", "compatiblePasses"] as const;
type ClassDetailTab = (typeof VALID_TABS)[number];

const getActiveTab = (raw: string | null): ClassDetailTab =>
  (VALID_TABS as readonly string[]).includes(raw ?? "")
    ? (raw as ClassDetailTab)
    : "editor";

type ClassDetailShellProps = {
  metaActivity: MetaActivity;
};

export const ClassDetailShell: FC<ClassDetailShellProps> = ({
  metaActivity,
}) => {
  const { t } = useTranslation("class-detail");
  const { detailsLayoutProps, toggleHasUnsavedChanges } = useDetailsLayout();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const filterRef = useRef<{ resetFilters: () => void }>(null);
  const [categories, setCategories] = useState<PassCategory[]>([]);

  const handleFilterChange = useCallback((elements: FilterElementState[]) => {
    const active = elements.filter(
      (e) => e.field !== null && e.valueIds.length > 0,
    );
    setCategoryIds(
      active
        .filter((e) => e.field === "categories")
        .flatMap((e) => e.valueIds.map(Number)),
    );
    setSelectedProperties(
      active.filter((e) => e.field === "properties").flatMap((e) => e.valueIds),
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    filterRef.current?.resetFilters();
  }, []);

  const handleCategoriesReady = useCallback((cats: PassCategory[]) => {
    setCategories(cats);
  }, []);

  const compatiblePassesFilterConfig = useMemo(
    () => ({
      filters: [
        {
          id: "is",
          label: t("classDetail.compatiblePasses.filter.operatorIs"),
        },
      ],
      fields: {
        categories: {
          id: "categories",
          label: t("classDetail.compatiblePasses.filter.categories"),
          availableFilters: ["is"],
          values: categories.map((c) => ({ id: String(c.id), label: c.name })),
          multiSelect: true,
        },
        properties: {
          id: "properties",
          label: t("classDetail.compatiblePasses.filter.properties"),
          availableFilters: ["is"],
          values: [
            {
              id: "universal",
              label: t("classDetail.compatiblePasses.flags.universal"),
            },
            {
              id: "unlisted",
              label: t("classDetail.compatiblePasses.flags.unlisted"),
            },
            {
              id: "staffRestricted",
              label: t("classDetail.compatiblePasses.flags.staffRestricted"),
            },
            {
              id: "newMembersOnly",
              label: t("classDetail.compatiblePasses.flags.newMembersOnly"),
            },
          ],
          multiSelect: true,
        },
      },
      selectFieldLabel: t("classDetail.compatiblePasses.filter.selectField"),
      onFilterChange: handleFilterChange,
    }),
    [categories, t, handleFilterChange],
  );

  const compatiblePassesSearchConfig = useMemo(
    () => ({
      id: "compatible-passes-search",
      position: "right" as const,
      placeholder: t("classDetail.compatiblePasses.search.placeholder"),
      inputValue: searchQuery,
      onInputValueChange: setSearchQuery,
      onClear: () => setSearchQuery(""),
      debounceValue: COMPATIBLE_PASSES_SEARCH_DEBOUNCE_MS,
    }),
    [searchQuery, t],
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = getActiveTab(searchParams.get("tab"));

  const schema = useClassFormSchema("edit");
  const methods = useFormController({
    schema,
    mode: "onSubmit",
    defaultValues: fromMetaActivityToFormData(metaActivity),
  });

  const formId = `class-editor-form-${useId()}`;
  const isDirty = methods.formState.isDirty;

  useEffect(() => {
    toggleHasUnsavedChanges(isDirty);
  }, [isDirty, toggleHasUnsavedChanges]);

  const { mutateAsync, isPending } = useEditClass();

  async function onSubmit(values: ClassFormValues) {
    try {
      const result = await mutateAsync({
        id: metaActivity.id,
        data: toEditGroupActivityPayload(values),
      });
      methods.reset(fromMetaActivityToFormData(result));
      toast({
        status: "default",
        icon: "edit-02",
        buttonIcon: "x",
        description: t("classDetail.editor.toast"),
      });
    } catch {
      // useEditClass handles error toast
    }
  }

  const {
    isOpen: isDiscardOpen,
    open: openDiscard,
    close: closeDiscard,
  } = useModal();

  function handleDiscardConfirm() {
    methods.reset();
    closeDiscard();
    toast({
      status: "default",
      icon: "flip-forward",
      buttonIcon: "x",
      description: t("classDetail.editor.discard.toast"),
    });
  }

  const handleTabChange = useCallback(
    (tabId: string) => {
      setSearchParams(
        (prev) => {
          prev.set("tab", tabId);
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const pageTabs = {
    value: activeTab,
    onValueChange: handleTabChange,
    orientation: "horizontal" as const,
    tabs: [
      { id: "editor", label: t("classDetail.tabs.editor") },
      { id: "compatiblePasses", label: t("classDetail.tabs.compatiblePasses") },
    ],
  };

  return (
    <>
      <ControlledForm {...methods} onSubmit={onSubmit} id={formId}>
        <DetailsLayout {...detailsLayoutProps}>
          <ClassDetailHeader
            metaActivity={metaActivity}
            pageTabs={pageTabs}
            {...(activeTab === "compatiblePasses" && {
              filterConfig: compatiblePassesFilterConfig,
              filterRef,
              searchConfig: compatiblePassesSearchConfig,
            })}
          />
          <DetailsLayout.Content className="max-w-none !p-0">
            {activeTab === "editor" && <ClassEditorForm />}
            {activeTab === "compatiblePasses" && (
              <CompatiblePassesTab
                metaActivityId={metaActivity.id}
                searchQuery={searchQuery}
                categoryIds={categoryIds}
                properties={selectedProperties}
                clearFilters={clearFilters}
                onCategoriesReady={handleCategoriesReady}
              />
            )}
          </DetailsLayout.Content>
          {activeTab === "editor" && (
            <DetailsLayout.Confirmation
              onDiscard={openDiscard}
              formSubmit={{ formId, isSubmitting: isPending }}
            />
          )}
        </DetailsLayout>
      </ControlledForm>
      {isDiscardOpen && (
        <Modal
          open
          size="md"
          title={t("classDetail.editor.discard.title")}
          onCloseButtonClick={closeDiscard}
          onClickOutside={closeDiscard}
          confirmButton={{
            label: t("classDetail.editor.discard.confirm"),
            color: "critical",
            onClick: handleDiscardConfirm,
          }}
          cancelButton={{
            label: t("classDetail.editor.discard.keepEditing"),
            onClick: closeDiscard,
          }}
        >
          <Body htmlVariant="p">
            {t("classDetail.editor.discard.description")}
          </Body>
        </Modal>
      )}
    </>
  );
};
