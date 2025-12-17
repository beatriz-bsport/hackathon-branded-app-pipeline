import React, { useCallback } from 'react';

import { useBroadcastChannel } from '#src/libs/broadcast-channel/hooks';
import { BroadcastChannelMessageType } from '#src/libs/broadcast-channel/types';

import type { UpsellSumup } from '#src/libs/company/types';
import type { RolePermission } from '#src/libs/role/types';
import {
  getPerformAccessMonitoringUrl,
  staffMemberCanPerformAccessMonitoring,
} from '../utils';
import { useBarcodeScanner } from './useBarcodeScanner';
import type { MemberVisitREST } from '../types';

/**
 * Higher-order component that adds access control checking functionality to a component.
 * @param WrappedComponent - The component to wrap with access control checking.
 * @returns A new component with access control checking functionality.
 */
export const withAccessControlCheckInScanner = (
  WrappedComponent: React.ComponentType<{
    featureList: Array<UpsellSumup>;
    browserLocation?: Location;
    permissions: RolePermission;
  }>,
) => {
  return ({
    checkMemberInEstablishment,
    establishmentsSelectedInRole,
    featureList,
    location: browserLocation,
    permissions,
    ...props
  }: React.PropsWithChildren<
    React.ComponentProps<typeof WrappedComponent> & {
      checkMemberInEstablishment?: (data: any, options: any) => void;
      establishmentsSelectedInRole?: number[];
      featureList?: Array<UpsellSumup>;
      location?: Location;
      permissions?: RolePermission;
    }
  >) => {
    const sendToBroadcastChannel = useBroadcastChannel<MemberVisitREST>();

    const pathName = browserLocation?.pathname ?? '';
    // If the user is on the access monitoring page, the snackbar should not be displayed.
    const displaySnackbar = pathName !== getPerformAccessMonitoringUrl();

    /**
     * Callback function triggered when a code is scanned.
     * @param memberId - The ID of the member.
     */
    const onCodeScan = useCallback(
      (memberBarcode: string) => {
        checkMemberInEstablishment?.(
          {
            memberBarcode,
            establishmentIds: establishmentsSelectedInRole,
            displaySnackbar,
          },
          {
            onSuccess: (data: MemberVisitREST) => {
              sendToBroadcastChannel?.({
                type: BroadcastChannelMessageType.accessControlMemberVisitCreate,
                payload: data,
              });
            },
          },
        );
      },
      [
        checkMemberInEstablishment,
        sendToBroadcastChannel,
        displaySnackbar,
        establishmentsSelectedInRole,
      ],
    );

    useBarcodeScanner(onCodeScan, {
      enabled: staffMemberCanPerformAccessMonitoring(
        featureList,
        permissions,
        establishmentsSelectedInRole,
      ),
    });

    return (
      <WrappedComponent
        {...props}
        browserLocation={browserLocation}
        featureList={featureList}
        permissions={permissions}
      />
    );
  };
};
