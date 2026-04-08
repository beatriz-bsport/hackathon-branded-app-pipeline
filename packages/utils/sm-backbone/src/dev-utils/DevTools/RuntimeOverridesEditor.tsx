import React, { useEffect, useMemo, useState } from "react";

import { Button, Select } from "@bsport/kaizen-primitive-core";

import {
  STUDIO_RUNTIME_ENVS,
  STUDIO_RUNTIME_UPDATED_EVENT,
  applyStudioRuntimeFromStorage,
  clearStudioRuntimeFieldEnvMap,
  getStudioRuntimeVariableKeys,
  parseStudioRuntimeEnv,
  readStudioRuntimeFieldEnvMap,
  writeStudioRuntimeFieldEnvMap,
} from "./runtimeConfig";

const INHERIT_RUNTIME_PRESET_VALUE = "__all__";

const RuntimeOverridesEditor: React.FC = () => {
  const [runtimeVariableKeys, setRuntimeVariableKeys] = useState<string[]>(() =>
    getStudioRuntimeVariableKeys(),
  );
  const [runtimeFieldEnvMap, setRuntimeFieldEnvMap] = useState(() =>
    readStudioRuntimeFieldEnvMap(),
  );

  useEffect(() => {
    const syncRuntimeConfigState = () => {
      setRuntimeVariableKeys(getStudioRuntimeVariableKeys());
      setRuntimeFieldEnvMap(readStudioRuntimeFieldEnvMap());
    };

    window.addEventListener(
      STUDIO_RUNTIME_UPDATED_EVENT,
      syncRuntimeConfigState as EventListener,
    );

    return () => {
      window.removeEventListener(
        STUDIO_RUNTIME_UPDATED_EVENT,
        syncRuntimeConfigState as EventListener,
      );
    };
  }, []);

  const runtimeEnvItems = useMemo(() => {
    return STUDIO_RUNTIME_ENVS.map((runtimeEnv) => ({
      id: runtimeEnv,
      label: runtimeEnv,
    }));
  }, []);

  const fieldRuntimeEnvItems = useMemo(() => {
    return [
      {
        id: INHERIT_RUNTIME_PRESET_VALUE,
        label: "Preset",
      },
      ...runtimeEnvItems,
    ];
  }, [runtimeEnvItems]);

  const handleRuntimeFieldEnvChange = ({
    runtimeKey,
    runtimeEnvValue,
  }: {
    runtimeKey: string;
    runtimeEnvValue: string;
  }) => {
    const nextRuntimeFieldEnvMap = {
      ...runtimeFieldEnvMap,
    };

    const parsedRuntimeEnv = parseStudioRuntimeEnv(runtimeEnvValue);
    if (parsedRuntimeEnv) {
      nextRuntimeFieldEnvMap[runtimeKey] = parsedRuntimeEnv;
    } else {
      delete nextRuntimeFieldEnvMap[runtimeKey];
    }

    writeStudioRuntimeFieldEnvMap(nextRuntimeFieldEnvMap);
    applyStudioRuntimeFromStorage();
    setRuntimeFieldEnvMap(nextRuntimeFieldEnvMap);
  };

  const resetRuntimeFieldSelectors = () => {
    clearStudioRuntimeFieldEnvMap();
    applyStudioRuntimeFromStorage();
    setRuntimeFieldEnvMap({});
  };

  if (runtimeVariableKeys.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-xs">
      {runtimeVariableKeys.map((runtimeKey) => (
        <div key={runtimeKey} className="flex items-center gap-xs">
          <span className="w-full text-body-md text-onsurface-default">
            {runtimeKey}
          </span>

          <div style={{ minWidth: 200 }}>
            <Select
              id={`runtime-field-env-${runtimeKey}`}
              name={`runtime-field-env-${runtimeKey}`}
              size="sm"
              value={
                runtimeFieldEnvMap[runtimeKey] ?? INHERIT_RUNTIME_PRESET_VALUE
              }
              items={fieldRuntimeEnvItems}
              onChange={(runtimeEnvValue) => {
                handleRuntimeFieldEnvChange({
                  runtimeKey,
                  runtimeEnvValue,
                });
              }}
              aria-label={`${runtimeKey} runtime preset`}
            />
          </div>
        </div>
      ))}

      <p className="text-body-sm text-onsurface-weak">
        Runtime values update immediately. Some integrations initialized at app
        startup may still require a full page reload to fully apply changes.
      </p>

      <div className="flex gap-xs">
        <Button
          label="Reset field selectors"
          color="main"
          intent="default"
          size="md"
          onClick={resetRuntimeFieldSelectors}
        />
      </div>
    </div>
  );
};

export default RuntimeOverridesEditor;
