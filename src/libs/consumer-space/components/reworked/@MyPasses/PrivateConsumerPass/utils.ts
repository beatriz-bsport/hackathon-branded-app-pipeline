import { getExpirationDate } from '#libs/private-service/utils';

import type {
  PrivateConsumerPassReworked,
  PrivateServiceCompatibilityPass,
} from '#libs/private-service/types';
import type { PrivateConsumerPassCompatibility } from '#libs/consumer-space/types';
import type { PrivateConsumerPassDetailsCardProps } from './PrivateConsumerPassDetailsCard';

const getPrivateServiceCompatibilityPassData = (
  privateServiceCompatibilityPass: PrivateServiceCompatibilityPass,
): PrivateConsumerPassCompatibility => {
  const name = privateServiceCompatibilityPass?.private_service?.name;
  if (privateServiceCompatibilityPass?.excluded_slot_ids?.length) {
    const included_sessions_names =
      privateServiceCompatibilityPass?.private_service?.slots
        ?.filter(
          (slot) =>
            !privateServiceCompatibilityPass?.excluded_slot_ids?.includes(
              slot.id,
            ),
        )
        ?.map((slot) => slot.name);
    return {
      name,
      sessions: included_sessions_names,
    };
  }
  return {
    name: privateServiceCompatibilityPass?.private_service?.name,
    allSessions: true,
  };
};

export const parsePrivateConsumerPassData = (
  privateConsumerPass: PrivateConsumerPassReworked,
): Omit<
  Required<PrivateConsumerPassDetailsCardProps>,
  | 'className'
  | 'compatibleEstablishments'
  | 'isLoading'
  | 'isMobile'
  | 'showPlaceholder'
  | 'suspensionDate'
> => {
  const name = privateConsumerPass?.private_pass?.name;

  const description = privateConsumerPass?.private_pass?.description;

  const creditsLeft =
    privateConsumerPass?.private_pass?.credits -
    privateConsumerPass?.used_credits;

  const totalCredits = privateConsumerPass?.private_pass?.credits;

  const isUnlimited = !privateConsumerPass?.private_pass?.credits;

  const startDate = privateConsumerPass?.date_bought;

  const expirationDate = privateConsumerPass
    ? getExpirationDate(privateConsumerPass)
    : null;

  const isSuspended = privateConsumerPass?.disabled;

  const sharedWith = privateConsumerPass?.src_private_consumer_pass?.map(
    (cppl) => cppl?.dst_member_name,
  );

  const sharedBy =
    privateConsumerPass?.dst_private_consumer_pass?.src_member_name || null;

  const appointmentCompatibilities =
    privateConsumerPass?.private_pass?.private_services?.map(
      getPrivateServiceCompatibilityPassData,
    );

  const isCompatibleWithVod =
    privateConsumerPass?.private_pass?.full_vod_access;

  return {
    appointmentCompatibilities,
    creditsLeft,
    description,
    expirationDate,
    isCompatibleWithVod,
    isSuspended,
    isUnlimited,
    name,
    sharedBy,
    sharedWith,
    startDate,
    totalCredits,
  };
};
