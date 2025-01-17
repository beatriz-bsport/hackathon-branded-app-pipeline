/* eslint-disable-next-line */
const SkeletonVariantTypes = ['text', 'circle', 'rectangle'] as const;
/* eslint-disable-next-line */
const SkeletonAnimationTypes = ['pulse', 'wave', 'none'] as const;

export type SkeletonVariant = (typeof SkeletonVariantTypes)[number];
export type SkeletonAnimation = (typeof SkeletonAnimationTypes)[number];
