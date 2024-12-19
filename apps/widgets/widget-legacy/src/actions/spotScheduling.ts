import { createAction } from 'redux-actions';

export const fetchRoomBlueprintActions = {
  success: createAction('WIDGET/SPOTSCHEDULING/ROOMBLUEPRINT/SUCCESS'),
  isLoading: createAction('SPOTSCHEDULING/ROOMBLUEPRINT/IS_LOADING'),
  error: createAction('SPOTSCHEDULING/ROOMBLUEPRINT/ERROR'),
};

export const spotForBlueprintActions = {
  success: createAction('WIDGET/SPOTSCHEDULING/SPOTBLUEPRINT/LIST'),
  isLoading: createAction('SPOTSCHEDULING/SPOTBLUEPRINT/IS_LOADING'),
  error: createAction('SPOTSCHEDULING/SPOTBLUEPRINT/ERROR'),
};

export const assetForBlueprintActions = {
  success: createAction('WIDGET/SPOTSCHEDULING/ASSETBLUEPRINT/SUCCESS'),
  isLoading: createAction('SPOTSCHEDULING/ASSETBLUEPRINT/IS_LOADING'),
  error: createAction('SPOTSCHEDULING/ASSETBLUEPRINT/ERROR'),
};
