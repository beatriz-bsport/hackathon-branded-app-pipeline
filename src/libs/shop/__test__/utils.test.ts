import { fakerEN as faker } from '@faker-js/faker';

import {
  generateShopitemColorSizeCombinationList,
  getDuplicateVariantCombinationList,
} from '#src/libs/shop/utils';

const FAKE_ID = faker.number.int(5000);
const COLOR_LIST = faker.helpers.multiple(() => faker.color.human(), {
  count: 3,
});
const SIZE_LIST = ['S', 'M', 'L'];

const COLOR_COMBINATION_LIST = [
  { color: COLOR_LIST[0], size: '' },
  { color: COLOR_LIST[1], size: '' },
  { color: COLOR_LIST[2], size: '' },
];
const SIZE_COMBINATION_LIST = [
  { color: '', size: SIZE_LIST[0] },
  { color: '', size: SIZE_LIST[1] },
  { color: '', size: SIZE_LIST[2] },
];
const FULL_COMBINATION_LIST = [
  { color: COLOR_LIST[0], size: SIZE_LIST[0] },
  { color: COLOR_LIST[0], size: SIZE_LIST[1] },
  { color: COLOR_LIST[0], size: SIZE_LIST[2] },
  { color: COLOR_LIST[1], size: SIZE_LIST[0] },
  { color: COLOR_LIST[1], size: SIZE_LIST[1] },
  { color: COLOR_LIST[1], size: SIZE_LIST[2] },
  { color: COLOR_LIST[2], size: SIZE_LIST[0] },
  { color: COLOR_LIST[2], size: SIZE_LIST[1] },
  { color: COLOR_LIST[2], size: SIZE_LIST[2] },
];

describe('Check shop item variant combination generation', () => {
  it('Should generate color combinations when colors only are provided', () => {
    const colorCombinationList = generateShopitemColorSizeCombinationList(
      COLOR_LIST,
      [],
    );
    expect(colorCombinationList).toHaveLength(3);
    expect(colorCombinationList).toEqual(
      expect.arrayContaining(COLOR_COMBINATION_LIST),
    );
  });

  it('Should detect duplicates color combinations when colors only are provided', () => {
    const colorCombinationList = generateShopitemColorSizeCombinationList(
      COLOR_LIST,
      [],
    );
    const duplicateCombinationList = getDuplicateVariantCombinationList(
      colorCombinationList,
      [
        { id: FAKE_ID, color: COLOR_LIST[0], size: '' },
        { id: FAKE_ID, color: COLOR_LIST[1], size: '' },
        { id: FAKE_ID, color: COLOR_LIST[2], size: '' },
      ],
    );
    expect(duplicateCombinationList).toHaveLength(3);
    expect(duplicateCombinationList).toEqual(
      expect.arrayContaining(COLOR_COMBINATION_LIST),
    );
  });

  it('Should generate color combinations when sizes only are provided', () => {
    const sizeCombinationList = generateShopitemColorSizeCombinationList(
      [],
      SIZE_LIST,
    );
    expect(sizeCombinationList).toHaveLength(3);
    expect(sizeCombinationList).toEqual(
      expect.arrayContaining(SIZE_COMBINATION_LIST),
    );
  });

  it('Should detect duplicates color combinations when sizes only are provided', () => {
    const sizeCombinationList = generateShopitemColorSizeCombinationList(
      [],
      SIZE_LIST,
    );
    const duplicateCombinationList = getDuplicateVariantCombinationList(
      sizeCombinationList,
      [
        { id: FAKE_ID, color: '', size: SIZE_LIST[0] },
        { id: FAKE_ID, color: '', size: SIZE_LIST[1] },
        { id: FAKE_ID, color: '', size: SIZE_LIST[2] },
      ],
    );
    expect(duplicateCombinationList).toHaveLength(3);
    expect(duplicateCombinationList).toEqual(
      expect.arrayContaining(SIZE_COMBINATION_LIST),
    );
  });

  it('Should generate combinations when colors/sizes are provided', () => {
    const combinationList = generateShopitemColorSizeCombinationList(
      COLOR_LIST,
      SIZE_LIST,
    );
    expect(combinationList).toHaveLength(COLOR_LIST.length * SIZE_LIST.length);
    expect(combinationList).toEqual(
      expect.arrayContaining(FULL_COMBINATION_LIST),
    );
  });

  it('Should detect duplicates combinations when colors/sizes are provided', () => {
    const combinationList = generateShopitemColorSizeCombinationList(
      COLOR_LIST,
      SIZE_LIST,
    );
    const duplicateCombinationList = getDuplicateVariantCombinationList(
      combinationList,
      [
        { id: FAKE_ID, color: COLOR_LIST[0], size: SIZE_LIST[0] },
        { id: FAKE_ID, color: COLOR_LIST[0], size: SIZE_LIST[1] },
        { id: FAKE_ID, color: COLOR_LIST[0], size: SIZE_LIST[2] },
        { id: FAKE_ID, color: COLOR_LIST[1], size: SIZE_LIST[0] },
        { id: FAKE_ID, color: COLOR_LIST[1], size: SIZE_LIST[1] },
        { id: FAKE_ID, color: COLOR_LIST[1], size: SIZE_LIST[2] },
        { id: FAKE_ID, color: COLOR_LIST[2], size: SIZE_LIST[0] },
        { id: FAKE_ID, color: COLOR_LIST[2], size: SIZE_LIST[1] },
        { id: FAKE_ID, color: COLOR_LIST[2], size: SIZE_LIST[2] },
      ],
    );
    expect(duplicateCombinationList).toHaveLength(9);
    expect(duplicateCombinationList).toEqual(
      expect.arrayContaining(FULL_COMBINATION_LIST),
    );
  });
});
