export const getStripeTerminalMinAmountCts = () => {
  const currency: string = localStorage.getItem('bsport:payment:currency_code');
  switch (currency) {
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
