import type { Meta } from "@storybook/react-vite";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type Decorators = Meta["decorators"];

export const tanstackQueryDevToolsDecorator: Decorators = [
  (Story) => (
    <>
      <ReactQueryDevtools initialIsOpen={false} />
      <div
        aria-label="story-container-to-not-span-react-query-devtools"
        className="mr-[60px]"
      >
        <Story />
      </div>
    </>
  ),
];
