// @ts-nocheck
// @ts-ignore
import faker from 'faker';
import {
  EmailTemplateDetail,
  EmailTemplateSummary,
} from '#libs/email-editor/types';

import fakerHTML from '#components/html/fakerHTML';

faker.locale = 'fr';

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function EmailTemplateDetailFactory(id?: number): EmailTemplateDetail {
  return {
    id: id ?? randomInt(1000),
    name: faker.lorem.words(5),
    company_id: randomInt(1000),
    design: {},
    html: fakerHTML(),
  };
}

export function EmailTemplateSummaryFactory(id?: number): EmailTemplateSummary {
  return {
    id: id ?? randomInt(1000),
    date_created: faker.date.past().toString(),
    date_modified: faker.date.past().toString(),
    subject: faker.hacker.phrase(),
    title: faker.lorem.words(5),
    company_id: randomInt(1000),
    ordering_in_category: randomInt(1000),
    available: true,
    category: randomInt(10),
  };
}

export default function EmailTemplateDetailSummaryListsFactory(
  length: number,
): [EmailTemplateDetail[], EmailTemplateSummary[]] {
  const detailList: EmailTemplateDetail[] = [];
  const summaryList: EmailTemplateSummary[] = [];
  for (let i = 0; i < length; i += 1) {
    detailList.push(EmailTemplateDetailFactory(i));
    summaryList.push(EmailTemplateSummaryFactory(i));
  }
  return [detailList, summaryList];
}
