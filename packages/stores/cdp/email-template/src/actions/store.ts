import { buildById } from "@bsport/store-base";

import { emailTemplateStore } from "#src/store";
import type {
  EmailTemplateCategory,
  EmailTemplateDetail,
  EmailTemplateSummary,
} from "#src/types";

// ----- Email Templates Category Reducers -----

export const setEmailTemplateCategories = ({
  categories,
  count,
  page,
}: {
  categories: EmailTemplateCategory[];
  count: number;
  page: number;
}) => {
  emailTemplateStore.setState((state) => {
    return {
      categories: {
        ids: categories.map((category) => category.id),
        byId: buildById<EmailTemplateCategory>({
          initial: state.categories.byId,
          newItems: categories,
        }),
        count,
        page,
      },
    };
  });
};

// ----- Email Templates Summary Reducers -----

export const setEmailTemplateSummaries = ({
  emailTemplates,
  count,
  page,
}: {
  emailTemplates: EmailTemplateSummary[];
  count: number;
  page: number;
}) => {
  emailTemplateStore.setState((state) => {
    const emailTemplatesIds = emailTemplates.map(
      (emailTemplate) => emailTemplate.id,
    );

    return {
      summaries: {
        fuzzyIds: [],
        flatIds: emailTemplatesIds,
        ids: emailTemplatesIds,
        byId: buildById<EmailTemplateSummary>({
          initial: state.summaries.byId,
          newItems: emailTemplates,
        }),
        count,
        page,
      },
    };
  });
};

export const setFuzzySearchEmailTemplateSummaries = ({
  emailTemplates,
  count,
  page,
}: {
  emailTemplates: EmailTemplateSummary[];
  count: number;
  page: number;
}) => {
  emailTemplateStore.setState((state) => {
    const emailTemplatesIds = emailTemplates.map(
      (emailTemplate) => emailTemplate.id,
    );

    return {
      summaries: {
        ...state.summaries,
        fuzzyIds: emailTemplatesIds,
        byId: buildById<EmailTemplateSummary>({
          initial: state.summaries.byId,
          newItems: emailTemplates,
        }),
        count,
        page,
      },
    };
  });
};

// ----- Email Templates Detail Reducers -----

export const setEmailTemplateDetail = ({
  emailTemplateDetail,
}: {
  emailTemplateDetail: EmailTemplateDetail;
}) => {
  emailTemplateStore.setState((state) => {
    if (!emailTemplateDetail || !emailTemplateDetail.id) return state;
    const emailTemplateId = emailTemplateDetail.id;
    const uniqueEmailTemplateIds = new Set([
      ...state.details.ids,
      emailTemplateId,
    ]);

    return {
      details: {
        byId: buildById<EmailTemplateDetail>({
          initial: state.details.byId,
          newItems: [emailTemplateDetail],
        }),
        ids: [...uniqueEmailTemplateIds],
        count: uniqueEmailTemplateIds.size,
      },
    };
  });
};
