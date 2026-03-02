import React, { useEffect, useId } from "react";

import type { Member } from "@bsport/api-cdp";
import type { EstablishmentBillingGroup } from "@bsport/api-core";
import type { Fetch } from "@bsport/fetch";
import { useFormContext } from "@bsport/form";
import {
  Avatar,
  Body,
  Button,
  Card,
  Icon,
  Select,
  Title,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import type { CheckoutFlowFormState } from "#src/components/core/checkout-flow-modal/schema";
import { useEstablishmentBillingGroups } from "#src/components/core/checkout-flow-modal/use-establishment-billing-groups";
import { i18nInstance, useTranslation } from "#src/i18n";

type MemberAndBillingGroupCardProps = {
  companyId: number;
  fetch: Fetch;
  member: Member | null;
  onEditClick: () => void;
  className?: string;
};

export const MemberAndBillingGroupCard: React.FC<
  MemberAndBillingGroupCardProps
> = ({ companyId, fetch, member, onEditClick, className }) => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const { watch, setValue, formState } =
    useFormContext<CheckoutFlowFormState>();
  const billingGroupSelectId = useId();
  const isBillingGroupDirty =
    formState.dirtyFields?.establishmentBillingGroupId;

  const {
    data: establishmentBillingGroups = [],
    isLoading: isBillingGroupsLoading,
  } = useEstablishmentBillingGroups(companyId, fetch);

  const showBillingGroup = (establishmentBillingGroups?.length ?? 0) > 0;

  const establishmentBillingGroupId = watch("establishmentBillingGroupId");

  useEffect(() => {
    if (establishmentBillingGroupId != null && isBillingGroupDirty) return;

    const defaultBillingGroupId =
      member?.default_establishment_billing_group ??
      (establishmentBillingGroups.length > 0
        ? establishmentBillingGroups[0].id
        : null);

    if (defaultBillingGroupId != null) {
      setValue("establishmentBillingGroupId", defaultBillingGroupId, {
        shouldDirty: false,
      });
    }
  }, [
    member?.default_establishment_billing_group,
    establishmentBillingGroupId,
    establishmentBillingGroups,
    isBillingGroupDirty,
    setValue,
  ]);

  if (!member) return null;

  const { name, first_name, last_name, email, photo } = member;
  const finalName = name ?? `${first_name ?? ""} ${last_name ?? ""}`.trim();
  const initials =
    `${first_name?.[0] ?? ""}${last_name?.[0] ?? ""}`.toUpperCase();

  return (
    <Card elevated={false} className={className}>
      <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-row items-center gap-sm min-w-0">
          <Avatar
            src={photo}
            alt={finalName}
            shape="round"
            initials={initials}
            size="md"
          />
          <div className="flex flex-col min-w-0 flex-1">
            <Title htmlVariant="h5" color="default">
              {finalName || "-"}
            </Title>
            {email && (
              <Body htmlVariant="span" color="weak" size="sm">
                {email}
              </Body>
            )}
          </div>
          <Button
            kind="icon-button"
            icon="edit-02"
            size="md"
            intent="flat"
            color="default"
            label={t("checkoutFlowModal.editMember")}
            onClick={onEditClick}
          />
        </div>
        {showBillingGroup && (
          <div className="flex gap-xs items-end w-full sm:w-auto sm:min-w-[200px]">
            <Select
              id={`billing-group-${billingGroupSelectId}`}
              fullWidth
              label={t("checkoutFlowModal.billingGroup")}
              items={establishmentBillingGroups.map(
                (bg: EstablishmentBillingGroup) => ({
                  id: String(bg.id),
                  label: bg.name,
                }),
              )}
              value={
                establishmentBillingGroupId
                  ? String(establishmentBillingGroupId)
                  : undefined
              }
              onChange={(optionId) => {
                setValue(
                  "establishmentBillingGroupId",
                  optionId ? Number(optionId) : null,
                  { shouldDirty: true },
                );
              }}
              required
              loadingProps={{
                isLoading: isBillingGroupsLoading,
                message: t("checkoutFlowModal.loadingBillingGroups"),
              }}
            />
            <Tooltip
              placement="top-right"
              label={t("checkoutFlowModal.billingGroupTooltip")}
            >
              <Icon icon="info-circle" size="sm" className="my-xs" />
            </Tooltip>
          </div>
        )}
      </div>
    </Card>
  );
};
