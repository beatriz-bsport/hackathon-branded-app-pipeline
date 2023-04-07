export const getStripeTerminalMinAmountCts = (companyId?: number) => {
  if (
    !!companyId &&
    [
      1149, 1150, 1148, 1151, 1147, 1146, 1152, 1145, 1144, 1143, 1142, 1141,
      1155, 1153, 1140, 1139, 1138, 1136, 1134, 1154, 1135, 1196, 1166,
    ].includes(companyId)
  ) {
    return 200;
  }
  const currency: string = localStorage.getItem('bsport:payment:currency_code');
  switch (currency) {
    case 'eur':
      return 1000;
    case 'usd':
      return 1000;
    case 'cad':
      return 1500;
    case 'gbp':
      return 1000;
    case 'dkk':
      return 7500;
    case 'sek':
      return 10000;
    case 'aud':
      return 1500;
    case 'nzd':
      return 1500;
    case 'sgd':
      return 1500;
    default:
      return 1000;
  }
};
