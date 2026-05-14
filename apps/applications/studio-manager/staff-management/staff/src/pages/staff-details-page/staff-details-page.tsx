import { type FC, useEffect, useId, useMemo, useState } from "react";
import { Link } from "react-router";

import type { UserRole } from "@bsport/api-staff-management/role";
import { RoleType } from "@bsport/common/lib/master-data/user-role";
import { ControlledForm, useFormController } from "@bsport/form";
import {
  Breadcrumbs,
  DetailsLayout,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { StaffFormCommission } from "#src/features/staff-form/components/staff-form-commission";
import { StaffFormEmail } from "#src/features/staff-form/components/staff-form-email";
import { StaffFormFirstName } from "#src/features/staff-form/components/staff-form-first-name";
import { StaffFormLastName } from "#src/features/staff-form/components/staff-form-last-name";
import { StaffFormRole } from "#src/features/staff-form/components/staff-form-role";
import { useStaffFormSchema } from "#src/features/staff-form/schema";
import type {
  StaffFormData,
  StaffFormSchema,
} from "#src/features/staff-form/types";
import {
  transformStaffUpdateFormData,
  useUpdateStaff,
} from "#src/features/staff-form/use-update-staff";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type StaffDetailsPageProps = {
  staff: UserRole;
};

const parseCommissionPercentage = (value: string): number => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const convertStaffIntoFormData = (staff: UserRole): StaffFormData => ({
  firstName: staff.first_name,
  lastName: staff.last_name,
  email: staff.email,
  password: "",
  commissionPercentage: parseCommissionPercentage(
    staff.staff_commission_percentage,
  ),
  role: staff.role === null ? "" : String(staff.role),
  coachesInRoleIds: staff.coaches_selected_in_role.map(String),
  staffEstablishmentBillingGroup:
    staff.staff_establishment_billing_group === null
      ? ""
      : String(staff.staff_establishment_billing_group),
});

const StaffDetailsPage: FC<StaffDetailsPageProps> = ({ staff }) => {
  const [discardId, setDiscardId] = useState(0);
  const { detailsLayoutProps, toggleHasUnsavedChanges } = useDetailsLayout();
  const { t } = useTranslation("staff-list");
  const { t: tDetails } = useTranslation("staff-details");
  const formId = `staff-details-${useId()}`;
  // Uses the persisted API role, not the live form value, so an owner cannot
  // be reassigned to a different role even if the select is somehow interacted with.
  const isOwner = staff.role === RoleType.USER_ROLE_NO_RESTRICTION;
  const staffFormSchema = useStaffFormSchema({ isEditMode: true });
  const defaultValues = useMemo(() => convertStaffIntoFormData(staff), [staff]);
  const { updateStaff, isLoading: isUpdating } = useUpdateStaff();

  const { endGroupActions, startGroupActions } =
    DetailsLayout.useAdaptiveActions({ startGroupActions: [] });

  const methods = useFormController<StaffFormSchema>({
    mode: "onChange",
    schema: staffFormSchema,
    defaultValues,
    criteriaMode: "all",
  });

  const pageTitle =
    `${staff.first_name} ${staff.last_name}`.trim() || staff.email;

  const BreadcrumbsItems = [
    <Link key="to-staff-list" to={URLS.INDEX}>
      <Breadcrumbs.Item text={t("name")} />
    </Link>,
  ];

  const handleDiscardChanges = () => {
    if (isUpdating) {
      return;
    }

    methods.reset();
    setDiscardId((self) => self + 1);
  };

  const handleSaveChanges = async () => {
    const ok = await methods.trigger();

    if (!ok || isUpdating) {
      console.warn("[Staff Form] Invalid", {
        errors: methods.formState.errors,
      });
      return;
    }

    const data = transformStaffUpdateFormData(
      methods.getValues(),
      methods.formState.dirtyFields,
    );

    if (isOwner) {
      delete data.role;
    }

    if (Object.keys(data).length === 0) {
      return;
    }

    updateStaff(
      { id: staff.id, data },
      {
        onSuccess: (updatedStaff) => {
          methods.reset(convertStaffIntoFormData(updatedStaff));
        },
      },
    );
  };

  const isDirty = methods.formState.isDirty;

  useEffect(() => {
    toggleHasUnsavedChanges(isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  return (
    <ControlledForm {...methods} onSubmit={handleSaveChanges} id={formId}>
      <DetailsLayout {...detailsLayoutProps}>
        <DetailsLayout.Header
          pageTitle={pageTitle}
          BreadcrumbsItems={BreadcrumbsItems}
          endGroupActions={endGroupActions}
          startGroupActions={startGroupActions}
        />

        <DetailsLayout.Content>
          <div key={discardId} className="flex flex-col gap-md w-full">
            <StaffFormFirstName formId={formId} disabled />
            <StaffFormLastName formId={formId} disabled />
            <StaffFormEmail formId={formId} disabled />
            <StaffFormCommission formId={formId} />
            <StaffFormRole
              formId={formId}
              disabled={isOwner}
              helperText={isOwner ? tDetails("ownerRoleProtected") : undefined}
            />
          </div>
        </DetailsLayout.Content>

        <DetailsLayout.Confirmation
          onDiscard={handleDiscardChanges}
          onSave={handleSaveChanges}
        />
      </DetailsLayout>
    </ControlledForm>
  );
};

export default StaffDetailsPage;
