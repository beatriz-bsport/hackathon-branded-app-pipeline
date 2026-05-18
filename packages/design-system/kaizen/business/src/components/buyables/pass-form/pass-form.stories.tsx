import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useId } from "react";
import { z } from "zod";

import { PENALTY_KINDS, type PenaltyKind } from "@bsport/api-buyables";
import { ControlledForm, useFormController } from "@bsport/form";
import { Body } from "@bsport/kaizen-primitive-core";

import { PassFormGuestBookingToggle } from "./fields/guest-booking-toggle";
import { PassFormMaximumUsage } from "./fields/maximum-usage";
import { PassFormOnDemandToggle } from "./fields/on-demand-toggle";
import { PassFormPenaltySelector } from "./fields/penalty-selector";
import { PassFormTeacherPayRate } from "./fields/teacher-pay-rate";
import { PassFormTeacherPayrollToggle } from "./fields/teacher-payroll-toggle";
import {
  PassFormTimePeriodsSelector,
  type TimePeriodSchedule,
  convertBackendToFormTimeRestrictions,
  convertFormToBackendTimeRestrictions,
} from "./fields/time-periods-selector";
import { PassFormUnlimitedCreditControl } from "./fields/unlimited-credit-control";

const metaComponentDescription = `
This gathers Pass Form Fields.

### Business Context

These fields are designed for Pass form context:
- Pass standalone page
- Benefit creation

### How to import ?

\`\`\`tsx
import {
  PassFormGuestBookingToggle,
  PassFormMaximumUsage,
  PassFormOnDemandToggle,
  PassFormTeacherPayRate,
  PassFormTeacherPayrollToggle,
  PassFormTimePeriodsSelector,
  PassFormUnlimitedCreditControl,
  PassFormPenaltySelector,
  convertBackendToFormTimeRestrictions,
  convertFormToBackendTimeRestrictions,
  type TimePeriodSchedule
} from "@bsport/kaizen-business-components/buyables/pass-form";
\`\`\`
`;

