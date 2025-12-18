import React, { useEffect } from 'react';
import PartnershipConfigurationPanel from '#src/libs/partnership/components/PartnershipConfigurationPanel';
import { PartnershipIdentifier } from '#src/libs/partnership/types';
import { useGetPartnershipVenues } from '#src/libs/partnership/hooks';
import MyClubsLogoIcon from '#src/components/icons/MyClubsLogoIcon.component';

type Props = {
  myClubsPartnershipId: number;
};

const MyClubsConfiguration: React.FC<Props> = ({ myClubsPartnershipId }) => {
  const [{ loading, value: partnershipVenues }, fetchPartnershipVenues] =
    useGetPartnershipVenues(myClubsPartnershipId);

  useEffect(() => {
    fetchPartnershipVenues();
  }, [myClubsPartnershipId, fetchPartnershipVenues]);

  return (
    <PartnershipConfigurationPanel
      displayConfig={{
        partnershipIdentifier: PartnershipIdentifier.MYCLUBS,
        icon: <MyClubsLogoIcon />,
        showCopyIdToClipboard: true,
      }}
      loading={loading}
      onAddConnection={() => alert('Coming soon!')}
      onDeleteVenue={() => alert('Coming soon!')}
      onEditVenue={() => alert('Coming soon!')}
      partnershipVenues={partnershipVenues ?? []}
    />
  );
};

export default React.memo(MyClubsConfiguration);
