import React from "react";

import { Body, Icon } from "@bsport/kaizen-primitive-core";

type ParticipantsCellProps = {
  nb_bookings: number;
  effectif: number;
  nb_option: number;
  waiting_list_max_size: number;
};
export const ParticipantsCell: React.FC<ParticipantsCellProps> = ({
  nb_bookings,
  effectif,
  nb_option,
  waiting_list_max_size,
}) => (
  <div className="flex gap-xs items-center">
    <Body htmlVariant="p" size="md" className="w-2xl">
      {`${nb_bookings} / ${effectif}`}
    </Body>
    <div className="flex items-center gap-xs text-onsurface-weak">
      <Icon icon="hourglass-03" size="sm" />
      <Body htmlVariant="p" size="md" color="weak">
        {`${nb_option} / ${waiting_list_max_size}`}
      </Body>
    </div>
  </div>
);
