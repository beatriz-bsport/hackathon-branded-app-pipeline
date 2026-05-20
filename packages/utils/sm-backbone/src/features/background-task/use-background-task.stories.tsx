import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { createSessionAPI } from "@bsport/api-book";
import { Button } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";

import { CREATE_SESSION_PAYLOAD } from "./stories-helpers";
import { useBackgroundTask } from "./use-background-task";

const metaComponentDescription = `
**useBackgroundTask** is a Backbone Hook that handles polling for background tasks and displays appropriate toast notifications.

**It is used internally by BackgroundTaskHost and is not supposed to be adopted elsewhere.**

### Business Context

This hook is designed for workflows where users trigger asynchronous background tasks (e.g., session creation, data processing) and need to:

- Poll the task status until completion
- Display loading, success, error, or timeout toasts
- Customize toast messages for specific use cases

`;

const metaSourceCode = `
import { fetch } from "#src/utils/fetch";

const MyComponent = () => {
  const { mutate: createSession, data: uuid } = useSomethingQueryOrMutation();

  const query = useBackgroundTask({
    fetch,
    uuid: uuid ?? null,
    processingToast: { title :"Creating session..." },
    successToast: { title :"Session created successfully!" },
    errorToast: { title :"Failed to create sessions" },
    onSuccess: () => {},
    ...
  });

  return <Button onClick={createSession}>Create Session</Button>;
};
`;

type UseBackgroundTaskComponent = Parameters<typeof useBackgroundTask>[0];

const meta: Meta<UseBackgroundTaskComponent> = {
  title: "Background Task/use-background-task",
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
    processingToast: { title: "Creating session..." },
    successToast: { title: "20 classes created successfully!" },
    errorToast: { title: "Failed to create sessions" },
    timeoutToast: {
      title: "Session creation took long, you may want to reload page",
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