const metaSourceCode = `
type PassFormData = {
  hasUnlimitedCredits: boolean;
  enableOnDemand: boolean;
  onlyOnDemand: boolean;
  enableGuestBooking: boolean;
  appliesForPayroll: boolean;
  teacherPayRate: number;
  // maximum usage
  hasMaximumUsage: boolean;
  maxBookingsPerDay: number | null;
  maxBookingsPerWeek: number | null;
  maxBookingsPerMonth: number | null;
  maxPurchasePerMember: number | null;
  // time restrictions
  hasTimeRestrictions: boolean;
  timePeriods: TimePeriodSchedule[];
  // penalty
  apply_penalties: boolean;
  penalty_active: boolean;
  penalty_nb_late_cancellations: number;
  penalty_nb_days: number;
  penalty_kind: number;
  penalty_days_blocked: number;
  penalty_account_value: number;
  no_show_penalty_active: boolean;
  no_show_penalty_threshold: number;
  no_show_penalty_time_window_days: number;
  no_show_penalty_kind: number;
  no_show_penalty_days_blocked: number;
  no_show_penalty_amount: number;
}

const penaltyKind = z.union([
  z.literal(PENALTY_KINDS.BLOCK_PASS),
  z.literal(PENALTY_KINDS.CHARGE_ACCOUNT),
]);

const schema = z.object({
  hasUnlimitedCredits: z.boolean(),
  enableOnDemand: z.boolean(),
  onlyOnDemand: z.boolean(),
  enableGuestBooking: z.boolean(),
  appliesForPayroll: z.boolean(),
  teacherPayRate: z.number(),
  // maximum usage
  hasMaximumUsage: z.boolean(),
  maxBookingsPerDay: z.number().nullable(),
  maxBookingsPerWeek: z.number().nullable(),
  maxBookingsPerMonth: z.number().nullable(),
  maxPurchasePerMember: z.number().nullable(),
  // time restrictions
  hasTimeRestrictions: z.boolean(),
  timePeriods: z.array(z.custom<TimePeriodSchedule>()),
  // penalty
  apply_penalties: z.boolean(),
  penalty_active: z.boolean(),
  penalty_nb_late_cancellations: z.number(),
  penalty_nb_days: z.number(),
  penalty_kind: penaltyKind,
  penalty_days_blocked: z.number(),
  penalty_account_value: z.number(),
  no_show_penalty_active: z.boolean(),
  no_show_penalty_threshold: z.number(),
  no_show_penalty_time_window_days: z.number(),
  no_show_penalty_kind: penaltyKind,
  no_show_penalty_days_blocked: z.number(),
  no_show_penalty_amount: z.number(),
});

const methods = useFormController({
  schema,
  defaultValues: {
    hasUnlimitedCredits: false,
    enableOnDemand: false,
    onlyOnDemand: false,
    enableGuestBooking: false,
    appliesForPayroll: false,
    teacherPayRate: 0,
    // maximum usage
    hasMaximumUsage: false,
    maxBookingsPerDay: null,
    maxBookingsPerWeek: null,
    maxBookingsPerMonth: null,
    maxPurchasePerMember: null,
    // time restrictions
    hasTimeRestrictions: false,
    timePeriods: convertBackendToFormTimeRestrictions(off_peak_schedule),
    // penalty
    apply_penalties: false,
    penalty_active: false,
    penalty_nb_late_cancellations: 0,
    penalty_nb_days: 0,
    penalty_kind: PENALTY_KINDS.BLOCK_PASS,
    penalty_days_blocked: 0,
    penalty_account_value: 0,
    no_show_penalty_active: false,
    no_show_penalty_threshold: 0,
    no_show_penalty_time_window_days: 0,
    no_show_penalty_kind: PENALTY_KINDS.BLOCK_PASS,
    no_show_penalty_days_blocked: 0,
    no_show_penalty_amount: 0,
  },
});

const formId = useId();

const onSubmit = (data) => {
  // ...
  const off_peak_schedule = convertFormToBackendTimeRestrictions(data.timePeriods)
}

<ControlledForm {...methods}>
  <PassFormUnlimitedCreditControl<PassFormData, "hasUnlimitedCredits">
    formId={formId}
    fieldName="hasUnlimitedCredits"
    />
  <PassFormOnDemandToggle<PassFormData, "enableOnDemand" | "onlyOnDemand">
    enableFieldName="enableOnDemand"
    restrictFieldName="onlyOnDemand"
    formId={formId}
  />
  <PassFormGuestBookingToggle<PassFormData, "enableGuestBooking">
    formId={formId}
    fieldName="enableGuestBooking"
    />
  <PassFormTeacherPayrollToggle<PassFormData, "appliesForPayroll">
    formId={formId}
    fieldName="appliesForPayroll"
    />
  <PassFormTeacherPayRate<PassFormData, "teacherPayRate">
    formId={formId}
    fieldName="teacherPayRate"
    />
  <PassFormMaximumUsage<
    PassFormData,
    "hasMaximumUsage",
    | "maxBookingsPerDay"
    | "maxBookingsPerWeek"
    | "maxBookingsPerMonth"
    | "maxPurchasePerMember"
  >
    formId={formId}
    hasMaximumUsageFieldName="hasMaximumUsage"
    maximumPerDayFieldName="maxBookingsPerDay"
    maximumPerWeekFieldName="maxBookingsPerWeek"
    maximumPerMonthFieldName="maxBookingsPerMonth"
    maximumPerMemberFieldName="maxPurchasePerMember"
  />
  <PassFormTimePeriodsSelector<
    PassFormData,
    "hasTimeRestrictions",
    "timePeriods"
  >
    enableFieldName="hasTimeRestrictions"
    timePeriodsFieldName="timePeriods"
    formId={formId}
  />
  <PassFormPenaltySelector<
    PassFormData,
    "apply_penalties",
    "penalty_active" | "no_show_penalty_active",
    | "penalty_nb_late_cancellations"
    | "penalty_nb_days"
    | "penalty_kind"
    | "penalty_days_blocked"
    | "no_show_penalty_threshold"
    | "no_show_penalty_time_window_days"
    | "no_show_penalty_kind"
    | "no_show_penalty_days_blocked"
    | "penalty_account_value"
    | "no_show_penalty_amount"
  >
    formId={formId}
    applyPenaltyFieldName="apply_penalties"
    lateCancellationActiveFieldName="penalty_active"
    lateCancellationThresholdFieldName="penalty_nb_late_cancellations"
    lateCancellationWindowDaysFieldName="penalty_nb_days"
    lateCancellationKindFieldName="penalty_kind"
    lateCancellationBlockedDaysFieldName="penalty_days_blocked"
    lateCancellationChargedAmountFieldName="penalty_account_value"
    noShowActiveFieldName="no_show_penalty_active"
    noShowThresholdFieldName="no_show_penalty_threshold"
    noShowTimeWindowDaysFieldName="no_show_penalty_time_window_days"
    noShowKindFieldName="no_show_penalty_kind"
    noShowBlockedDaysFieldName="no_show_penalty_days_blocked"
    noShowChargedAmountFieldName="no_show_penalty_amount"
    noShowSettingsHref="#settings-personalisation"
  />
</ControlledForm>
`;

