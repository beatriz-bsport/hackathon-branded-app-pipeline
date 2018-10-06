// @flow

import { push } from 'react-router-redux';

import api from '../api';
import { snackbarSuccess, snackbarError } from './snackbar.actions';
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

export function createOrUpdateCoach(coachData) {
  return async (dispatch) => {
    dispatch(actionCreateOrUpdateCoach(coachData));

    const createOrUpdate = coachData.has('id')
      ? api.coach.updateCoach
      : api.coach.addCoach;
    try {
      const response = await createOrUpdate(coachData);

      dispatch(actionCreateOrUpdateCoachSuccess(response));
      dispatch(
        snackbarSuccess(
          coachData.has('id')
            ? 'Coach modifié avec succès'
            : 'Coach ajouté avec succès',
        ),
      );
      dispatch(fetchAssociated());
      dispatch(push('/coach'));
    } catch (e) {
      console.log(e);
      dispatch(snackbarError('Erreur lors de la sauvegarde du coach'));
      dispatch(actionCreateOrUpdateCoachError(e));
    }
  };
}

export function actionCreateOrUpdateCoach(coachData) {
  return { type: types.COACH_CREATE_OR_UPDATE, coach: coachData };
}
export function actionCreateOrUpdateCoachSuccess(response) {
  return { type: types.COACH_CREATE_OR_UPDATE_SUCCESS, response };
}
export function actionCreateOrUpdateCoachError(error) {
  return { type: types.COACH_CREATE_OR_UPDATE_ERROR, error };
}
export function actionStartUpdate(coach) {
  return { type: types.COACH_UPDATE, coach };
}
export function startUpdate(coach) {
  return async (dispatch) => {
    dispatch(actionStartUpdate(coach));
    dispatch(push(`/coach/edit/${coach.id}`));
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
