import shopitemActions from './shopitem';
import subshopActions from './subshop';
import provisionActions from './provision';

export default {
  ...shopitemActions,
  ...subshopActions,
  ...provisionActions,
};