type PassFormData = {
  hasUnlimitedCredits: boolean;
  enableOnDemand: boolean;
  onlyOnDemand: boolean;
  enableGuestBooking: boolean;
  appliesForPayroll: boolean;
  teacherPayRate: number;
  // maximum usage
  hasMaximumUsage: boolean;
  maxBookingsPerDay: number | null;
  maxBookingsPerWeek: number | null;
  maxBookingsPerMonth: number | null;
  maxPurchasePerMember: number | null;
  // time restrictions
  hasTimeRestrictions: boolean;
  timePeriods: TimePeriodSchedule[];
  // penalty
  apply_penalties: boolean;
  penalty_active: boolean;
  penalty_nb_late_cancellations: number;
  penalty_nb_days: number;
  penalty_kind: PenaltyKind;
  penalty_days_blocked: number;
  penalty_account_value: number;
  no_show_penalty_active: boolean;
  no_show_penalty_threshold: number;
  no_show_penalty_time_window_days: number;
  no_show_penalty_kind: PenaltyKind;
  no_show_penalty_days_blocked: number;
  no_show_penalty_amount: number;
};

const LabeledFormField = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Body weight="strong" size="sm" className="mb-xs">
        {/** @ts-expect-error Storybook helper */}
        {children?.type?.displayName}
      </Body>
      {children}
    </div>
  );
};

