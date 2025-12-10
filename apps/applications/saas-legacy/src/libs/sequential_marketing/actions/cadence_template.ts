import { createAction } from 'redux-actions';

import { createCadenceFromTemplate as createCadenceFromTemplateAPI } from '#src/libs/sequential_marketing/api';
import { snackbarError, snackbarSuccess } from '#src/libs/snackbar/actions';

import type { OptionCallback, Dispatch } from '#src/state/types';
import type { Cadence } from '#src/libs/sequential_marketing/types';
import type { CadenceConfigData } from '#src/libs/sequential_marketing/cadence_templates/types';

export const createCadenceFromTemplateActions = {
  isLoading: createAction<boolean>('CADENCE_TEMPLATE/CREATE/IS_LOADING'),
  error: createAction<Error | null>('CADENCE_TEMPLATE/CREATE/ERROR'),
  success: createAction<Cadence>('CADENCE_TEMPLATE/CREATE/SUCCESS'),
};

export function createCadenceFromTemplate(
  config: CadenceConfigData,
  options?: OptionCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createCadenceFromTemplateActions.isLoading(true));
    dispatch(createCadenceFromTemplateActions.error(null));

    try {
      const response = await createCadenceFromTemplateAPI(config);
      dispatch(createCadenceFromTemplateActions.success(response.data));
      dispatch(snackbarSuccess('audience.create.success'));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(createCadenceFromTemplateActions.error(err));
      dispatch(snackbarError('audience.create.error'));
      options?.onError?.();
    }

    dispatch(createCadenceFromTemplateActions.isLoading(false));
  };
}
