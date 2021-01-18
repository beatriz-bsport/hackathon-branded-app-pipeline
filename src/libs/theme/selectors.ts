import { RootState } from '../../reducers';
import Config from '../../config';

const storage = window.localStorage;

const getTheme = (state: RootState) => state.theme.theme;

export const getStripePkKey = () => {
  const key = storage.getItem('bsport:stripe:pk_key');
  if (!key || key === 'null' || key === 'undefined') {
    return Config.REACT_APP_STRIPE_PK_KEY;
  }
  console.log('pkkey : ', key);
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

export default { getTheme };
