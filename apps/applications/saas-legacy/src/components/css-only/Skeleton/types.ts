const SkeletonVariantTypes = ['text', 'circle', 'rectangle'] as const;
const SkeletonAnimationTypes = ['pulse', 'wave', 'none'] as const;

export type SkeletonVariant = (typeof SkeletonVariantTypes)[number];
export type SkeletonAnimation = (typeof SkeletonAnimationTypes)[number];
