import { act, render, screen } from "@testing-library/react";
import { type FC, type ReactNode, lazy } from "react";
import { MemoryRouter } from "react-router";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import * as authTokenModule from "@bsport/local-storage-auth-token";

import { fetchSharedData } from "#src/api";
import { AppWrapper } from "#src/wrappers/AppWrapper/AppWrapper";

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

vi.mock("#src/wrappers/RoutesWrapper/DataLayerWrapper", () => ({
  DataLayerWrapper: ({ children }: { children: ReactNode }) => {
    fetchSharedData();
    return children;
  },
}));

const MockNavigation: FC = () => (
  <div data-testid="navigation-app">Navigation</div>
);
const LazyMockNavigation = lazy(() =>
  Promise.resolve({ default: MockNavigation }),
);

const MockLogin: FC = () => <div data-testid="login-app">Login Page</div>;

const MockApp: FC = () => <div data-testid="app-content">App Content</div>;

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    BrowserRouter: ({
      children,
      basename,
    }: {
      children: React.ReactNode;
      basename?: string;
    }) => (
      <MemoryRouter initialEntries={["/"]} basename={basename}>
        {children}
      </MemoryRouter>
    ),
  };
});

describe("AppWrapper", () => {
  const loginUrl = "/login";

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should redirect to login page when user is not authenticated", async () => {
    // Mock getAuthToken to retur null (unauthenticated)
    vi.spyOn(authTokenModule, "getAuthToken").mockReturnValue(null);

    await act(async () => {
      render(
        <AppWrapper
          NavigationApp={LazyMockNavigation}
          LoginApp={<MockLogin />}
          loginUrl={loginUrl}
        >
          <MockApp />
        </AppWrapper>,
      );
    });

    expect(screen.getByTestId("login-app")).toBeInTheDocument();
    expect(screen.queryByTestId("navigation-app")).not.toBeInTheDocument();
    expect(screen.queryByTestId("app-content")).not.toBeInTheDocument();
  });

  it("should render the app with navigation when user is authenticated", async () => {
    vi.spyOn(authTokenModule, "getAuthToken").mockReturnValue(
      "mock-auth-token-for-testing",
    );

    await act(async () => {
      render(
        <AppWrapper
          NavigationApp={LazyMockNavigation}
          LoginApp={<MockLogin />}
          loginUrl={loginUrl}
        >
          <MockApp />
        </AppWrapper>,
      );
    });

    expect(screen.getByTestId("navigation-app")).toBeInTheDocument();
    expect(screen.getByTestId("app-content")).toBeInTheDocument();
    expect(screen.queryByTestId("login-app")).not.toBeInTheDocument();
  });

  it("should render without navigation when NavigationApp is not provided", async () => {
    // Mock getAuthToken to return a token (authenticated)
    vi.spyOn(authTokenModule, "getAuthToken").mockReturnValue(
      "mock-auth-token-for-testing",
    );

    await act(async () => {
      render(
        <AppWrapper LoginApp={<MockLogin />} loginUrl={loginUrl}>
          <MockApp />
        </AppWrapper>,
      );
    });

    expect(screen.queryByTestId("navigation-app")).not.toBeInTheDocument();
    expect(screen.getByTestId("app-content")).toBeInTheDocument();
  });

  it("should fetch company features", async () => {
    // Mock auth token
    vi.spyOn(authTokenModule, "getAuthToken").mockReturnValue(
      "mock-auth-token-for-testing",
    );

    // Create a spy to track API calls
    const apiSpy = vi.fn();

    // Add a listener to the MSW server to track when the endpoint is called
    const { server } = await import("./setup");
    server.events.on("request:start", ({ request }) => {
      if (request.url.includes("/company/features/")) {
        apiSpy(request.url);
      }
    });

    render(
      <AppWrapper
        NavigationApp={LazyMockNavigation}
        LoginApp={<MockLogin />}
        loginUrl={loginUrl}
      >
        <MockApp />
      </AppWrapper>,
    );

    await vi.waitFor(
      () => {
        expect(apiSpy).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );
  });
});
