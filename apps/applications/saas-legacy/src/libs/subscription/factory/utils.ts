import { fakerEN as faker } from '@faker-js/faker';
import {
  PENDING,
  SUCCEEDED,
  FAILED,
  PROCESSING,
  CANCELED,
} from '@bsport/common/master-data/planned-invoice-status.js';

export const randomStatus = faker.helpers.arrayElement([
  PENDING.id,
  SUCCEEDED.id,
  FAILED.id,
  PROCESSING.id,
  CANCELED.id,
]);
