import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useId } from "react";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";
import { Body } from "@bsport/kaizen-primitive-core";

import { PassFormGuestBookingToggle } from "./fields/guest-booking-toggle";
import { PassFormMaximumUsage } from "./fields/maximum-usage";
import { PassFormOnDemandToggle } from "./fields/on-demand-toggle";
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
}

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
  },
  render: (args) => {
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
