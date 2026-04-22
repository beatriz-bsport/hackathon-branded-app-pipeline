import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../../reducers';

export const selectWidgetDataVersion = (state: RootState): number =>
  state.widget.dataVersion;

/**
 * Returns the current `state.widget.dataVersion`. This number is bumped each
 * time `invalidateWidgetData` is dispatched (after login, payment, or video
 * registration). Pass it into data-fetching components as a prop (e.g.
 * `refreshTrigger`) so they refetch when it changes.
 */
export const useWidgetDataVersion = (): number =>
  useSelector(selectWidgetDataVersion);

/**
 * Runs `callback` whenever `state.widget.dataVersion` changes. The callback is
 * NOT called on the initial mount — only on subsequent invalidations triggered
 * by `invalidateWidgetData`.
 *
 * Use this at the root of data-heavy widgets that previously relied on the
 * full widget remount to refetch their data after iframe-driven side effects
 * (login, payment, video registration).
 */
export const useRefetchOnWidgetDataVersion = (callback: () => void): void => {
  const dataVersion = useWidgetDataVersion();
  const previousVersionRef = useRef<number>(dataVersion);

  useEffect(() => {
    if (previousVersionRef.current === dataVersion) {
      return;
    }
    previousVersionRef.current = dataVersion;
    callback();
  }, [dataVersion, callback]);
};
