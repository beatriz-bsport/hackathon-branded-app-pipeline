import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import RuntimeDevTools from "#src/dev-utils/DevTools/runtime-dev-tools";

let mockedEnv = "local";

vi.mock("@bsport/envs", () => ({
  getEnv: () => mockedEnv,
}));

describe("RuntimeDevTools", () => {
  beforeEach(() => {
    mockedEnv = "local";
    window.localStorage.clear();
    window.__SM_RUNTIME__ = {
      API_BASE_URL: "https://api.dev.bsport.io",
      SENTRY_DSN: "dev-sentry",
      UNLEASH_ENVIRONMENT: "dev",
    };
    window.__SM_RUNTIME_PRESETS__ = undefined;
  });

  it("renders runtime controls without router or theme providers", () => {
    render(<RuntimeDevTools mode="inline" />);

    expect(screen.getByLabelText("Runtime preset")).toBeInTheDocument();
    expect(
      screen.getByLabelText("API_BASE_URL runtime preset"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("SENTRY_DSN runtime preset"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("UNLEASH_ENVIRONMENT runtime preset"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Custom API env")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reset runtime" }),
    ).toBeInTheDocument();
  });

  it("updates the runtime payload from the selected preset", () => {
    render(<RuntimeDevTools mode="inline" />);

    fireEvent.change(screen.getByLabelText("Runtime preset"), {
      target: {
        value: "local",
      },
    });

    expect(window.__SM_RUNTIME__).toEqual({
      API_BASE_URL: "http://localhost:8000",
      SENTRY_DSN: "dev-sentry",
      UNLEASH_ENVIRONMENT: "dev",
    });
  });

  it("updates a single runtime variable from a selected preset", () => {
    window.__SM_RUNTIME_PRESETS__ = {
      local: {
        API_BASE_URL: "http://localhost:8000",
        SENTRY_DSN: "local-sentry",
        UNLEASH_ENVIRONMENT: "local",
      },
      dev: {
        API_BASE_URL: "https://api.dev.bsport.io",
        SENTRY_DSN: "dev-sentry",
        UNLEASH_ENVIRONMENT: "dev",
      },
      staging: {
        API_BASE_URL: "https://api.staging.bsport.io",
        SENTRY_DSN: "staging-sentry",
        UNLEASH_ENVIRONMENT: "staging",
      },
      production: {
        API_BASE_URL: "https://api.bsport.io",
        SENTRY_DSN: "production-sentry",
        UNLEASH_ENVIRONMENT: "production",
      },
    };

    render(<RuntimeDevTools mode="inline" />);

    fireEvent.change(screen.getByLabelText("SENTRY_DSN runtime preset"), {
      target: {
        value: "local",
      },
    });

    expect(window.__SM_RUNTIME__).toEqual({
      API_BASE_URL: "https://api.dev.bsport.io",
      SENTRY_DSN: "local-sentry",
      UNLEASH_ENVIRONMENT: "dev",
    });
  });

  it("keeps the custom API environment separate from field presets", () => {
    window.__SM_RUNTIME_PRESETS__ = {
      local: {
        API_BASE_URL: "http://localhost:8000",
        SENTRY_DSN: "local-sentry",
        UNLEASH_ENVIRONMENT: "local",
      },
      dev: {
        API_BASE_URL: "https://api.dev.bsport.io",
        SENTRY_DSN: "dev-sentry",
        UNLEASH_ENVIRONMENT: "dev",
      },
      staging: {
        API_BASE_URL: "https://api.staging.bsport.io",
        SENTRY_DSN: "staging-sentry",
        UNLEASH_ENVIRONMENT: "staging",
      },
      production: {
        API_BASE_URL: "https://api.bsport.io",
        SENTRY_DSN: "production-sentry",
        UNLEASH_ENVIRONMENT: "production",
      },
    };

    render(<RuntimeDevTools mode="inline" />);

    const apiBaseUrlPresetSelector = screen.getByLabelText(
      "API_BASE_URL runtime preset",
    );

    expect(
      apiBaseUrlPresetSelector.querySelector(
        'option[value="__custom_api_environment__"]',
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Custom API env"));
    fireEvent.change(screen.getByPlaceholderText("dev"), {
      target: {
        value: "qa-preview-12",
      },
    });
    fireEvent.change(apiBaseUrlPresetSelector, {
      target: {
        value: "local",
      },
    });

    expect(window.__SM_RUNTIME__?.API_BASE_URL).toBe(
      "https://qa-preview-12.api.chaos.bsport.io",
    );
    expect(screen.getByLabelText("Custom API env")).toBeChecked();

    fireEvent.click(screen.getByLabelText("Custom API env"));

    expect(window.__SM_RUNTIME__?.API_BASE_URL).toBe("http://localhost:8000");
  });

  it("renders a visible floating toggle in local", () => {
    render(<RuntimeDevTools />);

    expect(screen.getByRole("button", { name: "Runtime" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Runtime preset")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Runtime" }));

    expect(screen.getByLabelText("Runtime preset")).toBeInTheDocument();
  });

  it("is hidden by default in dev floating mode", () => {
    mockedEnv = "dev";

    render(<RuntimeDevTools />);

    const hiddenActivator = screen.getByRole("button", {
      name: "Show runtime tools",
    });

    expect(hiddenActivator).toHaveStyle({ opacity: "0" });
    expect(screen.queryByLabelText("Runtime preset")).not.toBeInTheDocument();

    [...Array(5).keys()].forEach(() => {
      fireEvent.click(hiddenActivator);
    });

    fireEvent.click(screen.getByRole("button", { name: "Runtime" }));

    expect(screen.getByLabelText("Runtime preset")).toBeInTheDocument();
  });
});
