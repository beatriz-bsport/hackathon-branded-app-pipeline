import { fakerEN as faker } from '@faker-js/faker';
import {
  PENDING,
  SUCCEEDED,
  FAILED,
  PROCESSING,
  CANCELED,
} from '@bsport/common/lib/master-data/planned-invoice-status';

export const randomStatus = faker.helpers.arrayElement([
  PENDING.id,
  SUCCEEDED.id,
  FAILED.id,
  PROCESSING.id,
  CANCELED.id,
]);
