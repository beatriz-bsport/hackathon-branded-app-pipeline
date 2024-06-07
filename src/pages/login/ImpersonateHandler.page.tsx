import React, { useEffect } from 'react';
import { push as pushAction } from 'connected-react-router';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
// @ts-expect-error
import { navigateAsCompanyAdmin as navigateAsCompanyAdminAction } from '../../actions/auth.actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

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
      push('');
      navigateAsCompanyAdmin(companyId, '');
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
