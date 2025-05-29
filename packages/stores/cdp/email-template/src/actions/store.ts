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
  emailTemplateStore.setState(() => {
    const byId = categories.reduce(
      (acc: Record<string, EmailTemplateCategory>, category) => {
        acc[category.id] = category;
        return acc;
      },
      {},
    );

    return {
      categories: {
        ids: categories.map((category) => category.id),
        byId,
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
  emailTemplateStore.setState(() => {
    const byId = emailTemplates.reduce(
      (acc: Record<string, EmailTemplateSummary>, emailTemplate) => {
        acc[emailTemplate.id] = emailTemplate;
        return acc;
      },
      {},
    );

    const emailTemplatesIds = emailTemplates.map(
      (emailTemplate) => emailTemplate.id,
    );

    return {
      summaries: {
        fuzzyIds: [],
        flatIds: emailTemplatesIds,
        ids: emailTemplatesIds,
        byId,
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
    const byId = emailTemplates.reduce(
      (acc: Record<string, EmailTemplateSummary>, emailTemplate) => {
        acc[emailTemplate.id] = emailTemplate;
        return acc;
      },
      {},
    );

    const emailTemplatesIds = emailTemplates.map(
      (emailTemplate) => emailTemplate.id,
    );

    return {
      summaries: {
        ...state.summaries,
        fuzzyIds: emailTemplatesIds,
        byId: byId,
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
        byId: {
          ...state.details.byId,
          [emailTemplateId]: emailTemplateDetail,
        },
        ids: [...uniqueEmailTemplateIds],
        count: uniqueEmailTemplateIds.size,
      },
    };
  });
};
