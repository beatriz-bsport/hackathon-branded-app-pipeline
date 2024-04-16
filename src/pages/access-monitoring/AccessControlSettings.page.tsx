import React, { useEffect, useCallback } from 'react';
import { ConnectedProps, connect } from 'react-redux';

import { getAccessControlPolicy as getAccessControlPolicySelector } from '#libs/access-control/selectors';

import {
  getAccessControlPolicy as getAccessControlPolicyAction,
  patchAccessControlPolicy as patchAccessControlPolicyAction,
} from '#libs/access-control/actions';

import AccessControlSettingsForm from '#libs/access-control/components/AccessControlSettings/AccessControlSettingsForm.component';

import type { RootState } from '../../reducers';
import type { AccessControlPolicy } from '#libs/access-control/types';

type Props = ConnectedProps<typeof connector>;

const AccessControlSettings: React.FC<Props> = ({
  accessControlPolicy,
  companyId,
  isAccessControlPolicyLoading,
  getAccessControlPolicy,
  patchAccessControlPolicy,
}) => {
  useEffect(() => {
    getAccessControlPolicy(companyId);
  }, [getAccessControlPolicy, companyId]);
  const handleSubmit = useCallback(
    (data: AccessControlPolicy) => {
      patchAccessControlPolicy(companyId, data);
    },
    [patchAccessControlPolicy, companyId],
  );
  return (
    <AccessControlSettingsForm
      accessControlPolicy={accessControlPolicy}
      isLoading={isAccessControlPolicyLoading}
      onSubmit={handleSubmit}
    />
  );
};

const connector = connect(
  (state: RootState) => ({
    accessControlPolicy: getAccessControlPolicySelector(state),
    isAccessControlPolicyLoading: state.accessControl.policy.loading,
    companyId: state.theme.theme.company,
  }),
  {
    getAccessControlPolicy: getAccessControlPolicyAction,
    patchAccessControlPolicy: patchAccessControlPolicyAction,
  },
);

export default React.memo(connector(AccessControlSettings));
