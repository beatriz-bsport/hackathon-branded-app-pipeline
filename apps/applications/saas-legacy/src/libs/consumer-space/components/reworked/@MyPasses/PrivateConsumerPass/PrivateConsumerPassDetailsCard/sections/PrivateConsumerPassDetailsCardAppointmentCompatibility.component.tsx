import React from 'react';

import { Trans, useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { List } from '#Fabrique/List/List.component';
import ListItem from '#Fabrique/ListItem';
import Typography from '#Fabrique/Typography';
import { VideoRecorder, XCircle } from '#src/components/untitledui';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';

import type { PrivateConsumerPassCompatibility } from '#src/libs/consumer-space/types';

type Props = {
  appointmentCompatibilities: PrivateConsumerPassCompatibility[];
  className?: string;
  isCompatibleWithVod: boolean;
};

const CompatibilityMainList: React.FC<
  Pick<Props, 'isCompatibleWithVod'> & {
    noCompatibleAppointment: boolean;
  }
> = React.memo(({ isCompatibleWithVod, noCompatibleAppointment }) => {
  const { t } = useTranslation('consumerSpace');
  return (
    <List
      className={clsx(
        'bs-private-consumer-pass-details-card__compatibility-section__list',
        {
          'bs-private-consumer-pass-details-card__compatibility-section__list--hidden':
            !isCompatibleWithVod && !noCompatibleAppointment,
        },
      )}
    >
      <ListItem
        className={clsx(
          'bs-private-consumer-pass-details-card__compatibility-section__list__item',
          {
            'bs-private-consumer-pass-details-card__compatibility-section__list__item--hidden':
              !isCompatibleWithVod,
          },
        )}
        icon={<VideoRecorder stroke="currentColor" />}
        label={
          <Trans
            i18nKey="reworked.myPasses.consumerPassDetailsCard.compatibility.contents.vod"
            t={t}
          />
        }
        size="sm"
      />
      <ListItem
        className={clsx(
          'bs-private-consumer-pass-details-card__compatibility-section__list__item',
          {
            'bs-private-consumer-pass-details-card__compatibility-section__list__item--hidden':
              !noCompatibleAppointment,
          },
        )}
        icon={<XCircle stroke="currentColor" />}
        label={t(
          'reworked.myPasses.consumerPassDetailsCard.compatibility.contents.noAppointments',
        )}
        size="sm"
      />
    </List>
  );
});

const AppointmentAndSessions: React.FC<{
  appointmentCompatibility: PrivateConsumerPassCompatibility;
}> = ({ appointmentCompatibility }) => {
  const { t } = useTranslation('consumerSpace');

  const compatibleWithAllSessions = appointmentCompatibility?.allSessions;

  const sessionsList = appointmentCompatibility?.sessions?.join(', ');

  const hideComponent = !compatibleWithAllSessions && !sessionsList;

  return (
    <div
      className={clsx(
        'bs-private-consumer-pass-details-card__compatibility-section__subsection__appointment-and-sessions',
        {
          'bs-private-consumer-pass-details-card__compatibility-section__subsection__appointment-and-sessions--hidden':
            hideComponent,
        },
      )}
    >
      <Typography variant="body-sm">{appointmentCompatibility.name}</Typography>
      <Typography variant="body-2xs">
        {compatibleWithAllSessions
          ? t(
              'reworked.myPasses.consumerPassDetailsCard.compatibility.contents.allSessions',
            )
          : t(
              'reworked.myPasses.consumerPassDetailsCard.compatibility.contents.sessions',
              {
                sessionsList,
              },
            )}
      </Typography>
    </div>
  );
};

const PrivateConsumerPassDetailsCardAppointmentCompatibility: React.FC<
  Props
> = ({ appointmentCompatibilities, className, isCompatibleWithVod }) => {
  const { t } = useTranslation('consumerSpace');

  const noCompatibleAppointment = !appointmentCompatibilities?.length;

  return (
    <div className={className}>
      <CompatibilityMainList
        isCompatibleWithVod={isCompatibleWithVod}
        noCompatibleAppointment={noCompatibleAppointment}
      />
      <ConsumerCardSection
        className={clsx(
          'bs-private-consumer-pass-details-card__compatibility-section__subsection--session',
          'bs-private-consumer-pass-details-card__compatibility-section__subsection',
          {
            'bs-private-consumer-pass-details-card__compatibility-section__subsection--hidden':
              noCompatibleAppointment,
          },
        )}
        title={t(
          'reworked.myPasses.consumerPassDetailsCard.compatibility.subtitles.sessions',
        )}
        titleVariant="body-md"
      >
        <div
          className={clsx(
            'bs-private-consumer-pass-details-card__compatibility-section__subsection__container--session',
            'bs-private-consumer-pass-details-card__compatibility-section__subsection__container',
          )}
        >
          {appointmentCompatibilities?.map(
            (appointmentCompatibility, index) => (
              <AppointmentAndSessions
                key={`appointment-and-sessions--${appointmentCompatibility?.name}--${index}`}
                appointmentCompatibility={appointmentCompatibility}
              />
            ),
          )}
        </div>
      </ConsumerCardSection>
    </div>
  );
};

export default React.memo(
  PrivateConsumerPassDetailsCardAppointmentCompatibility,
);
