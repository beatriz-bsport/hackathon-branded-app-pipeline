import type { FC } from "react";

import { setLocalAPIEnv } from "@bsport/fetch";
import { TextField } from "@bsport/kaizen-primitive-core";

export const ApiEnvSelector: FC = () => {
  return (
    <div className="max-w-min min-w-fit">
      <TextField
        id="devtools-api-env-selector"
        placeholder="dev/staging..."
        type="text"
        label="Edit API env"
        helperText="Don't forget to logout/login to have a fresh token"
        onChange={(event) => setLocalAPIEnv(event.currentTarget.value)}
        fullWidth
      />
    </div>
  );
};
