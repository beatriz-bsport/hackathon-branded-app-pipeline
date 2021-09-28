import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import { RootState } from '../../reducers';
import type {
  CustomForm,
  CustomFormFilledAPI,
  CustomFormFieldAnswerAPI,
  CustomFormDisplayRule,
} from './types';
import { checkDisabledHasAnswer } from './utils';

export const getCustomForm = (state: RootState, id: number) =>
  state.customForm.byId[id];

export const getCustomFormDict = (state: RootState) => state.customForm.byId;
export const getCustomFormList = (state: RootState) => state.customForm.allIds;
export const getCustomFormFilledDict = (state: RootState) =>
  state.customForm.filled.byId;
export const getCustomFormFilledList = (state: RootState) =>
  state.customForm.filled.allIds;

export const getCustomFormDispayRuleDict = (state: RootState) =>
  state.customForm.display_rule.byId;
export const getCustomFormDisplayRuleIdList = (state: RootState) =>
  state.customForm.display_rule.allIds;
const _getMemberStatisticsData = (state: RootState) =>
  state.customForm.statistics.byId;
export const getAllCustomForm = createSelector(
  [getCustomFormList, getCustomFormDict],
  (ids: Array<number>, data: { [id: number]: CustomForm }) => {
    return ids.map((id) => data[id]);
  },
);

export const getCustomFormWithEnableField = createSelector(
  [getCustomFormDict, (_: RootState, id: number) => id],
  (data, custom_form_id) => {
    return data[custom_form_id]
      ? {
          ...data[custom_form_id],
          custom_form_field: data[custom_form_id].custom_form_field.filter(
            (field) => !field.disabled,
          ),
        }
      : null;
  },
);
export const getCustomFormListWithEnableField = createSelector(
  [getCustomFormDict, (_: RootState, ids: Array<number>) => ids],
  (data, custom_form_ids_list) => {
    return custom_form_ids_list.map((custom_form_id) => {
      return data[custom_form_id]
        ? {
            ...data[custom_form_id],
            custom_form_field: data[custom_form_id].custom_form_field.filter(
              (field) => !field.disabled,
            ),
          }
        : null;
    });
  },
);

export const getCustomFormDisplayRuleBlockingList = createSelector(
  [getCustomFormDispayRuleDict, (_: RootState, ids: Array<number>) => ids],
  (data, custom_form_display_rule_ids_list) => {
    return custom_form_display_rule_ids_list.map((display_rule_id) => {
      return data[display_rule_id]
        ? {
            ...data[display_rule_id],
          }
        : null;
    });
  },
);
export const getMemberCustomFormFilled = createSelector(
  [
    getCustomFormFilledList,
    getCustomFormFilledDict,
    getCustomFormDict,
    (_: RootState, id: number) => id,
  ],
  (
    ids: Array<number>,
    data: { [id: number]: CustomFormFilledAPI },
    customFormData: { [id: number]: CustomForm },
    memberId,
  ) => {
    return ids
      .filter((_id) => data[_id].member_id === memberId)
      .map((id) => {
        return {
          ...data[id],
          customFormData: customFormData[data[id].custom_form_id],
        };
      });
  },
);

