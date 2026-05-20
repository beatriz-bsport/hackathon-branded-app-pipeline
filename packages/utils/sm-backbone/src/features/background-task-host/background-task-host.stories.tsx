import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMutation } from "@tanstack/react-query";
import { type FC, useState } from "react";

import { createSessionAPI } from "@bsport/api-book";
import { Button } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";

import { CREATE_SESSION_PAYLOAD } from "../background-task/stories-helpers";
import { BackgroundTaskHost } from "./background-task-host";
import { registerBackgroundTask } from "./register-background-task";

const metaComponentDescription = `
**BackgroundTaskHost** is a Backbone Component that owns the polling and toast lifecycle of every background task registered through \`registerBackgroundTask()\`.

### Business Context

Mount it **once** at the root of the React tree inside AppWrapper. Once a task is registered, the consumer that triggered it can unmount immediately: polling and toasts keep running until the task completes, fails, or times out.

This story registers two tasks that hit the **same backend endpoint** but are distinguished by their toast configuration, illustrating how multiple consumers can share a single host.

### How to Use

\`\`\`tsx
import { registerBackgroundTask } from "@bsport/sm-backbone";
\`\`\`
`;

const metaSourceCode = `
// In any consumer component
import { registerBackgroundTask } from "@bsport/sm-backbone";
import { fetch } from "#src/utils/fetch";

const MyComponent = () => {
  const { mutate } = useMutation({
    mutationFn: () => createSessionAPI(fetch, payload),
    onSuccess: (uuid) => {
      if (!uuid) return;
      registerBackgroundTask({
        uuid,
        fetch, // Optional - Better for tracking which app makes the call
        processingToast: { title: "Creating class series..." },
        successToast: { title: "Class series created!" },
        errorToast: { title: "Failed to create class series" },
      });
    },
  });

  return <Button onClick={() => mutate()} label="Create class series" />;
};
`;

type ConsumerProps = {
  label: string;
  registerTask: (uuid: string) => void;
};

const TaskTriggerButton: FC<ConsumerProps> = ({ label, registerTask }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: () => createSessionAPI(fetch, CREATE_SESSION_PAYLOAD),
    onSuccess: (uuid) => {
      if (uuid) {
        registerTask(uuid);
      }
    },
  });

  return (
    <Button
      onClick={() => mutate()}
      color="main"
      intent="call-to-action"
      label={label}
      size="md"
      loading={isPending}
    />
  );
};

type StoryArgs = {
  fetch: typeof fetch;
};

const meta: Meta<StoryArgs> = {
  title: "Background Task/BackgroundTaskHost",
  component: BackgroundTaskHost,
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
  args: {
    fetch,
  },
  render: () => {
    const [showConsumers, setShowConsumers] = useState(true);

    return (
      <div className="flex flex-col gap-md items-center">
        <BackgroundTaskHost />

        {showConsumers && (
          <div className="flex flex-col gap-sm items-center">
            <TaskTriggerButton
              label="Create class series"
              registerTask={(uuid) =>
                registerBackgroundTask({
                  uuid,
                  processingToast: {
                    title: "Creating class series...",
                    icon: "calendar",
                  },
                  successToast: {
                    title: "Class series created successfully!",
                    icon: "calendar",
                  },
                  errorToast: { title: "Failed to create class series" },
                  timeoutToast: {
                    title: "Class series creation is taking longer than usual",
                  },
                })
              }
            />
            <TaskTriggerButton
              label="Create event"
              registerTask={(uuid) =>
                registerBackgroundTask({
                  uuid,
                  processingToast: {
                    title: "Creating positive event...",
                    icon: "atom-02",
                    status: "positive",
                  },
                  successToast: {
                    title: "Event created successfully!",
                    icon: "check-circle-solid",
                    status: "positive",
                  },
                  errorToast: {
                    title: "Failed to create event",
                    status: "positive",
                  },
                  timeoutToast: {
                    title: "Event creation is taking longer than usual",
                  },
                })
              }
            />
          </div>
        )}

        <Button
          onClick={() => setShowConsumers((value) => !value)}
          color="main"
          intent="default"
          label={showConsumers ? "Unmount consumers" : "Mount consumers"}
          size="sm"
        />
        <i>
          Unmount the consumers after triggering a task — toasts and polling
          keep running thanks to the host.
        </i>
      </div>
    );
  },
};

export default meta;

export const Default: StoryObj<StoryArgs> = {};

export const Documentation: StoryObj<StoryArgs> = {
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
