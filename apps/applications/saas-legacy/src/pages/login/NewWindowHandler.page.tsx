import React, { useEffect, useMemo } from 'react';
import { push as pushAction } from 'connected-react-router';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
// @ts-expect-error
import { navigateAsCompanyAdmin as navigateAsCompanyAdminAction } from '../../actions/auth.actions';
import { useLocation } from 'react-router';
import { stringToStorage } from '#src/utils/storage';

type Props = ConnectedProps<typeof connector>;

const NewWindowHandler: React.FC<Props> = ({
  push,
  navigateAsCompanyAdmin,
}) => {
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  useEffect(() => {
    const newWindowPurpose: string = searchParams.get('purpose');
    if (newWindowPurpose === 'impersonate') {
      const companyId: string = searchParams.get('company_id');
      const urlToImpersonate: string = searchParams.get('goto_url') || '';
      navigateAsCompanyAdmin(companyId, urlToImpersonate);
    } else if (newWindowPurpose === 'subwindow') {
      const stringifiedSessionStorage: string =
        searchParams.get('session_storage');
      const urlToImpersonate: string = searchParams.get('goto_url') || '';
      stringToStorage('session', stringifiedSessionStorage);
      push(urlToImpersonate);
    } else {
      window.close();
    }
  }, [push, navigateAsCompanyAdmin, searchParams]);

  return null;
};

const connector = connect(null, {
  navigateAsCompanyAdmin: navigateAsCompanyAdminAction,
  push: pushAction,
});

export default compose(connector)(NewWindowHandler);
