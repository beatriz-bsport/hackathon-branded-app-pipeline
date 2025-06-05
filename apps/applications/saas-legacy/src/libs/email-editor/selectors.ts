import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import { EmailTemplate } from '#src/libs/email-editor/types';
import { RootState } from '../../reducers';

export const getAllEmailTemplatesDict = (state: RootState) =>
  state.emailTemplate.byId;

export const getEmailTemplatesDetail = (state: RootState) =>
  state.emailTemplate.detail.byId;

export const getAllEmailTemplatesSummariesDict = (state: RootState) =>
  state.emailTemplate.byId;

export const getAllEmailTemplatesId = (state: RootState) =>
  state.emailTemplate.allIds;

export const getEmailTemplateSummary = (state: RootState, id: string) =>
  state.emailTemplate.byId[id];

export const getEmailTemplatesDetailById = (state: RootState, id: number) =>
  state.emailTemplate.detail.byId[id];

export const getEmailTemplateDetailsLoading = (state: RootState) =>
  state.emailTemplate.detail.loading;

export const getEmailTemplatesSummariesLoading = (state: RootState) =>
  state.emailTemplate.loading;

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

export const getRequiredTags = (state: RootState) =>
  state.emailTemplate.currentTemplateMetaData.required_tags_list;

export const getRelatedNotificationEvents = (state: RootState) =>
  state.emailTemplate.currentTemplateMetaData.related_notification_rule_events;

const getFranchiseEmailDesignPaginatedStates = (state: RootState) =>
  state.emailTemplate.franchise;

export const getFranchiseEmailDesignOwnedByFranchisorPaginatedState =
  createSelector(
    [getFranchiseEmailDesignPaginatedStates],
    (franchiseEmailDesignPaginatedStates) => ({
      ...franchiseEmailDesignPaginatedStates.ownedByFranchisor,
      items: franchiseEmailDesignPaginatedStates.ownedByFranchisor.allIds
        .map(
          (id) =>
            franchiseEmailDesignPaginatedStates.ownedByFranchisor.byId?.[id],
        )
        .filter((item) => !!item),
    }),
  );

export const getFranchiseEmailDesignOwnedByFranchiseePaginatedState =
  createSelector(
    [getFranchiseEmailDesignPaginatedStates],
    (franchiseEmailDesignPaginatedStates) => ({
      ...franchiseEmailDesignPaginatedStates.ownedByFranchisee,
      items: franchiseEmailDesignPaginatedStates.ownedByFranchisee.allIds
        .map(
          (id) =>
            franchiseEmailDesignPaginatedStates.ownedByFranchisee.byId?.[id],
        )
        .filter((item) => !!item),
    }),
  );

export const getFranchiseEmailDesignBsportDefaultPaginatedState =
  createSelector(
    [getFranchiseEmailDesignPaginatedStates],
    (franchiseEmailDesignPaginatedStates) => ({
      ...franchiseEmailDesignPaginatedStates.bsportDefault,
      items: franchiseEmailDesignPaginatedStates.bsportDefault.allIds
        .map(
          (id) => franchiseEmailDesignPaginatedStates.bsportDefault.byId?.[id],
        )
        .filter((item) => !!item),
    }),
  );
