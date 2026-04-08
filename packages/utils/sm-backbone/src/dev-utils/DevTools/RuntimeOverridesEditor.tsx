import React, { type ChangeEvent, useEffect, useMemo, useState } from "react";

import { Button, Select, TextField } from "@bsport/kaizen-primitive-core";

import {
  DEFAULT_STUDIO_RUNTIME_ENV,
  STUDIO_RUNTIME_API_BASE_URL_KEY,
  STUDIO_RUNTIME_ENVS,
  STUDIO_RUNTIME_UPDATED_EVENT,
  applyStudioRuntimeFromStorage,
  clearStudioRuntimeApiEnvironmentOverride,
  clearStudioRuntimeFieldEnvMap,
  getStudioRuntimeVariableKeys,
  parseStudioRuntimeEnv,
  readStudioRuntimeApiEnvironmentName,
  readStudioRuntimeApiEnvironmentOverride,
  readStudioRuntimeFieldEnvMap,
  writeStudioRuntimeApiEnvironmentName,
  writeStudioRuntimeApiEnvironmentOverride,
  writeStudioRuntimeFieldEnvMap,
} from "./runtimeConfig";

const INHERIT_RUNTIME_PRESET_VALUE = "__all__";
const CUSTOM_API_ENVIRONMENT_VALUE = "__custom_api_environment__";

const RuntimeOverridesEditor: React.FC = () => {
  const [runtimeVariableKeys, setRuntimeVariableKeys] = useState<string[]>(() =>
    getStudioRuntimeVariableKeys(),
  );
  const [runtimeFieldEnvMap, setRuntimeFieldEnvMap] = useState(() =>
    readStudioRuntimeFieldEnvMap(),
  );
  const [isApiEnvironmentOverrideEnabled, setIsApiEnvironmentOverrideEnabled] =
    useState(() => readStudioRuntimeApiEnvironmentOverride());
  const [apiEnvironmentName, setApiEnvironmentName] = useState(() =>
    readStudioRuntimeApiEnvironmentName(),
  );

  useEffect(() => {
    const syncRuntimeConfigState = () => {
      setRuntimeVariableKeys(getStudioRuntimeVariableKeys());
      setRuntimeFieldEnvMap(readStudioRuntimeFieldEnvMap());
      setIsApiEnvironmentOverrideEnabled(
        readStudioRuntimeApiEnvironmentOverride(),
      );
      setApiEnvironmentName(readStudioRuntimeApiEnvironmentName());
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

  const apiFieldRuntimeEnvItems = useMemo(() => {
    return [
      ...fieldRuntimeEnvItems,
      {
        id: CUSTOM_API_ENVIRONMENT_VALUE,
        label: "Custom API env",
      },
    ];
  }, [fieldRuntimeEnvItems]);

  const handleRuntimeFieldEnvChange = ({
    runtimeKey,
    runtimeEnvValue,
  }: {
    runtimeKey: string;
    runtimeEnvValue: string;
  }) => {
    const isApiRuntimeKey = runtimeKey === STUDIO_RUNTIME_API_BASE_URL_KEY;

    const nextRuntimeFieldEnvMap = {
      ...runtimeFieldEnvMap,
    };

    if (isApiRuntimeKey && runtimeEnvValue === CUSTOM_API_ENVIRONMENT_VALUE) {
      delete nextRuntimeFieldEnvMap[runtimeKey];
      writeStudioRuntimeFieldEnvMap(nextRuntimeFieldEnvMap);

      const defaultedApiEnvironmentName =
        apiEnvironmentName.trim() || DEFAULT_STUDIO_RUNTIME_ENV;
      writeStudioRuntimeApiEnvironmentName(defaultedApiEnvironmentName);
      writeStudioRuntimeApiEnvironmentOverride(true);

      applyStudioRuntimeFromStorage();
      setRuntimeFieldEnvMap(nextRuntimeFieldEnvMap);
      setApiEnvironmentName(defaultedApiEnvironmentName);
      setIsApiEnvironmentOverrideEnabled(true);
      return;
    }

    if (isApiRuntimeKey) {
      writeStudioRuntimeApiEnvironmentOverride(false);
      setIsApiEnvironmentOverrideEnabled(false);
    }

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

  const handleApiEnvironmentNameChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextApiEnvironmentName = event.target.value;

    setApiEnvironmentName(nextApiEnvironmentName);
    writeStudioRuntimeApiEnvironmentName(nextApiEnvironmentName);

    if (!isApiEnvironmentOverrideEnabled) {
      writeStudioRuntimeApiEnvironmentOverride(true);
      setIsApiEnvironmentOverrideEnabled(true);
    }

    applyStudioRuntimeFromStorage();
  };

  const resetRuntimeFieldSelectors = () => {
    clearStudioRuntimeFieldEnvMap();
    clearStudioRuntimeApiEnvironmentOverride();
    applyStudioRuntimeFromStorage();
    setRuntimeFieldEnvMap({});
    setIsApiEnvironmentOverrideEnabled(false);
    setApiEnvironmentName(DEFAULT_STUDIO_RUNTIME_ENV);
  };

  if (runtimeVariableKeys.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-xs">
      {runtimeVariableKeys.map((runtimeKey) => {
        const isApiRuntimeKey = runtimeKey === STUDIO_RUNTIME_API_BASE_URL_KEY;
        const runtimePresetItems = isApiRuntimeKey
          ? apiFieldRuntimeEnvItems
          : fieldRuntimeEnvItems;
        const runtimePresetValue =
          isApiRuntimeKey && isApiEnvironmentOverrideEnabled
            ? CUSTOM_API_ENVIRONMENT_VALUE
            : (runtimeFieldEnvMap[runtimeKey] ?? INHERIT_RUNTIME_PRESET_VALUE);

        return (
          <div key={runtimeKey} className="flex items-center gap-xs">
            <span className="w-full text-body-md text-onsurface-default">
              {runtimeKey}
            </span>

            <div style={{ minWidth: 200 }}>
              <Select
                id={`runtime-field-env-${runtimeKey}`}
                name={`runtime-field-env-${runtimeKey}`}
                size="sm"
                value={runtimePresetValue}
                items={runtimePresetItems}
                onChange={(runtimeEnvValue) => {
                  handleRuntimeFieldEnvChange({
                    runtimeKey,
                    runtimeEnvValue,
                  });
                }}
                aria-label={`${runtimeKey} runtime preset`}
              />
            </div>

            {isApiRuntimeKey && isApiEnvironmentOverrideEnabled ? (
              <div style={{ minWidth: 260 }}>
                <TextField
                  id="runtime-api-environment-name"
                  value={apiEnvironmentName}
                  label="Environment name"
                  placeholder="dev"
                  onChange={handleApiEnvironmentNameChange}
                  helperText="Generates https://<environment>.api.chaos.bsport.io"
                />
              </div>
            ) : null}
          </div>
        );
      })}

      <p className="text-body-sm text-onsurface-weak">
        Runtime values update immediately.
        <br />
        Some integrations may still require a full page reload.
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
