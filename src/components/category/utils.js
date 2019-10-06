//  @flow
import SPORTS from '@bsport/common/lib/master-data/sports';

export const getSportWithIcon = (parentCategory: number) =>
  SPORTS.find((s) => s.id === parentCategory);
