import { Analytics, AnalyticsBrowser } from '@segment/analytics-next';
import Config from '../../../config';

export async function getSegmentAnalytics(): Promise<Analytics> {
  const [response] = await AnalyticsBrowser.load({
    writeKey: Config.REACT_APP_SEGMENT_API_KEY,
  });
  return response;
}

export async function getSegmentAnalyticsToWindow(): Promise<Analytics> {
  const [response] = await AnalyticsBrowser.load({
    writeKey: Config.REACT_APP_SEGMENT_API_KEY,
  });
  window.bsportSegment = response;
  return response;
}
export interface UserTraits {
  name: string;
  email: string;
  id: number;
  manager: boolean;
  company: number;
}
export async function segmentIdentify(params: {
  userId: string;
  userTraits: UserTraits;
}) {
  try {
    const segmentAnalytics = await getSegmentAnalytics();
    segmentAnalytics.identify(params.userId, params.userTraits, {
      All: false,
      Intercom: true,
      Amplitude: true,
    });
  } catch (err) {
    console.error(err);
  }
}

export interface TrackProperties {
  [key: string]: string | number | null;
}
export function segmentTrack(segmentAnalytics: Analytics) {
  return () => (event: string, properties: TrackProperties) => {
    try {
      segmentAnalytics?.track(event, properties || {}, {
        All: false,
        Intercom: true,
        Amplitude: true,
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function segmentTrackEnum(segmentAnalytics: Analytics) {
  const bsportSegmentAnalytics = segmentTrack(segmentAnalytics)();
  return {
    form: (event: string, properties: TrackProperties) =>
      bsportSegmentAnalytics(event, properties),
  };
}

export type WithSegmentAnalyticsHandlers = {
  segmentAnalytics: ReturnType<typeof segmentTrackEnum>;
};

export type WithSegmentAnalyticsFormTrackerHandlers = {
  formAdd?: (properties: TrackProperties) => Analytics;
  formSubmitIntent?: (properties: TrackProperties) => Analytics;
  formSuccess?: (properties: TrackProperties) => Analytics;
  formCancel?: (properties: TrackProperties) => Analytics;
};
