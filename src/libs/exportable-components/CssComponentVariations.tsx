import { offerFactory } from '#libs/offer/factories';

export const variantVariation = {
  label: 'variant',
  propsKey: 'variant',
  choices: [
    { label: 'activityName', value: 'activityName', data: 'activityName' },
    { label: 'time', value: 'time', data: 'time' },
    { label: 'coach', value: 'coach', data: 'coach' },
  ],
};
export const defaultVariantVariation = {
  propsKey: 'variant',
  value: 'activityName',
};

export const loadingVariation = {
  label: 'loading',
  propsKey: 'loading',
  choices: [
    { label: 'true', value: 'true', data: true },
    { label: 'false', value: 'false', data: false },
  ],
};
export const defaultLoadingVariation = {
  propsKey: 'loading',
  value: 'false',
};

export const isRegisteredVariation = {
  label: 'isRegistered',
  propsKey: 'isRegistered',
  choices: [
    { label: 'true', value: 'true', data: true },
    { label: 'false', value: 'false', data: false },
  ],
};

export const defaultisRegisteredVariation = {
  propsKey: 'isRegistered',
  value: 'false',
};

export const offerVariation = {
  label: 'offerStatus',
  propsKey: 'offer',
  choices: [
    {
      label: 'bookable',
      value: 'bookable',
      data: offerFactory({
        withLevel: true,
        withCoach: true,
        withEstablishment: true,
        withMetaActivity: true,
        offerStatus: 'bookable',
      }),
    },
    {
      label: 'waitingList',
      value: 'waitingList',
      data: offerFactory({
        withLevel: true,
        withCoach: true,
        withEstablishment: true,
        withMetaActivity: true,
        offerStatus: 'waitingList',
      }),
    },
    {
      label: 'cancel',
      value: 'cancel',
      data: offerFactory({
        withLevel: true,
        withCoach: true,
        withEstablishment: true,
        withMetaActivity: true,
        offerStatus: 'cancel',
      }),
    },
    {
      label: 'past',
      value: 'past',
      data: offerFactory({
        withLevel: true,
        withCoach: true,
        withEstablishment: true,
        withMetaActivity: true,
        offerStatus: 'past',
      }),
    },
    {
      label: 'future',
      value: 'future',
      data: offerFactory({
        withLevel: true,
        withCoach: true,
        withEstablishment: true,
        withMetaActivity: true,
        offerStatus: 'future',
      }),
    },
  ],
};
export const defaultOfferVariation = {
  propsKey: 'offer',
  value: 'bookable',
};
