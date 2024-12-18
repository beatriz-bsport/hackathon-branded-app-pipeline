import React from 'react';
import classNames from 'classnames';

import Typography from '#Fabrique/Typography';
import Chip from '#Fabrique/Chip';

type Props = {
  date: string;
  metaActivityPicture: string;
  metaActivityName: string;
  levelName: string;
};

const ConsumerBookingDetailsCardHeaderSection: React.FC<Props> = ({
  date,
  metaActivityPicture,
  metaActivityName,
  levelName,
}) => {
  const backgroundImage = {
    '--bs-consumer-booking-details-card__header-picture': `url("${metaActivityPicture}")`,
  } as React.CSSProperties;

  return (
    <section
      className="bs-consumer-booking-details-card__header-section"
      style={backgroundImage}
    >
      <div className="bs-consumer-booking-details-card__header-section__summary">
        <Typography
          className="bs-consumer-booking-details-card__header-section__summary__date-time"
          variant="title-md"
        >
          {date}
        </Typography>
        <Typography
          className={classNames(
            'bs-consumer-booking-details-card__header-section__summary__activity',
            {
              'bs-consumer-booking-details-card__header-section__summary__activity--hidden':
                !metaActivityName,
            },
          )}
          variant="body-lg"
        >
          {metaActivityName}
        </Typography>
      </div>

      <Chip
        classes={{
          content:
            'bs-consumer-booking-details-card__header-section__level__text',
        }}
        className="bs-consumer-booking-details-card__header-section__level"
        color="grey"
      >
        {levelName}
      </Chip>
    </section>
  );
};

export default React.memo(ConsumerBookingDetailsCardHeaderSection);
