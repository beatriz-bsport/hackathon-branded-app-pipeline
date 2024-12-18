import type { ConfigType } from 'src/config';
import type { Analytics } from '@segment/analytics-next';

export declare global {
  interface Runtime {
    env: ConfigType;
  }
  interface Window extends Window {
    runtime: Runtime;
    runtimeBsport: Runtime;
    bsportSegment: Analytics;
  }
}
