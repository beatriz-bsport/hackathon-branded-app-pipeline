import React, {
  Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";

import { getEnv } from "@bsport/envs";
import { Button, Popover, Tooltip } from "@bsport/kaizen-primitive-core";

import { AnalyticsDebugToggle } from "./AnalyticsDebugToggle";
import LanguageSelector, {
  type LanguageSelectorProps,
} from "./LanguageSelector";
import Logout, { type LogoutProps } from "./Logout";
import ThemeSelector from "./ThemeSelector";

export type DevToolsProps = LanguageSelectorProps & LogoutProps;
type Point = { x: number; y: number };

const STORAGE_KEY = "@bsport/__DEVTOOLS_POSITION__";
const STARTING_POINT: Point = { x: 16, y: 16 };
const Z_INDEX = 1200;

const useStoredPosition = () => {
  const [position, setPosition] = useState<Point>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : STARTING_POINT;
  });

  const setPositionWithStorage: Dispatch<SetStateAction<Point>> = (...args) => {
    flushSync(() => setPosition(...args));

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
    } catch (error) {
      console.error("Failed to save position to localStorage", error);
    }
  };

  return [position, setPositionWithStorage] as const;
};

const DevTools: React.FC<DevToolsProps> = ({
  i18nInstance,
  onLogoutCallback,
}) => {
  const [counter, setCounter] = useState(0);
  const [analyticsDebug, setAnalyticsDebug] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useStoredPosition();

  const env = getEnv();

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;

      setPosition((prev: { x: number; y: number }) => {
        const newX = Math.max(
          0,
          Math.min(window.innerWidth - 100, prev.x + dx),
        );
        const newY = Math.max(
          0,
          Math.min(window.innerHeight - 100, prev.y + dy),
        );
        return { x: newX, y: newY };
      });

      dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  if (env === "dev" && counter < 5) {
    // Return an invisible button that increases the counter
    return (
      <div
        onClick={() => setCounter((state) => state + 1)}
        className="fixed left-0 top-0 h-xs w-xs cursor-pointer"
        aria-hidden
        style={{ zIndex: Z_INDEX }}
      />
    );
  }

  return (
    <div
      ref={dragRef}
      onPointerDown={handlePointerDown}
      className="fixed m-xs flex flex-col gap-xs"
      style={{
        zIndex: Z_INDEX,
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
    >
      <Popover>
        <Popover.Anchor>
          {({ setIsPopoverOpened }) => (
            <Tooltip label="Dev tools box" placement="right">
              <Button
                label="Dev tools"
                kind="icon-button"
                icon="loading"
                color="critical"
                intent="call-to-action"
                size="md"
                onClick={() => setIsPopoverOpened((prev) => !prev)}
                className="w-fit"
                style={{ cursor: "inherit" }}
              />
            </Tooltip>
          )}
        </Popover.Anchor>
        <Popover.Content>
          {() => (
            <div className="gap-xs flex flex-col">
              <ThemeSelector />
              <LanguageSelector i18nInstance={i18nInstance} />
              <AnalyticsDebugToggle
                debugMode={analyticsDebug}
                setDebugMode={setAnalyticsDebug}
              />
              <Logout onLogoutCallback={onLogoutCallback} />
            </div>
          )}
        </Popover.Content>
      </Popover>
    </div>
  );
};

export default function DevtoolsBox(props: DevToolsProps) {
  const env = getEnv();

  if (env === "production" || env === "staging") {
    return null;
  }

  return <DevTools {...props} />;
}
