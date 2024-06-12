import React, { useEffect } from 'react';
import { push as pushAction } from 'connected-react-router';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
// @ts-expect-error
import { navigateAsCompanyAdmin as navigateAsCompanyAdminAction } from '../../actions/auth.actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { getItemInStorage, removeItemInStorage } from '#src/utils/storage';
import { STORAGE_KEY_BSPORT_IMPERSONATED_GOTO_URL } from '#src/actions/constants';

type OwnProps = {
  companyId: number;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const ImpersonateHandler: React.FC<Props> = ({
  companyId,
  push,
  navigateAsCompanyAdmin,
}) => {
  useEffect(() => {
    if (companyId) {
      const urlToImpersonate = getItemInStorage(
        'local',
        STORAGE_KEY_BSPORT_IMPERSONATED_GOTO_URL,
      );
      removeItemInStorage('local', STORAGE_KEY_BSPORT_IMPERSONATED_GOTO_URL);
      navigateAsCompanyAdmin(companyId, urlToImpersonate);
      push('');
    }
  }, [push, companyId, navigateAsCompanyAdmin]);

  return null;
};

const connector = connect(null, {
  navigateAsCompanyAdmin: navigateAsCompanyAdminAction,
  push: pushAction,
});

export default compose(
  routerParamsToProps({ companyId: 'companyId:number' }),
  connector,
)(ImpersonateHandler);
