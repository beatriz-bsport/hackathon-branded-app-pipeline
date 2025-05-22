import React, { useCallback, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";

import {
  Button,
  ExpandableSearchInputProps,
  ListLayout,
  Modal,
  Tabs,
  TabsProps,
  TextField,
} from "@bsport/kaizen-primitive-core";

import {
  EMAIL_TEMPLATE_CATEGORY_FAKE_ITEMS,
  EMAIL_TEMPLATE_FAKE_ITEMS,
} from "#src/FAKE_DATA";
import BaseEmailTemplateList from "#src/components/BaseEmailTemplateList";
import CustomEmailTemplateList from "#src/components/CustomEmailTemplateList";
import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export type EmailTemplate = {
  id: number;
  title: string;
  subject: string;
  category: number | null;
};

export type EmailTemplateCategory = {
  id: number;
  name: string;
};
type PossibleActiveTab = "default" | "master" | "bsport";

const EmailTemplateSummaryPage: React.FC = () => {
  const [isCreateEmailTemplateModalOpen, setIsCreateEmailTemplateModalOpen] =
    useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);
  const [isPreviewEmailTemplateModalOpen, setIsPreviewEmailTemplateModalOpen] =
    useState(false);
  const [
    isDuplicateEmailTemplateModalOpen,
    setIsDuplicateEmailTemplateModalOpen,
  ] = useState(false);
  const [isDeleteEmailTemplateModalOpen, setIsDeleteEmailTemplateModalOpen] =
    useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] =
    useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);

  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<EmailTemplateCategory | null>(null);
  const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useTranslation("list");
  const [activeTab, setActiveTab] = useState<PossibleActiveTab>("default");
  const TABS_CONFIG = [
    {
      id: "default",
      href: ROUTES.ROOT,
      label: t("tabs.customTemplates"),
    },
    {
      id: "master",
      href: ROUTES.MASTER_TEMPLATES,
      label: t("tabs.masterTemplates"),
    },
    {
      id: "bsport",
      href: ROUTES.BSPORT_TEMPLATES,
      label: t("tabs.bsportTemplates"),
    },
  ];
  const emailTemplateTabsConfig: TabsProps = {
    TabsItems: TABS_CONFIG.map((tab) => (
      <NavLink to={tab.href} id={tab.id} key={tab.id}>
        {({ isActive }) => <Tabs.Item {...tab} isActive={isActive} />}
      </NavLink>
    )),
    orientation: "horizontal",
  };

  useEffect(() => {
    if (pathname.includes("bsport-templates")) {
      setActiveTab("bsport");
      return;
    } else if (pathname.includes("master-templates")) {
      setActiveTab("master");
      return;
    }
    setActiveTab("default");
  }, [pathname]);

  const emailTemplateSearchConfig: ExpandableSearchInputProps = {
    id: "email-template-search",
  };

  const handleOpenCreateCategoryModal = useCallback(() => {
    setIsCreateCategoryModalOpen(true);
  }, []);

  const handleOpenInformationModal = useCallback(() => {
    setIsInformationModalOpen(true);
  }, []);

  const handleCloseInformationModal = useCallback(() => {
    setIsInformationModalOpen(false);
  }, []);

  const handleCloseCreateCategoryModal = useCallback(() => {
    setIsCreateCategoryModalOpen(false);
  }, []);

  const handleOpenCreateEmailTemplateModal = useCallback(() => {
    setIsCreateEmailTemplateModalOpen(true);
  }, []);

  const handleCloseCreateEmailTemplateModal = useCallback(() => {
    setIsCreateEmailTemplateModalOpen(false);
  }, []);

  const handleClosePreviewEmailTemplateModal = useCallback(() => {
    setSelectedTemplate(null);
    setIsPreviewEmailTemplateModalOpen(false);
  }, []);

  const handleCloseDuplicateEmailTemplateModal = useCallback(() => {
    setSelectedTemplate(null);
    setIsDuplicateEmailTemplateModalOpen(false);
  }, []);

  const handlePreviewTemplate = useCallback((template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewEmailTemplateModalOpen(true);
  }, []);

  const handleDuplicateTemplate = useCallback((template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsDuplicateEmailTemplateModalOpen(true);
  }, []);

  const handleDeleteTemplate = useCallback((emailTemplate: EmailTemplate) => {
    setSelectedTemplate(emailTemplate);
    setIsDeleteEmailTemplateModalOpen(true);
  }, []);

  const handleCloseDeleteEmailTemplateModal = useCallback(() => {
    setSelectedTemplate(null);
    setIsDeleteEmailTemplateModalOpen(false);
  }, []);

  const handleDeleteCategory = useCallback(
    (category: EmailTemplateCategory) => {
      setSelectedCategory(category);
      setIsDeleteCategoryModalOpen(true);
    },
    [],
  );
  const handleCloseDeleteCategoryModal = useCallback(() => {
    setSelectedCategory(null);
    setIsDeleteCategoryModalOpen(false);
  }, []);

  const handleEditCategory = useCallback((category: EmailTemplateCategory) => {
    setSelectedCategory(category);
    setIsEditCategoryModalOpen(true);
  }, []);

  const handleCloseEditCategoryModal = useCallback(() => {
    setSelectedCategory(null);
    setIsEditCategoryModalOpen(false);
  }, []);

  const layoutEndGroupActions =
    activeTab === "bsport"
      ? [
          <Button
            key="info-cta-email-template-page"
            intent="call-to-action"
            color="main"
            size="md"
            iconLeft="message-question-square"
            onClick={handleOpenInformationModal}
          />,
        ]
      : [
          <Button
            key="create-category-cta-email-template-page"
            intent="default"
            color="main"
            size="md"
            iconLeft="plus"
            label={t("activeList.actions.addCategory")}
            onClick={handleOpenCreateCategoryModal}
          />,
          <Button
            key="create-template-cta-email-template-page"
            intent="call-to-action"
            color="main"
            size="md"
            iconLeft="plus"
            label={t("activeList.actions.addTemplate")}
            onClick={handleOpenCreateEmailTemplateModal}
          />,
        ];

  return (
    <>
      <ListLayout>
        <ListLayout.Header
          pageTitle={t("pages.active")}
          endGroupActions={layoutEndGroupActions}
          pageTabs={emailTemplateTabsConfig}
          searchConfig={emailTemplateSearchConfig}
        />
        <ListLayout.Content>
          {activeTab === "default" ? (
            <CustomEmailTemplateList
              emailTemplateList={EMAIL_TEMPLATE_FAKE_ITEMS}
              categoryList={EMAIL_TEMPLATE_CATEGORY_FAKE_ITEMS}
              handleAddCategory={handleOpenCreateCategoryModal}
              handleAddTemplate={handleOpenCreateEmailTemplateModal}
              handlePreviewTemplate={handlePreviewTemplate}
              handleDuplicateTemplate={handleDuplicateTemplate}
              handleDeleteCategory={handleDeleteCategory}
              handleDeleteTemplate={handleDeleteTemplate}
              handleEditcategory={handleEditCategory}
            />
          ) : (
            <BaseEmailTemplateList
              model={activeTab}
              emailTemplateList={EMAIL_TEMPLATE_FAKE_ITEMS}
              handleAddCategory={handleOpenCreateCategoryModal}
              handleAddTemplate={handleOpenCreateEmailTemplateModal}
              handlePreviewTemplate={handlePreviewTemplate}
              handleDuplicateTemplate={handleDuplicateTemplate}
            />
          )}
        </ListLayout.Content>
      </ListLayout>

      <Modal
        open={isInformationModalOpen}
        onClose={handleCloseInformationModal}
        title={t("activeList.bsportTemplateInfo.title")}
        confirmLabel={t("activeList.bsportTemplateInfo.quit")}
        confirmColor="main"
        onConfirmClick={handleCloseInformationModal}
        size="lg"
      >
        <div className="flex flex-col gap-y-[16px]">
          <p>{t("activeList.bsportTemplateInfo.description.firstStep")}</p>
          <p>{t("activeList.bsportTemplateInfo.description.secondStep")}</p>
        </div>
      </Modal>
      <Modal
        open={isCreateCategoryModalOpen}
        onClose={handleCloseCreateCategoryModal}
        title={t("activeList.createCategoryModal.title")}
        confirmLabel={t("activeList.createCategoryModal.confirmButton")}
        confirmColor="main"
        onConfirmClick={handleCloseCreateCategoryModal}
        cancelLabel={t("activeList.createCategoryModal.cancelButton")}
        size="lg"
      >
        <TextField
          id="create-category-title-input"
          type="text"
          status="default"
          label={t("activeList.createCategoryModal.textInput.label")}
          placeholder={t(
            "activeList.createCategoryModal.textInput.placeholder",
          )}
          required
        />
      </Modal>
      <Modal
        open={isCreateEmailTemplateModalOpen}
        onClose={handleCloseCreateEmailTemplateModal}
        title={t("activeList.createTemplateModal.title")}
        confirmLabel={t("activeList.createTemplateModal.confirmButton")}
        confirmColor="main"
        onConfirmClick={handleCloseCreateEmailTemplateModal}
        cancelLabel={t("activeList.createTemplateModal.cancelButton")}
        size="lg"
      >
        <div className="flex flex-col gap-y-[16px]">
          <p>{t("activeList.createTemplateModal.description")}</p>
          <TextField
            id="create-email-template-title-input"
            type="text"
            status="default"
            label={t("activeList.createTemplateModal.textInput.label")}
            placeholder={t(
              "activeList.createTemplateModal.textInput.placeholder",
            )}
            required
          />
        </div>
      </Modal>
      <Modal
        open={isPreviewEmailTemplateModalOpen}
        onClose={handleClosePreviewEmailTemplateModal}
        title={selectedTemplate?.title || ""}
        confirmLabel={t("activeList.createTemplateModal.confirmButton")}
        confirmColor="main"
        onConfirmClick={handleClosePreviewEmailTemplateModal}
        cancelLabel={t("activeList.createTemplateModal.cancelButton")}
        size="lg"
      >
        <p>This is the email template preview modal</p>
      </Modal>
      <Modal
        open={isDuplicateEmailTemplateModalOpen}
        onClose={handleCloseDuplicateEmailTemplateModal}
        title={t("activeList.duplicateTemplateModal.title")}
        confirmLabel={t("activeList.duplicateTemplateModal.confirmButton")}
        confirmColor="main"
        onConfirmClick={handleCloseDuplicateEmailTemplateModal}
        cancelLabel={t("activeList.duplicateTemplateModal.cancelButton")}
        size="lg"
      >
        <div className="flex flex-col gap-y-[16px]">
          <p>
            {t("activeList.duplicateTemplateModal.description.firstStep")}
            <span className="fontWeight-strong">{selectedTemplate?.title}</span>
            ?
          </p>
          <p>{t("activeList.duplicateTemplateModal.description.secondStep")}</p>
        </div>
      </Modal>
      <Modal
        open={isDeleteCategoryModalOpen}
        onClose={handleCloseDeleteCategoryModal}
        title={t("activeList.deleteCategoryModal.title")}
        confirmLabel={t("activeList.deleteCategoryModal.confirmButton")}
        confirmColor="main"
        onConfirmClick={handleCloseDeleteCategoryModal}
        cancelLabel={t("activeList.deleteCategoryModal.cancelButton")}
        size="lg"
      >
        <div className="flex flex-col gap-y-[16px]">
          <p>
            {t("activeList.deleteCategoryModal.description.firstStep")}
            <span className="fontWeight-strong">{selectedCategory?.name}</span>?
          </p>
          <p>{t("activeList.deleteCategoryModal.description.secondStep")}</p>
        </div>
      </Modal>
      <Modal
        open={isDeleteEmailTemplateModalOpen}
        onClose={handleCloseDeleteEmailTemplateModal}
        title={t("activeList.deleteCategoryModal.title")}
        confirmLabel={t("activeList.deleteCategoryModal.confirmButton")}
        confirmColor="main"
        onConfirmClick={handleCloseDeleteEmailTemplateModal}
        cancelLabel={t("activeList.deleteCategoryModal.cancelButton")}
        size="lg"
      >
        <div className="flex flex-col gap-y-[16px]">
          <p>
            {t("activeList.deleteTemplateModal.description.firstStep")}
            <span className="fontWeight-strong">{selectedTemplate?.title}</span>
            ?
          </p>
          <p>{t("activeList.deleteTemplateModal.description.secondStep")}</p>
        </div>
      </Modal>
      <Modal
        open={isEditCategoryModalOpen}
        onClose={handleCloseEditCategoryModal}
        title={t("activeList.renameCategoryModal.title")}
        confirmLabel={t("activeList.renameCategoryModal.confirmButton")}
        confirmColor="main"
        onConfirmClick={handleCloseEditCategoryModal}
        cancelLabel={t("activeList.renameCategoryModal.cancelButton")}
        size="lg"
      >
        <TextField
          id="edit-category-title-input"
          type="text"
          status="default"
          label={t("activeList.renameCategoryModal.textInput.label")}
          placeholder={t(
            "activeList.renameCategoryModal.textInput.placeholder",
          )}
          required
        />
      </Modal>
    </>
  );
};

export default EmailTemplateSummaryPage;
