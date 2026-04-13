import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useId } from "react";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";
import { Body } from "@bsport/kaizen-primitive-core";

import { PassFormGuestBookingToggle } from "./fields/guest-booking-toggle";
import { PassFormOnDemandToggle } from "./fields/on-demand-toggle";
import { PassFormTeacherPayRate } from "./fields/teacher-pay-rate";
import { PassFormTeacherPayrollToggle } from "./fields/teacher-payroll-toggle";
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
  PassFormOnDemandToggle,
  PassFormTeacherPayRate,
  PassFormTeacherPayrollToggle,
  PassFormUnlimitedCreditControl,
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
}

const schema = z.object({
  hasUnlimitedCredits: z.boolean(),
  enableOnDemand: z.boolean(),
  onlyOnDemand: z.boolean(),
  enableGuestBooking: z.boolean(),
  appliesForPayroll: z.boolean(),
  teacherPayRate: z.number(),
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
  },
});

const formId = useId();

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
</ControlledForm>
`;

type PassFormData = {
  hasUnlimitedCredits: boolean;
  enableOnDemand: boolean;
  onlyOnDemand: boolean;
  enableGuestBooking: boolean;
  appliesForPayroll: boolean;
  teacherPayRate: number;
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

const meta: Meta = {
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
  render: () => {
    const schema = z.object({
      hasUnlimitedCredits: z.boolean(),
      enableOnDemand: z.boolean(),
      onlyOnDemand: z.boolean(),
      enableGuestBooking: z.boolean(),
      appliesForPayroll: z.boolean(),
      teacherPayRate: z.number(),
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
      },
    });

    const formId = useId();

    return (
      <ControlledForm
        id={formId}
        {...methods}
        onSubmit={(data) => console.log(data)}
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
