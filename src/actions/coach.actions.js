import api from '../api';
import types from './coach.types';

export function fetchAssociated() {
  return async (dispatch) => {
    dispatch(startFetchAssociatedCoaches());

    try {
      const response = await api.coach.fetchAssociated();
      const associatedCoaches = response.data;
      dispatch(fetchedAssociatedCoaches(associatedCoaches));
    } catch (err) {
      dispatch(errorFetchingAssociatedCoaches());
    }
  };
}

export function fetchedAssociatedCoaches(coaches) {
  return { type: types.HAS_FETCHED_ASSOCIATED_COACH, coaches };
}
export function startFetchAssociatedCoaches() {
  return { type: types.START_FETCH_ASSOCIATED_COACH };
}

export function errorFetchingAssociatedCoaches() {
  return { type: types.ERROR_FETCHING_ASSOCIATED_COACH };
}
export function associatedCoachesAlreadyLoading() {
  return { type: types.ASSOCIATED_COACH_ALREADY_LOADING };
}

export function fetchAssociatedCoachPerformance(
  associatedCoachId,
  start_timestamp,
  end_timestamp,
) {
  return async (dispatch) => {
    dispatch(startFetchAssociatedCoachPerformance());

    try {
      const response = await api.coach.fetchAssociatedCoachPerformance(
        associatedCoachId,
        start_timestamp,
        end_timestamp,
      );
      const performance = response.data;
      dispatch(fetchedAssociatedCoachPerformance(performance));
    } catch (err) {
      dispatch(errorFetchingAssociatedCoachPerformance());
    }
  };
}

export function fetchedAssociatedCoachPerformance(performance) {
  return { type: types.HAS_FETCHED_ASSOCIATED_COACH_PERFORMANCE, performance };
}
export function startFetchAssociatedCoachPerformance() {
  return { type: types.START_FETCH_ASSOCIATED_COACH_PERFORMANCE };
}

export function errorFetchingAssociatedCoachPerformance() {
  return { type: types.ERROR_FETCHING_ASSOCIATED_COACH_PERFORMANCE };
}
