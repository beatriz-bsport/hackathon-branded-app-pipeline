import type { ConfigType } from 'src/config';
import type { Analytics } from '@segment/analytics-next';
import type { IntercomSettings } from '#src/types/intercom';

type IntercomInstance = Function;

export declare global {
  interface Runtime {
    env: ConfigType;
  }
  interface ReactNativeWebView {
    postMessage: (message: string) => void;
  }
  interface Window extends Window {
    runtime: Runtime;
    runtimeBsport: Runtime;
    bsportSegment: Analytics;
    ReactNativeWebView?: ReactNativeWebView;
    intercomSettings?: IntercomSettings;
    Intercom: IntercomInstance | undefined;
    attachEvent: Function;
    Appcues?: {
      identify(
        userId: string,
        traits?: Record<string, string | number | boolean>,
      ): void;
      page(): void;
      reset?(): void;
    };
    AppcuesSettings?: Record<string, unknown>;
  }
}
