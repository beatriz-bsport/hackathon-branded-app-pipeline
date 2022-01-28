import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import { RootState } from '../../reducers';
import { EmailTemplate } from '#libs/email-editor/types';

export const getAllEmailTemplatesDict = (state: RootState) =>
  state.emailTemplate.byId;

export const getEmailTemplatesDetail = (state: RootState) =>
  state.emailTemplate.detail.byId;

export const getAllEmailTemplatesSummariesDict = (state: RootState) =>
  state.emailTemplate.byId;

export const getAllEmailTemplatesId = (state: RootState) =>
  state.emailTemplate.allIds;

export const getAllEmailTemplatesSummaries = createSelector(
  [getAllEmailTemplatesSummariesDict, getAllEmailTemplatesId],
  (summaryDict, IdList) =>
    IdList.map((id) => summaryDict[id]).filter((email) => email.available),
);

export const getUnavailableEmailTemplatesSummaries = createSelector(
  [getAllEmailTemplatesSummariesDict, getAllEmailTemplatesId],
  (summaryDict, IdList) =>
    IdList.map((id) => summaryDict[id]).filter(
      (email) => !email.available && email.company_id,
    ),
);

export const getFreshEmailTemplateSummariesIds = createSelector(
  getAllEmailTemplatesSummaries,
  (sl) => sl.filter((list) => list.available).map((list) => list.id),
);

export const getFranchisorSavedFilter = (state: RootState) =>
  state.emailTemplate.savedFilter.filters;

const _getAllEmailTemplateCategoryIds = (state: RootState) =>
  state.emailTemplate.emailTemplateCategory.allIds;

const _getEmailTemplateCategoryById = (state: RootState) =>
  state.emailTemplate.emailTemplateCategory.byId;

export const getEmailTemplateCategories = createSelector(
  [_getAllEmailTemplateCategoryIds, _getEmailTemplateCategoryById],
  (emailTemplateCategoryIds, emailTemplateCategoryById) => {
    return emailTemplateCategoryIds.map(
      (categoryId) => emailTemplateCategoryById[categoryId],
    );
  },
);

export const getEmailTemplateByCategoryWithTemplates = memoize(
  (selector: (State: RootState) => any) =>
    createSelector(
      [
        selector,
        _getAllEmailTemplateCategoryIds,
        _getEmailTemplateCategoryById,
      ],
      (
        emailTemplateList,
        emailTemplateCategoryIds,
        emailTemplateCategoryById,
      ) => {
        return [
          ...emailTemplateCategoryIds.map((categoryId) => ({
            ...emailTemplateCategoryById[categoryId],
            items: emailTemplateList.filter(
              (et: EmailTemplate) =>
                et.category === categoryId && et.company_id,
            ),
          })),
          {
            name: '',
            id: null,
            category_ordering: emailTemplateCategoryIds.length,
            items: emailTemplateList.filter(
              (et: EmailTemplate) => !et.category && et.company_id,
            ),
          },
        ];
      },
    ),
);
