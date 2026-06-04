import { type ChangeEvent, useEffect, useMemo, useState } from "react";

import { getEnv } from "@bsport/envs";

import {
  DEFAULT_STUDIO_RUNTIME_ENV,
  STUDIO_RUNTIME_UPDATED_EVENT,
  type StudioRuntimeFieldEnvMap,
  applyStudioRuntimeFromStorage,
  canApplyStudioRuntimeOverrides,
  clearStudioRuntimeApiEnvironmentOverride,
  clearStudioRuntimeFieldEnvMap,
  getAvailableStudioRuntimeEnvs,
  getStudioRuntimeVariableKeys,
  parseStudioRuntimeEnv,
  readStudioRuntimeApiEnvironmentName,
  readStudioRuntimeApiEnvironmentOverride,
  readStudioRuntimeEnv,
  readStudioRuntimeFieldEnvMap,
  writeStudioRuntimeApiEnvironmentName,
  writeStudioRuntimeApiEnvironmentOverride,
  writeStudioRuntimeEnv,
  writeStudioRuntimeFieldEnvMap,
} from "#src/runtime/runtime-config";

const DEV_COUNTER_LIMIT = 5;
const Z_INDEX = 1200;
const INHERIT_RUNTIME_PRESET_VALUE = "__all__";

type RuntimeDevToolsProps = {
  mode?: "floating" | "inline";
};

const getSelectedRuntimeEnv = () => {
  const availableRuntimeEnvs = getAvailableStudioRuntimeEnvs();
  const savedRuntimeEnv = readStudioRuntimeEnv();

  if (availableRuntimeEnvs.includes(savedRuntimeEnv)) {
    return savedRuntimeEnv;
  }

  if (availableRuntimeEnvs.includes(DEFAULT_STUDIO_RUNTIME_ENV)) {
    return DEFAULT_STUDIO_RUNTIME_ENV;
  }

  return availableRuntimeEnvs[0] ?? DEFAULT_STUDIO_RUNTIME_ENV;
};

