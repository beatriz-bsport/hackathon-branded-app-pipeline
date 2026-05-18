import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  type SessionCreationPayload,
  createSessionAPI,
} from "@bsport/api-book";
import { Button } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";

import { useBackgroundTask } from "./use-background-task";

const metaComponentDescription = `
**useBackgroundTask** is a Business Hook that handles polling for background tasks and displays appropriate toast notifications.

### Business Context

This hook is designed for workflows where users trigger asynchronous background tasks (e.g., session creation, data processing) and need to:

- Poll the task status until completion
- Display loading, success, error, or timeout toasts
- Customize toast messages for specific use cases

### How to Import

\`\`\`tsx
import { useBackgroundTask } from "@bsport/kaizen-business-components/platform/background-task";
\`\`\`
`;

const metaSourceCode = `
import { useBackgroundTask } from "@bsport/kaizen-business-components/platform/background-task";
import { fetch } from "#src/utils/fetch";

const MyComponent = () => {
  const { mutate: createSession, data: uuid } = useSomethingQueryOrMutation();

  const query = useBackgroundTask({
    fetch,
    uuid: uuid ?? null,
    processingToast: { label :"Creating session..." },
    successToast: { label :"Session created successfully!" },
    errorToast: { label :"Failed to create sessions" },
    onSuccess: () => {},
    ...
  });

  return <Button onClick={createSession}>Create Session</Button>;
};
`;

const generateDates = () => {
  const timestamp = Date.now() / 1000;
  return Array(30)
    .fill(1)
    .map((_, index) => timestamp + (index + 1) * 24 * 60 * 60);
};

const CREATE_SESSION_PAYLOAD = {
  name_override: "",
  description_override: "",
  manager_only: true,
  credits: 1,
  waiting_list_max_size: 5,
  effectif: 8,
  available_on_partnership: true,
  partner_max_booking_count: null,
  partner_spot_capping_strategy: "UNLIMITED",
  partnership_offers: [
    {
      partnership: 5,
      partnership_identifier: "wellhub",
      allowed_on_partner: true,
      spot_limit: null,
    },
    {
      partnership: 4,
      partnership_identifier: "usc",
      allowed_on_partner: true,
      spot_limit: null,
    },
    {
      partnership: 11,
      partnership_identifier: "myclubs",
      allowed_on_partner: true,
      spot_limit: null,
    },
  ],
  duration_minute: 60,
  level: 1,
  is_hybrid: false,
  coach: 156,
  coach_payment_rule: null,
  broadcast_link: "",
  establishment: 29,
  room_blueprint: 65,
  meta_activity: 8,
  dates: generateDates(),
  wellhub_product_id: 735612,
  allow_guest_offer: true,
  blacklist_tags: [],
  whitelist_tags: [],
} as SessionCreationPayload;

type UseBackgroundTaskComponent = Parameters<typeof useBackgroundTask>[0];

const meta: Meta<UseBackgroundTaskComponent> = {
  title: "Platform/use-background-task",
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
  tags: ["autodocs"],
  render: (args) => {
    const [anotherState, setAnotherState] = useState(1);
    const { mutate, data } = useMutation({
      mutationFn: () => createSessionAPI(fetch, CREATE_SESSION_PAYLOAD),
    });

    const query = useBackgroundTask({
      ...args,
      onSuccess: () => args.onSuccess?.(), // Recomputed on every render => validation
      uuid: data ?? null,
    });

    const { isError, error } = query;

    // Additionally, consumers can implement custom effect on error
    useEffect(() => {
      if (isError) {
        console.error(error);
      }
    }, [isError, error]);

    return (
      <div className="flex flex-col gap-sm items-center">
        <Button
          onClick={() => mutate()}
          color="main"
          intent="call-to-action"
          label="Create Session"
          size="md"
        />
        <Button
          onClick={() => setAnotherState((count) => count + 1)}
          color="main"
          intent="call-to-action"
          label={`Counter (${anotherState})`}
          size="md"
        />
        <i>
          This is to validate that toasts are not retrigger when another state
          is updated
        </i>
      </div>
    );
  },
  args: {
    fetch,
    processingToast: { label: "Creating session..." },
    successToast: { label: "20 classes created successfully!" },
    errorToast: { label: "Failed to create sessions" },
    timeoutToast: {
      label: "Session creation took long, you may want to reload page",
    },
    onSuccess: () => console.log("Session created!"),
    onError: () => console.error("Session not created"),
    onTimeout: () => console.log("Timeout reached"),
    maxRefetchDuration: undefined,
  },
};

export default meta;

// Default - Inherit configuration from the meta object
export const SuccessExample: StoryObj<UseBackgroundTaskComponent> = {};

export const TimeoutExample: StoryObj<UseBackgroundTaskComponent> = {
  args: {
    maxRefetchDuration: 1,
  },
};

export const CustomToastsExample: StoryObj<UseBackgroundTaskComponent> = {
  args: {
    processingToast: {
      icon: "atom-02",
      color: "critical",
      onClick: () => alert("Hello world !"),
    },
  },
};

// Documentation - Inherit configuration from the meta object
export const Documentation: StoryObj<UseBackgroundTaskComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Requirements

- @tanstack/react-query
- @bsport/fetch
- @bsport/kaizen-primitive-core
        `,
      },
    },
  },
};