const meta: Meta<PassFormData> = {
  title: "Buyables/Pass Form Fields",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: metaComponentDescription,
      },
      source: {
        code: metaSourceCode,
      },
    },
  },
  argTypes: {},
  tags: ["autodocs"],
  args: {
    hasUnlimitedCredits: false,
    enableOnDemand: false,
    onlyOnDemand: false,
    enableGuestBooking: false,
    appliesForPayroll: false,
    teacherPayRate: 0,
    // maximum usage
    hasMaximumUsage: false,
    maxBookingsPerDay: null,
    maxBookingsPerWeek: null,
    maxBookingsPerMonth: null,
    maxPurchasePerMember: null,
    // time restrictions
    hasTimeRestrictions: false,
    timePeriods: [],
    // penalty
    apply_penalties: false,
    penalty_active: false,
    penalty_nb_late_cancellations: 0,
    penalty_nb_days: 0,
    penalty_kind: PENALTY_KINDS.BLOCK_PASS,
    penalty_days_blocked: 0,
    penalty_account_value: 0,
    no_show_penalty_active: false,
    no_show_penalty_threshold: 0,
    no_show_penalty_time_window_days: 0,
    no_show_penalty_kind: PENALTY_KINDS.BLOCK_PASS,
    no_show_penalty_days_blocked: 0,
    no_show_penalty_amount: 0,
  },
  render: (args) => {
    const penaltyKind = z.union([
      z.literal(PENALTY_KINDS.BLOCK_PASS),
      z.literal(PENALTY_KINDS.CHARGE_ACCOUNT),
    ]);
    const schema = z.object({
      hasUnlimitedCredits: z.boolean(),
      enableOnDemand: z.boolean(),
      onlyOnDemand: z.boolean(),
      enableGuestBooking: z.boolean(),
      appliesForPayroll: z.boolean(),
      teacherPayRate: z.number(),
      // maximum usage
      hasMaximumUsage: z.boolean(),
      maxBookingsPerDay: z.number().nullable(),
      maxBookingsPerWeek: z.number().nullable(),
      maxBookingsPerMonth: z.number().nullable(),
      maxPurchasePerMember: z.number().nullable(),
      // time restrictions
      hasTimeRestrictions: z.boolean(),
      timePeriods: z.array(z.custom<TimePeriodSchedule>()),
      // penalty
      apply_penalties: z.boolean(),
      penalty_active: z.boolean(),
      penalty_nb_late_cancellations: z.number(),
      penalty_nb_days: z.number(),
      penalty_kind: penaltyKind,
      penalty_days_blocked: z.number(),
      penalty_account_value: z.number(),
      no_show_penalty_active: z.boolean(),
      no_show_penalty_threshold: z.number(),
      no_show_penalty_time_window_days: z.number(),
      no_show_penalty_kind: penaltyKind,
      no_show_penalty_days_blocked: z.number(),
      no_show_penalty_amount: z.number(),
    });

    const methods = useFormController({
      schema,
      defaultValues: args,
    });

    const formId = useId();

    return (
      <ControlledForm
        id={formId}
        {...methods}
        onSubmit={(data) => {
          const restrictionsBackendData = convertFormToBackendTimeRestrictions(
            data.timePeriods,
          );
          console.log({ formData: data, restrictionsBackendData });
        }}
      >
        <div className="flex flex-col gap-md">
          <LabeledFormField>
            <PassFormUnlimitedCreditControl<PassFormData, "hasUnlimitedCredits">
              fieldName="hasUnlimitedCredits"
              formId={formId}
            />
          </LabeledFormField>

          <LabeledFormField>
            <PassFormOnDemandToggle<
              PassFormData,
              "enableOnDemand" | "onlyOnDemand"
            >
              enableFieldName="enableOnDemand"
              restrictFieldName="onlyOnDemand"
              formId={formId}
            />
          </LabeledFormField>

          <LabeledFormField>
            <PassFormGuestBookingToggle<PassFormData, "enableGuestBooking">
              fieldName="enableGuestBooking"
              formId={formId}
            />
          </LabeledFormField>

          <LabeledFormField>
            <PassFormTeacherPayrollToggle<PassFormData, "appliesForPayroll">
              fieldName="appliesForPayroll"
              formId={formId}
            />
          </LabeledFormField>

          <LabeledFormField>
            <PassFormTeacherPayRate<PassFormData, "teacherPayRate">
              fieldName="teacherPayRate"
              formId={formId}
              required
            />
          </LabeledFormField>

          <LabeledFormField>
            <PassFormMaximumUsage<
              PassFormData,
              "hasMaximumUsage",
              | "maxBookingsPerDay"
              | "maxBookingsPerWeek"
              | "maxBookingsPerMonth"
              | "maxPurchasePerMember"
            >
              formId={formId}
              hasMaximumUsageFieldName="hasMaximumUsage"
              maximumPerDayFieldName="maxBookingsPerDay"
              maximumPerWeekFieldName="maxBookingsPerWeek"
              maximumPerMonthFieldName="maxBookingsPerMonth"
              maximumPerMemberFieldName="maxPurchasePerMember"
            />
          </LabeledFormField>

          <LabeledFormField>
            <PassFormTimePeriodsSelector<
              PassFormData,
              "hasTimeRestrictions",
              "timePeriods"
            >
              enableFieldName="hasTimeRestrictions"
              timePeriodsFieldName="timePeriods"
              formId={formId}
            />
          </LabeledFormField>

          <LabeledFormField>
            <PassFormPenaltySelector<
              PassFormData,
              "apply_penalties",
              "penalty_active" | "no_show_penalty_active",
              | "penalty_nb_late_cancellations"
              | "penalty_nb_days"
              | "penalty_kind"
              | "penalty_days_blocked"
              | "no_show_penalty_threshold"
              | "no_show_penalty_time_window_days"
              | "no_show_penalty_kind"
              | "no_show_penalty_days_blocked"
              | "penalty_account_value"
              | "no_show_penalty_amount"
            >
              formId={formId}
              applyPenaltyFieldName="apply_penalties"
              lateCancellationActiveFieldName="penalty_active"
              lateCancellationThresholdFieldName="penalty_nb_late_cancellations"
              lateCancellationWindowDaysFieldName="penalty_nb_days"
              lateCancellationKindFieldName="penalty_kind"
              lateCancellationBlockedDaysFieldName="penalty_days_blocked"
              lateCancellationChargedAmountFieldName="penalty_account_value"
              noShowActiveFieldName="no_show_penalty_active"
              noShowThresholdFieldName="no_show_penalty_threshold"
              noShowTimeWindowDaysFieldName="no_show_penalty_time_window_days"
              noShowKindFieldName="no_show_penalty_kind"
              noShowBlockedDaysFieldName="no_show_penalty_days_blocked"
              noShowChargedAmountFieldName="no_show_penalty_amount"
              noShowSettingsHref="#settings-personalisation"
            />
          </LabeledFormField>

          <hr className="mt-md" />
          <button form={formId} type="submit">
            Console log results
          </button>
        </div>
      </ControlledForm>
    );
  },
};

