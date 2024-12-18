import Config from '../../config';

export const makeActivationLink = (companyId: number, activationCode: string) =>
  `${Config.PUBLIC_URL}/checkout/${companyId}/giftcard/activation/${activationCode}`;
