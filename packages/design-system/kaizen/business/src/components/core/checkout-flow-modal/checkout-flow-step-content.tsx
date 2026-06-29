import React from "react";

import type { Fetch } from "@bsport/fetch";
import { ControlledForm } from "@bsport/form";
import { Accordion, Title } from "@bsport/kaizen-primitive-core";

import { MemberSelectorModal } from "#src/components/cdp/member/member-selector-modal";
import { i18nInstance, useTranslation } from "#src/i18n";

import { AddItemSection } from "./add-item-section";
import { CheckoutFlowTrackingProvider } from "./checkout-flow-tracking-context";
import { MemberAndBillingGroupCard } from "./member-and-billing-group-card";
import {
  SummaryFootnoteButton,
  SummarySection,
  SummaryTitle,
} from "./summary-section";
import type { useCheckoutFlowStep } from "./use-checkout-flow-step";

const CHECKOUT_FLOW_HEADER_FOOTER_SIZE = "308px";

type CheckoutFlowStepContentProps = {
  companyId: number;
  fetch: Fetch;
} & ReturnType<typeof useCheckoutFlowStep>;

export const CheckoutFlowStepContent: React.FC<
  CheckoutFlowStepContentProps
> = ({
  companyId,
  fetch,
  t,
  formId,
  isMobile,
  methods,
  track,
  isLoadingMember,
  fetchedMember,
  handleFormSubmit,
  openSummarySection,
  openAddItemSection,
  isFootnoteModalOpen,
  setIsFootnoteModalOpen,
  addItemCollapseSetOpenRef,
  summaryCollapseSetOpenRef,
  isMemberSelectorOpen,
  handleMemberSelectorClose,
  handleMemberSelect,
  handleOpenMemberProfile,
  handleOpenMemberSelector,
}) => {
  const { t: tCdp } = useTranslation("cdp", { i18n: i18nInstance });

  return (
    <CheckoutFlowTrackingProvider track={track}>
      <ControlledForm
        {...methods}
        onSubmit={handleFormSubmit}
        id={formId}
        className="flex flex-col h-full gap-lg"
      >
        {isLoadingMember ? (
          <div className="p-md">{t("checkoutFlowModal.loadingMemberInfo")}</div>
        ) : (
          <MemberAndBillingGroupCard
            companyId={companyId}
            fetch={fetch}
            className="bg-surface-default-weaker"
            member={fetchedMember ?? null}
            onEditClick={handleOpenMemberSelector}
          />
        )}

        <div
          style={{ "--header-footer-size": CHECKOUT_FLOW_HEADER_FOOTER_SIZE }}
          className="flex flex-1 min-h-0"
        >
          {isMobile ? (
            <Accordion className="flex flex-1 flex-col gap-lg">
              <Accordion.Item
                initiallyOpen
                className="gap-md"
                ariaLabel={t("checkoutFlowModal.addItem")}
                header={
                  <Title htmlVariant="h4" color="default" weight="strong">
                    {t("checkoutFlowModal.addItem")}
                  </Title>
                }
                setOpenRef={addItemCollapseSetOpenRef}
              >
                <AddItemSection
                  companyId={companyId}
                  fetch={fetch}
                  onOpenSummarySection={openSummarySection}
                />
              </Accordion.Item>

              <Accordion.Item
                className="gap-md pb-md"
                ariaLabel={t("checkoutFlowModal.summary")}
                header={<SummaryTitle />}
                headerActions={
                  <SummaryFootnoteButton
                    onAddFootnoteClick={() => {
                      track("checkout_flow_add_footnote_button_clicked", {
                        has_footnote: false,
                        footnote_length: undefined,
                        member_id: methods.getValues().member?.id,
                      });
                      setIsFootnoteModalOpen(true);
                    }}
                  />
                }
                setOpenRef={summaryCollapseSetOpenRef}
              >
                <SummarySection
                  fetch={fetch}
                  openAddItemSection={openAddItemSection}
                  isFootnoteModalOpen={isFootnoteModalOpen}
                  setIsFootnoteModalOpen={setIsFootnoteModalOpen}
                />
              </Accordion.Item>
            </Accordion>
          ) : (
            <div className="flex flex-1 gap-lg">
              <div className="flex flex-col flex-1 gap-md">
                <Title htmlVariant="h4" color="default" weight="strong">
                  {t("checkoutFlowModal.addItem")}
                </Title>
                <AddItemSection companyId={companyId} fetch={fetch} />
              </div>
              <div className="flex flex-col flex-1 gap-md">
                <SummaryTitle
                  onAddFootnoteClick={() => {
                    track("checkout_flow_add_footnote_button_clicked", {
                      has_footnote: false,
                      footnote_length: undefined,
                      member_id: methods.getValues().member?.id,
                    });
                    setIsFootnoteModalOpen(true);
                  }}
                />
                <SummarySection
                  fetch={fetch}
                  isFootnoteModalOpen={isFootnoteModalOpen}
                  setIsFootnoteModalOpen={setIsFootnoteModalOpen}
                />
              </div>
            </div>
          )}
        </div>
      </ControlledForm>

      <MemberSelectorModal
        fetch={fetch}
        isOpen={isMemberSelectorOpen}
        onClose={handleMemberSelectorClose}
        onSelect={handleMemberSelect}
        onOpenProfile={handleOpenMemberProfile}
        texts={{
          title: tCdp("memberSelectorModal.title"),
          cancel: tCdp("memberSelectorModal.cancel"),
          selectMember: tCdp("memberSelectorModal.selectMember"),
          searchPlaceholder: tCdp("memberSelectorModal.searchPlaceholder"),
          emptyState: tCdp("memberSelectorModal.emptyState"),
          emptySearch: tCdp("memberSelectorModal.emptySearch"),
          loading: tCdp("memberSelectorModal.loading"),
        }}
      />
    </CheckoutFlowTrackingProvider>
  );
};
