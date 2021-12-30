import { RootState } from '../../reducers';
import Config from '../../config';

const storage = window.localStorage;

export const getTheme = (state: RootState) => state.theme.theme;

export const getStripePkKey = () => {
  const key = storage.getItem('bsport:stripe:pk_key');
  if (!key || key === 'null' || key === 'undefined') {
    return Config.REACT_APP_STRIPE_PK_KEY;
  }
  return key;
};

export const getCurrencyCode = () => {
  const key = storage.getItem('bsport:payment:currency_code');
  if (!key || key === 'null' || key === 'undefined') {
    return 'eur';
  }
  return key;
};

export const getCurrencyDisplay = () => {
  const key = storage.getItem('bsport:payment:currency_display');
  if (!key || key === 'null' || key === 'undefined') {
    return '€';
  }
  return key;
};

export const getCurrencyDisplayWithPrice = (price: any) => {
  const symbol = getCurrencyDisplay();

  switch (symbol) {
    case '€':
    case 'kr.':
    case 'chf':
    case 'sek':
    case 'nok':
    case 'dkk':
      return `${price}${'\u00A0'}${symbol}`;
    default:
      return `${symbol}${price}`;
  }
};

export const getThemeLoading = (state: RootState) => {
  if (getTheme(state)) {
    return state.theme.loading;
  }
  return null;
};

export default { getTheme };