export const excludeDraftCustomFormFilled = memoize(
  (
    selector: (
      state: RootState,
    ) => Array<CustomFormFilledAPI> | CustomFormFilledAPI,
  ) =>
    createSelector([selector], (custom_form_filled) => {
      if (!custom_form_filled) return null;
      if (!Array.isArray(custom_form_filled)) {
        return custom_form_filled.is_draft ? null : custom_form_filled;
      }
      return custom_form_filled.filter(
        (form_filled: CustomFormFilledAPI) => form_filled.is_draft === false,
      );
    }),
);
export const getCustomFormListWithEnabledFieldAnswered = createSelector(
  // Selector returning a list of CustomFormFilled. Only enabled fields
  // are taken into account. The answer is appended to the field if one of the possible
  // answer type is not null else answer is set to null
  [getCustomFormFilledList, getCustomFormDict, getCustomFormFilledDict],
  (customFormFilledIds, customFormData, customFormFilledData) => {
    return customFormFilledIds.map((form_filled_id: number) => {
      const customFormId = customFormFilledData[form_filled_id].custom_form_id;
      return {
        ...customFormData[customFormId],
        custom_form_filled_id: customFormFilledData[form_filled_id].id,
        custom_form_field: customFormData[customFormId]?.custom_form_field
          .filter((_field) => !_field.disabled)
          .map((field) => {
            const answerData = customFormFilledData[
              form_filled_id
            ]?.custom_form_field_filled.find(
              (field_answer: CustomFormFieldAnswerAPI) =>
                field_answer.custom_form_field_id === field.id,
            );
            const { text_answer, choices_answer, file_answer, image_answer } =
              answerData || {};
            return {
              ...field,
              answer:
                text_answer ||
                choices_answer ||
                file_answer ||
                image_answer ||
                null,
            };
          }),
      };
    });
  },
);

export const getCustomFormListWithDisabledFieldAnswered = createSelector(
  // Selector returning a list of CustomFormFilled. Only disabled fields
  // with a not null answer are taken into account
  [getCustomFormFilledList, getCustomFormDict, getCustomFormFilledDict],
  (customFormFilledIds, customFormData, customFormFilledData) => {
    return customFormFilledIds.map((form_filled_id) => {
      const customFormId = customFormFilledData[form_filled_id].custom_form_id;
      return {
        ...customFormData[customFormId],
        custom_form_filled_id: customFormFilledData[form_filled_id].id,
        custom_form_field: customFormData[customFormId]?.custom_form_field
          .filter((_field) =>
            checkDisabledHasAnswer(
              _field,
              form_filled_id,
              customFormFilledData,
            ),
          )
          .map((field) => {
            const answerData = customFormFilledData[
              form_filled_id
            ]?.custom_form_field_filled.find(
              (field_answer: CustomFormFieldAnswerAPI) =>
                field_answer.custom_form_field_id === field.id,
            );
            const { text_answer, choices_answer, file_answer, image_answer } =
              answerData || {};
            return {
              ...field,
              answer:
                text_answer ||
                choices_answer ||
                file_answer ||
                image_answer ||
                null,
            };
          }),
      };
    });
  },
);
export const getCustomFormStatistics = createSelector(
  [_getMemberStatisticsData, (_, id: number) => id],
  (statisticsDict, id) => {
    return statisticsDict[id]
      ? {
          ...statisticsDict[id],
          allMemberIds: Object.keys(
            statisticsDict[id].detail_by_member,
          ).map((_id: string) => parseInt(_id)),
        }
      : null;
  },
);

export const getAllCustomFormDisplayRule = createSelector(
  [getCustomFormDisplayRuleIdList, getCustomFormDispayRuleDict],
  (ids: Array<number>, data: { [id: number]: CustomFormDisplayRule }) => {
    return ids.map((id) => data[id]);
  },
);

export const withDisplayRule = memoize(
  (selector: (state: RootState) => Array<CustomForm> | CustomForm) =>
    createSelector(
      [selector, getAllCustomFormDisplayRule],
      (custom_form, DisplayData) => {
        if (!custom_form) return null;
        if (!Array.isArray(custom_form)) {
          return {
            ...custom_form,
            display_rules: DisplayData.filter(
              (dR) => dR.custom_form_id === custom_form.id,
            ),
          };
        }
        return custom_form.map((cf) => ({
          ...cf,
          display_rules: DisplayData.filter(
            (dR) => dR.custom_form_id === cf.id,
          ),
        }));
      },
    ),
);

export const excludeCustoomFormWithoutDisplayRule = memoize(
  (selector: (state: RootState) => Array<CustomForm> | CustomForm) =>
    createSelector([selector], (custom_form) => {
      if (!custom_form) return null;
      if (!Array.isArray(custom_form)) {
        return custom_form;
      }
      return custom_form.filter(
        (form: CustomForm) => form?.display_rules?.length !== 0,
      );
    }),
);
