import React, { useMemo, useState } from "react";

import { Select } from "@bsport/kaizen-primitive-core";

import {
  applyStudioRuntimeFromStorage,
  parseStudioRuntimeEnv,
  readStudioRuntimeEnv,
  STUDIO_RUNTIME_ENVS,
  writeStudioRuntimeEnv,
} from "./runtimeConfig";

const RuntimeEnvSelector: React.FC = () => {
  const [selectedEnv, setSelectedEnv] = useState(() => readStudioRuntimeEnv());

  const runtimeEnvItems = useMemo(() => {
    return STUDIO_RUNTIME_ENVS.map((runtimeEnv) => ({
      id: runtimeEnv,
      label: runtimeEnv,
    }));
  }, []);

  const handleRuntimeEnvChange = (runtimeEnvValue: string) => {
    const nextRuntimeEnv = parseStudioRuntimeEnv(runtimeEnvValue);

    if (!nextRuntimeEnv || selectedEnv === nextRuntimeEnv) {
      return;
    }

    writeStudioRuntimeEnv(nextRuntimeEnv);
    applyStudioRuntimeFromStorage();
    setSelectedEnv(nextRuntimeEnv);
  };

  return (
    <Select
      id="runtime-env-selector"
      name="runtime-env-selector"
      label="Runtime preset"
      value={selectedEnv}
      items={runtimeEnvItems}
      onChange={(runtimeEnvValue) => {
        handleRuntimeEnvChange(runtimeEnvValue);
      }}
      helperText="Applies the selected preset to all runtime keys (some startup-initialized integrations may still require a full page reload)."
    />
  );
};

export default RuntimeEnvSelector;
