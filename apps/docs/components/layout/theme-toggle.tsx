import { cx } from "#src/lib/cx";
import {
  type DocsThemePreference,
  getDocsThemePreferenceLabel,
} from "#src/lib/docs-theme";

import { useDocsTheme } from "./docs-theme-provider";

type ThemeToggleProps = {
  className?: string;
};

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3.2 7 7 0 0 0 21 14.5Z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
    </svg>
  );
}

function ThemeIcon({ preference }: { preference: DocsThemePreference }) {
  switch (preference) {
    case "light":
      return <SunIcon />;
    case "dark":
      return <MoonIcon />;
    default:
      return <SystemIcon />;
  }
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { preference, cyclePreference } = useDocsTheme();

  return (
    <button
      type="button"
      onClick={cyclePreference}
      aria-label={getDocsThemePreferenceLabel(preference)}
      title={getDocsThemePreferenceLabel(preference)}
      className={cx(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-[color:var(--color-border)] text-[color:var(--color-fg-muted)] transition-colors hover:bg-[color:var(--color-bg-subtle)] hover:text-[color:var(--color-fg)]",
        className,
      )}
    >
      <ThemeIcon preference={preference} />
    </button>
  );
}
