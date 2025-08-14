import type { ConfigType } from 'src/config';
import type { Analytics } from '@segment/analytics-next';

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
  }
}
