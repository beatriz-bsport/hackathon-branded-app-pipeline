import React from "react";

import { Body, Icon } from "@bsport/kaizen-primitive-core";

type ParticipantsCellProps = {
  nb_bookings: number;
  effectif: number;
  nb_option: number;
  waiting_list_max_size: number;
  available: boolean;
};
export const ParticipantsCell: React.FC<ParticipantsCellProps> = ({
  nb_bookings,
  effectif,
  nb_option,
  waiting_list_max_size,
  available,
}) => (
  <div className="flex gap-sm items-center">
    <Body
      htmlVariant="p"
      size="md"
      className="lg:w-2xl"
      color={available ? "inherit" : "weak"}
    >
      {`${nb_bookings} / ${effectif}`}
    </Body>
    {available && (
      <div className="flex items-center text-onsurface-weak lg:gap-xs">
        <Icon icon="hourglass-03" size="sm" />
        <Body htmlVariant="p" size="md" color="weak">
          {`${nb_option} / ${waiting_list_max_size}`}
        </Body>
      </div>
    )}
  </div>
);
