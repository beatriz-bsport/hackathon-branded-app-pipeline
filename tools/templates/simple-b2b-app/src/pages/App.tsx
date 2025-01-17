import { useState } from "react";
import {
  ThemeProvider,
  Button,
  Title,
  Body,
} from "@bsport/kaizen-primitive-core";

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider>
      <div className="p-md">
        <Title htmlVariant="h1" color="critical">
          Simple b2b application
        </Title>
        <div className="flex flex-col gap-md">
          <Button
            onClick={() => setCount((count) => count + 1)}
            color="main"
            intent="call-to-action"
            size="md"
            iconLeft="arrow-right"
            label={`count is ${count}`}
            className="w-fit"
          />
          <Body htmlVariant="p">
            Edit <code>src/App.tsx</code> and save to test HMR
          </Body>
          <Body htmlVariant="p">
            Use our custom tailwind classes to edit style
          </Body>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
