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
