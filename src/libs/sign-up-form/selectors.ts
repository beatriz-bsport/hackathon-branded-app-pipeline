import reduce from 'lodash/reduce';
import { createSelector } from 'reselect';
import { RootState } from '../../reducers';
import type { SignUpFormConfig } from './types';

export const getSignUpFormConfiguration = (state: RootState) =>
  state.poll.signUpForm.config;

export const getSignUpFormConfigurationDict = createSelector(
  getSignUpFormConfiguration,
  (signUpConfigList: SignUpFormConfig) => {
    if (!signUpConfigList) {
      return null;
    }
    const configDict = reduce(
      signUpConfigList.poll_fields,
      (acc, { field_identifier, ...rest }) => ({
        ...acc,
        [field_identifier]: { field_identifier, ...rest },
      }),
      {},
    );

    configDict.password = {
      field_identifier: 'password',
      is_always_required: true,
      is_always_shown: true,
      label: null,
      mandatory_on_creation: true,
      editable_on_edition: true,
      show_on_creation: true,
      show_on_edition: true,
    };
    configDict.passwordConfirm = {
      field_identifier: 'passwordConfirm',
      is_always_required: true,
      is_always_shown: true,
      label: null,
      mandatory_on_creation: true,
      editable_on_edition: true,
      show_on_creation: true,
      show_on_edition: true,
    };
    return { ...signUpConfigList, poll_fields: configDict };
  },
);