export default meta;

// Default - Inherit configuration from the meta object
// Goal: Manipulate and see the story.
export const Default: StoryObj = {};

export const WithInitialValues: StoryObj = {
  args: {
    hasUnlimitedCredits: true,
    enableOnDemand: true,
    onlyOnDemand: true,
    enableGuestBooking: true,
    appliesForPayroll: true,
    teacherPayRate: 10,
    // maximum usage
    hasMaximumUsage: true,
    maxBookingsPerDay: 2,
    maxBookingsPerWeek: 8,
    maxBookingsPerMonth: 32,
    maxPurchasePerMember: 5,
    // time restrictions
    hasTimeRestrictions: true,
    timePeriods: convertBackendToFormTimeRestrictions({
      "1": [["00:30", "01:30"]],
      "2": [
        ["00:30", "01:30"],
        ["11:00", "12:30"],
      ],
      "3": [
        ["00:30", "01:30"],
        ["11:00", "12:30"],
      ],
      "4": [["00:00", "23:59"]],
      "6": [["00:00", "23:59"]],
    }),
    // penalty
    apply_penalties: true,
    penalty_active: true,
    penalty_nb_late_cancellations: 3,
    penalty_nb_days: 30,
    penalty_kind: PENALTY_KINDS.BLOCK_PASS,
    penalty_days_blocked: 7,
    penalty_account_value: 10,
    no_show_penalty_active: true,
    no_show_penalty_threshold: 2,
    no_show_penalty_time_window_days: 30,
    no_show_penalty_kind: PENALTY_KINDS.CHARGE_ACCOUNT,
    no_show_penalty_days_blocked: 14,
    no_show_penalty_amount: 20.5,
  },
};

// Documentation - Inherit configuration from the meta object
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: `
### Requirements

- @bsport/kaizen-primitive-core
- @bsport/form
        `,
      },
    },
  },
};
