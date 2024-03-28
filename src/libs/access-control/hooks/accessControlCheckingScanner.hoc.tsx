import React, { useCallback } from 'react';

import { useAccessControlBroadcastChannel } from './broadcastChannel';
import { useNumericCodeScanner } from './codeScanning';
import { staffMemberCanPerformAccessMonitoring } from '../utils';

import type { UpsellSumup } from '#libs/company/types';
import type { RolePermission } from '#libs/role/types';
import type { MemberVisitREST } from '../types';

/**
 * Higher-order component that adds access control checking functionality to a component.
 * @param WrappedComponent - The component to wrap with access control checking.
 * @returns A new component with access control checking functionality.
 */
export const withAccessControlCheckInScanner = (
  WrappedComponent: React.ComponentType<{
    featureList: Array<UpsellSumup>;
    permissions: RolePermission;
  }>,
) => {
  return ({
    checkMemberInEstablishment,
    establishmentsSelectedInRole,
    featureList,
    permissions,
    ...props
  }: React.PropsWithChildren<
    React.ComponentProps<typeof WrappedComponent> & {
      checkMemberInEstablishment?: (data: any, options: any) => void;
      establishmentsSelectedInRole?: number[];
      featureList?: Array<UpsellSumup>;
      permissions?: RolePermission;
    }
  >) => {
    const sendToAccessControlBroadcastChannel =
      useAccessControlBroadcastChannel();

    /**
     * Callback function triggered when a code is scanned.
     * @param memberId - The ID of the member.
     */
    const onCodeScan = useCallback(
      (memberId: string) => {
        checkMemberInEstablishment?.(
          {
            memberId,
            establishmentIds: establishmentsSelectedInRole,
          },
          {
            onSuccess: (data: MemberVisitREST) => {
              sendToAccessControlBroadcastChannel?.(data);
            },
          },
        );
      },
      [
        checkMemberInEstablishment,
        sendToAccessControlBroadcastChannel,
        establishmentsSelectedInRole,
      ],
    );

    useNumericCodeScanner(onCodeScan, {
      canPerformAccessMonitoring: staffMemberCanPerformAccessMonitoring(
        featureList,
        permissions,
        establishmentsSelectedInRole,
      ),
    });

    return (
      <WrappedComponent
        {...props}
        featureList={featureList}
        permissions={permissions}
      />
    );
  };
};
