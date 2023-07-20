// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom';

const data = {
  isBsportPluginInstalled: '',
  bsportPluginInstalled: '',
  i18nextLng: '',
  'http:token': '',
  'bsport:http:token': '',
  'bsport:franchise:http:token': '',
  'bsport:relatedMemberMaster:http:token': '',
  'bsport:stripe:pk_key': '',
  'bsport:payment:currency_code': '',
  'bsport:payment:currency_display': '',
  'bsport:payment:currency_region': '',
  'bsport:display:pass_credit_factor': '',
};

const localStorageMock = {
  getItem: (id) => data[id],
  setItem: (id, value) => {
    data[id] = value;
  },
  clear: (id) => {
    data[id] = '';
  },
};

window.localStorage = localStorageMock;
