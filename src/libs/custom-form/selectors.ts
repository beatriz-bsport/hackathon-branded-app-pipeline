import { createSelector } from 'reselect';
import { RootState } from '../../reducers';
import type {
  CustomForm,
  CustomFormFilledAPI,
  CustomFormFieldAnswerAPI,
} from './types';

export const getCustomForm = (state: RootState, id: number) =>
  state.customForm.byId[id];

export const getCustomFormDict = (state: RootState) => state.customForm.byId;
export const getCustomFormList = (state: RootState) => state.customForm.allIds;
export const getCustomFormFilledDict = (state: RootState) =>
  state.customForm.filled.byId;
export const getCustomFormFilledList = (state: RootState) =>
  state.customForm.filled.allIds;

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

export const getCustomFormListWithAnswer = createSelector(
  [getCustomFormFilledList, getCustomFormDict, getCustomFormFilledDict],
  (customFormFilledIds, customFormData, customFormFilledData) => {
    return customFormFilledIds.map((form_filled_id) => {
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
