/**
 * DEPRECATION NOTICE
 * We disabled the initialization of Rudderstack as
 * - we are moving away to use Mixpanel instead
 * - we exceeding our quota
 * - we are not using rudderstack anymore
 * - it won't be integrated in the revamp
 */
import * as rudderanalytics from 'rudder-sdk-js';
import { captureException as SentryCaptureException } from '@sentry/react';
import Config from '../../../config';
import { TrackProperties, UserTraits } from './type';

/**
 * @deprecated See DEPRECATION NOTICE
 */
export function rudderInitialize() {
  return;
  try {
    rudderanalytics.load(
      Config.REACT_APP_RUDDERSTACK_KEY,
      Config.REACT_APP_RUDDERSTACK_DATAPLANEURL,
    );
  } catch (err) {
    console.error(err);
    SentryCaptureException(err);
  }
}

/**
 * @deprecated See DEPRECATION NOTICE
 */
export async function rudderStackIdentify(params: {
  userId: string;
  userTraits: UserTraits;
}) {
  return;
  try {
    rudderanalytics?.identify(params.userId, params.userTraits, {
      All: false,
      Intercom: true,
      Amplitude: true,
    });
  } catch (err) {
    SentryCaptureException(err);
  }
}

// @ts-expect-error
function handleAddData(additional_data) {
  /**
   * format additional_data into a dict : {data : additional_data} if additional_data != {}
   * return {} otherwise
   * @param additional_data object: data to be added when sending an event
   */
  if (
    (additional_data &&
      Object.keys(additional_data).length === 0 &&
      Object.getPrototypeOf(additional_data) === Object.prototype) ||
    !additional_data
  )
    return {};
  return { data: additional_data };
}

/**
 * @deprecated See DEPRECATION NOTICE
 */
export async function rudderStackObjectTrack(
  object_type: string, // "payment_pack"
  event_type_group: string, // "form"
  event_type_action: string, // "add"
  data: TrackProperties = {}, // { id, name, SCT}...
) {
  return;
  try {
    rudderanalytics?.track(
      `${object_type}:${event_type_group}:${event_type_action}`,
      {
        object_type,
        event_type_group,
        event_type_action,
        ...data,
      },
      { All: false, Intercom: true, Amplitude: true },
    );
  } catch (err) {
    SentryCaptureException(err);
  }
}

/**
 * @deprecated See DEPRECATION NOTICE
 */
export const rudderStackFormTrackingFunctionsRegistry = (
  object_identifier: string,
) => ({
  /**
   * @deprecated See DEPRECATION NOTICE
   */
  trackFormAdd: (id?: number, additional_data: TrackProperties = {}) => {
    return;
    try {
      // prepare the {data: } field
      const formatAddData = handleAddData(additional_data);
      rudderStackObjectTrack(object_identifier, 'form', 'add', {
        ...(id ? { object_id: id } : {}),
        ...formatAddData,
      });
    } catch (err) {
      SentryCaptureException(err);
    }
  },
  /**
   * @deprecated See DEPRECATION NOTICE
   */
  trackFormSubmitIntent: (
    id?: number,
    additional_data: TrackProperties = {},
  ) => {
    return;
    try {
      // prepare the {data: } field
      const formatAddData = handleAddData(additional_data);
      rudderStackObjectTrack(object_identifier, 'form', 'submit_intent', {
        ...(id ? { object_id: id } : {}),
        ...formatAddData,
      });
    } catch (err) {
      SentryCaptureException(err);
    }
  },
  /**
   * @deprecated See DEPRECATION NOTICE
   */
  trackFormSuccess: (id?: number, additional_data: TrackProperties = {}) => {
    return;
    try {
      // prepare the {data: } field
      const formatAddData = handleAddData(additional_data);
      rudderStackObjectTrack(object_identifier, 'form', 'submit_success', {
        ...(id ? { object_id: id } : {}),
        ...formatAddData,
      });
    } catch (err) {
      SentryCaptureException(err);
    }
  },
  /**
   * @deprecated See DEPRECATION NOTICE
   */
  trackFormCancel: (id?: number, additional_data: TrackProperties = {}) => {
    return;
    try {
      // prepare the {data: } field
      const formatAddData = handleAddData(additional_data);
      rudderStackObjectTrack(object_identifier, 'form', 'cancel', {
        ...(id ? { object_id: id } : {}),
        ...formatAddData,
      });
    } catch (err) {
      SentryCaptureException(err);
    }
  },
});

/**
 * @deprecated See DEPRECATION NOTICE
 */
export async function rudderStackPage(parsedQueryString: {
  // @ts-expect-error
  [key: any]: string;
}) {
  return;
  try {
    rudderanalytics?.page(
      { params: parsedQueryString },
      {
        All: false,
        Intercom: true,
        Amplitude: true,
      },
    );
  } catch (err) {
    SentryCaptureException(err);
  }
}