const RuntimeDevTools = ({ mode = "floating" }: RuntimeDevToolsProps) => {
  const env = getEnv();
  const [counter, setCounter] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [runtimeVariableKeys, setRuntimeVariableKeys] = useState<string[]>(() =>
    getStudioRuntimeVariableKeys(),
  );
  const [availableRuntimeEnvs, setAvailableRuntimeEnvs] = useState(() =>
    getAvailableStudioRuntimeEnvs(),
  );
  const [selectedRuntimeEnv, setSelectedRuntimeEnv] = useState(() =>
    getSelectedRuntimeEnv(),
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
    const syncRuntimeState = () => {
      setRuntimeVariableKeys(getStudioRuntimeVariableKeys());
      setAvailableRuntimeEnvs(getAvailableStudioRuntimeEnvs());
      setSelectedRuntimeEnv(getSelectedRuntimeEnv());
      setRuntimeFieldEnvMap(readStudioRuntimeFieldEnvMap());
      setIsApiEnvironmentOverrideEnabled(
        readStudioRuntimeApiEnvironmentOverride(),
      );
      setApiEnvironmentName(readStudioRuntimeApiEnvironmentName());
    };

    window.addEventListener(
      STUDIO_RUNTIME_UPDATED_EVENT,
      syncRuntimeState as EventListener,
    );

    return () => {
      window.removeEventListener(
        STUDIO_RUNTIME_UPDATED_EVENT,
        syncRuntimeState as EventListener,
      );
    };
  }, []);

  const runtimeEnvItems = useMemo(() => {
    return availableRuntimeEnvs.map((runtimeEnv) => ({
      id: runtimeEnv,
      label: runtimeEnv,
    }));
  }, [availableRuntimeEnvs]);

  const fieldRuntimeEnvItems = useMemo(() => {
    return [
      {
        id: INHERIT_RUNTIME_PRESET_VALUE,
        label: "Preset",
      },
      ...runtimeEnvItems,
    ];
  }, [runtimeEnvItems]);

  if (!canApplyStudioRuntimeOverrides()) {
    return null;
  }

  if (mode === "floating" && env !== "local" && counter < DEV_COUNTER_LIMIT) {
    return (
      <button
        aria-label="Show runtime tools"
        onClick={() => setCounter((state) => state + 1)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          opacity: 0,
          zIndex: Z_INDEX,
        }}
        type="button"
      />
    );
  }

  const handleRuntimeEnvChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextRuntimeEnv = parseStudioRuntimeEnv(event.target.value);

    if (!nextRuntimeEnv || !availableRuntimeEnvs.includes(nextRuntimeEnv)) {
      return;
    }

    writeStudioRuntimeEnv(nextRuntimeEnv);
    applyStudioRuntimeFromStorage();
    setSelectedRuntimeEnv(nextRuntimeEnv);
  };

  const handleRuntimeFieldEnvChange = ({
    runtimeKey,
    runtimeEnvValue,
  }: {
    runtimeKey: string;
    runtimeEnvValue: string;
  }) => {
    const nextRuntimeFieldEnvMap: StudioRuntimeFieldEnvMap = {
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

  const handleApiOverrideChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isEnabled = event.target.checked;

    if (!isEnabled) {
      clearStudioRuntimeApiEnvironmentOverride();
      applyStudioRuntimeFromStorage();
      setIsApiEnvironmentOverrideEnabled(false);
      setApiEnvironmentName(DEFAULT_STUDIO_RUNTIME_ENV);
      return;
    }

    const nextApiEnvironmentName =
      apiEnvironmentName.trim() || DEFAULT_STUDIO_RUNTIME_ENV;
    writeStudioRuntimeApiEnvironmentName(nextApiEnvironmentName);
    writeStudioRuntimeApiEnvironmentOverride(true);
    applyStudioRuntimeFromStorage();
    setIsApiEnvironmentOverrideEnabled(true);
    setApiEnvironmentName(nextApiEnvironmentName);
  };

  const handleApiEnvironmentNameChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextApiEnvironmentName = event.target.value;

    setApiEnvironmentName(nextApiEnvironmentName);
    writeStudioRuntimeApiEnvironmentName(nextApiEnvironmentName);
    writeStudioRuntimeApiEnvironmentOverride(true);
    setIsApiEnvironmentOverrideEnabled(true);
    applyStudioRuntimeFromStorage();
  };

  const resetRuntimeSettings = () => {
    writeStudioRuntimeEnv(DEFAULT_STUDIO_RUNTIME_ENV);
    clearStudioRuntimeFieldEnvMap();
    clearStudioRuntimeApiEnvironmentOverride();
    applyStudioRuntimeFromStorage();
    setSelectedRuntimeEnv(getSelectedRuntimeEnv());
    setRuntimeFieldEnvMap({});
    setIsApiEnvironmentOverrideEnabled(false);
    setApiEnvironmentName(DEFAULT_STUDIO_RUNTIME_ENV);
  };

  const controls = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: 320,
        padding: mode === "floating" ? 8 : 0,
        color: "#111",
        background: "#fff",
        border: mode === "floating" ? "1px solid #999" : undefined,
        boxShadow:
          mode === "floating" ? "0 2px 8px rgb(0 0 0 / 20%)" : undefined,
        fontFamily: "sans-serif",
        fontSize: 12,
      }}
    >
      <label>
        Runtime preset
        <select
          onChange={handleRuntimeEnvChange}
          style={{ display: "block", width: "100%" }}
          value={selectedRuntimeEnv}
        >
          {runtimeEnvItems.map((runtimeEnvItem) => (
            <option key={runtimeEnvItem.id} value={runtimeEnvItem.id}>
              {runtimeEnvItem.label}
            </option>
          ))}
        </select>
      </label>

      {runtimeVariableKeys.map((runtimeKey) => (
        <label key={runtimeKey}>
          {runtimeKey}
          <select
            aria-label={`${runtimeKey} runtime preset`}
            onChange={(event) => {
              handleRuntimeFieldEnvChange({
                runtimeKey,
                runtimeEnvValue: event.target.value,
              });
            }}
            style={{ display: "block", width: "100%" }}
            value={
              runtimeFieldEnvMap[runtimeKey] ?? INHERIT_RUNTIME_PRESET_VALUE
            }
          >
            {fieldRuntimeEnvItems.map((runtimePresetItem) => (
              <option key={runtimePresetItem.id} value={runtimePresetItem.id}>
                {runtimePresetItem.label}
              </option>
            ))}
          </select>
        </label>
      ))}

      <label>
        <input
          checked={isApiEnvironmentOverrideEnabled}
          onChange={handleApiOverrideChange}
          type="checkbox"
        />{" "}
        Custom API env
      </label>

      <input
        disabled={!isApiEnvironmentOverrideEnabled}
        onChange={handleApiEnvironmentNameChange}
        placeholder="dev"
        value={apiEnvironmentName}
      />

      <button onClick={resetRuntimeSettings} type="button">
        Reset runtime
      </button>
    </div>
  );

  if (mode === "inline") {
    return controls;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: Z_INDEX,
        fontFamily: "sans-serif",
        fontSize: 12,
      }}
    >
      <button onClick={() => setIsOpen((value) => !value)} type="button">
        Runtime
      </button>

      {isOpen ? <div style={{ marginTop: 4 }}>{controls}</div> : null}
    </div>
  );
};

export default RuntimeDevTools;
