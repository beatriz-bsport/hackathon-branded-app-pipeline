import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useId } from "react";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";
import { Body } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { tanstackQueryDevToolsDecorator } from "#src/utils/stories";

import { AppointmentPassFormCompatibleAppointmentsSelector } from "./compatible-appointments-selector";
import { AppointmentPassFormTeacherFullPaymentToggle } from "./teacher-full-payment-toggle";

const metaComponentDescription = `
This gathers Appointment Pass Form Fields.

### Business Context

These fields are designed for Appointment Pass form context:
- Appointment Pass standalone page
- Benefit creation

### How to import ?

\`\`\`tsx
import {
  AppointmentPassFormTeacherFullPaymentToggle,
  AppointmentPassFormCompatibleAppointmentsSelector,
  type AppointmentCompatibility
} from "@bsport/kaizen-business-components/buyables/appointment-pass-form";
\`\`\`
`;

const metaSourceCode = `
type AppointmentPassFormData = {
  teacherFullPayment: boolean;
  private_services: number[];
  compatibility: AppointmentCompatibility[];
}

const schema = z.object({
  teacherFullPayment: z.boolean(),
  private_services: z.array(z.number()),
  compatibility: z.array(
    z.object({
      private_service: z.number(),
      excluded_slot_ids: z.array(z.number()),
    }),
  ),
});

const methods = useFormController({
  schema,
  defaultValues: {
    teacherFullPayment: false,
    private_services: [],
    compatibility: [],
  },
});

const formId = useId();

const onSubmit = (data) => {
  // ...
}

<ControlledForm {...methods}>
  <AppointmentPassFormTeacherFullPaymentToggle<
    AppointmentPassFormData,
    "teacherFullPayment"
  >
    formId={formId}
    fieldName="teacherFullPayment"
  />
  <AppointmentPassFormCompatibleAppointmentsSelector<
    AppointmentPassFormData,
    "private_services",
    "compatibility"
  >
    id="compatible-appointments"
    fetch={fetch}
    privateServicesFieldName="private_services"
    compatibilityFieldName="compatibility"
  />
</ControlledForm>
`;

type AppointmentCompatibility = {
  private_service: number;
  excluded_slot_ids: number[];
};

type AppointmentPassFormData = {
  teacherFullPayment: boolean;
  private_services: number[];
  compatibility: AppointmentCompatibility[];
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

const meta: Meta<AppointmentPassFormData> = {
  title: "Buyables/Appointment Pass Form Fields",
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
  decorators: tanstackQueryDevToolsDecorator,
  args: {
    teacherFullPayment: false,
    private_services: [],
    compatibility: [],
  },
  render: (args) => {
    const schema = z.object({
      teacherFullPayment: z.boolean(),
      private_services: z.array(z.number()),
      compatibility: z.array(
        z.object({
          private_service: z.number(),
          excluded_slot_ids: z.array(z.number()),
        }),
      ),
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
          console.log({ formData: data });
        }}
      >
        <div className="flex flex-col gap-md">
          <LabeledFormField>
            <AppointmentPassFormTeacherFullPaymentToggle<
              AppointmentPassFormData,
              "teacherFullPayment"
            >
              fieldName="teacherFullPayment"
              formId={formId}
            />
          </LabeledFormField>

          <LabeledFormField>
            <AppointmentPassFormCompatibleAppointmentsSelector<
              AppointmentPassFormData,
              "private_services",
              "compatibility"
            >
              id="compatible-appointments"
              fetch={fetch}
              privateServicesFieldName="private_services"
              compatibilityFieldName="compatibility"
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

export const WithInitialValues: StoryObj = {
  args: {
    teacherFullPayment: true,
    private_services: [27, 11940],
    compatibility: [
      { private_service: 27, excluded_slot_ids: [] },
      { private_service: 11940, excluded_slot_ids: [21744] },
    ],
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
- @bsport/api-book
- @tanstack/react-query
        `,
      },
    },
  },
};
