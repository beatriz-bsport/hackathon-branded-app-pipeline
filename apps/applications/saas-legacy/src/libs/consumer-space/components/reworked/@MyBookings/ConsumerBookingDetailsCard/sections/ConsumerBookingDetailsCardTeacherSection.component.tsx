import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import {
  FacebookSquare,
  InstagramSquare,
  User01,
} from '#src/components/untitledui';
import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';
import ConsumerCardDescription from '#src/libs/consumer-space/components/reworked/common/ConsumerCardDescription';

import Typography from '#Fabrique/Typography';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import IconButton from '#Fabrique/IconButton';

type Props = {
  coachPicture?: string;
  coachOverridePicture?: string;
  coachName: string;
  coachOverrideName?: string;
  coachDescription?: string;
  coachOverrideDescription?: string;
  coachFacebookURL?: string;
  coachInstagramURL?: string;
};

type TeacherAvatarProps = {
  hasCoachOverride?: boolean;
  picture?: string;
  name: string;
};

// TODO: create Avatar component
const OriginalTeacherAvatar: React.FC<TeacherAvatarProps> = React.memo(
  ({ hasCoachOverride, picture, name }) => {
    const { t } = useTranslation('consumerSpace');

    return (
      <List className="bs-consumer-booking-details-card__teacher-section__list">
        {hasCoachOverride && (
          <Typography
            className="bs-consumer-booking-details-card__section__subtitle"
            variant="body-sm"
          >
            {t('consumerSpace:reworked.myBookings.detailsCard.teacher.absent')}
          </Typography>
        )}
        <ListItem
          classes={{
            icon: clsx(
              'bs-consumer-booking-details-card__teacher-section__avatar__icon',
              {
                'bs-consumer-booking-details-card__teacher-section__avatar__icon--sm':
                  hasCoachOverride,
              },
            ),
          }}
          className="bs-consumer-booking-details-card__teacher-section__list__item bs-consumer-booking-details-card__teacher-section__avatar"
          icon={
            <div
              className={clsx(
                'bs-consumer-booking-details-card__teacher-section__avatar__icon__container',
                {
                  'bs-consumer-booking-details-card__teacher-section__avatar__icon__container--empty':
                    !picture,
                },
              )}
            >
              {picture ? (
                <img alt="coach" src={picture} />
              ) : (
                <User01 stroke="currentColor" />
              )}
            </div>
          }
          label={name}
          size={hasCoachOverride ? 'sm' : 'lg'}
        />
      </List>
    );
  },
);

const ConsumerBookingDetailsCardTeacherSection: React.FC<Props> = ({
  coachPicture,
  coachOverridePicture,
  coachName,
  coachOverrideName,
  coachDescription,
  coachOverrideDescription,
  coachFacebookURL,
  coachInstagramURL,
}) => {
  const { t } = useTranslation('consumerSpace');

  if (coachOverrideName) {
    return (
      <ConsumerCardSection
        className="bs-consumer-booking-details-card__teacher-section"
        title={t('consumerSpace:reworked.myBookings.detailsCard.teacher.title')}
      >
        <OriginalTeacherAvatar
          hasCoachOverride={!!coachOverrideName}
          name={coachName}
          picture={coachPicture}
        />

        <div className="bs-consumer-booking-details-card__teacher-section__subtitute-section">
          <Typography variant="body-lg">
            {t(
              'consumerSpace:reworked.myBookings.detailsCard.teacher.subtitutedBy',
            )}
          </Typography>
          <ListItem
            classes={{
              icon: 'bs-consumer-booking-details-card__teacher-section__avatar__icon',
            }}
            className="bs-consumer-booking-details-card__teacher-section__list__item bs-consumer-booking-details-card__teacher-section__avatar"
            icon={
              <div
                className={clsx(
                  'bs-consumer-booking-details-card__teacher-section__avatar__icon__container',
                  {
                    'bs-consumer-booking-details-card__teacher-section__avatar__icon__container--empty':
                      !coachOverridePicture,
                  },
                )}
              >
                {coachOverridePicture ? (
                  <img alt="coach" src={coachOverridePicture} />
                ) : (
                  <User01 stroke="currentColor" />
                )}
              </div>
            }
            label={coachOverrideName}
          />

          {!!coachOverrideDescription && (
            <ConsumerCardDescription
              classes={{
                text: 'bs-consumer-booking-details-card__teacher-section__description',
              }}
              description={coachOverrideDescription}
            />
          )}
        </div>
      </ConsumerCardSection>
    );
  }

  return (
    <ConsumerCardSection
      className="bs-consumer-booking-details-card__teacher-section"
      title={t('consumerSpace:reworked.myBookings.detailsCard.teacher.title')}
    >
      <OriginalTeacherAvatar
        hasCoachOverride={!!coachOverrideName}
        name={coachName}
        picture={coachPicture}
      />

      {coachDescription && (
        <ConsumerCardDescription
          classes={{
            text: 'bs-consumer-booking-details-card__teacher-section__description',
          }}
          description={coachDescription}
        />
      )}

      <div
        className={clsx(
          'bs-consumer-booking-details-card__teacher-section__social',
          {
            'bs-consumer-booking-details-card__teacher-section__social--hidden':
              !coachFacebookURL && !coachInstagramURL,
          },
        )}
      >
        <IconButton
          className={clsx(
            'bs-consumer-booking-details-card__teacher-section__social__link',
            {
              'bs-consumer-booking-details-card__teacher-section__social__link--hidden':
                !coachFacebookURL,
            },
          )}
          color="grey"
          href={coachFacebookURL}
          size="md"
          target="_blank"
          variant="text"
        >
          <FacebookSquare className="bs-consumer-booking-details-card__teacher-section__social__link__icon" />
        </IconButton>

        <IconButton
          className={clsx(
            'bs-consumer-booking-details-card__section__social__link',
            {
              'bs-consumer-booking-details-card__section__social__link--hidden':
                !coachInstagramURL,
            },
          )}
          color="grey"
          href={coachInstagramURL}
          size="md"
          target="_blank"
          variant="text"
        >
          <InstagramSquare className="bs-consumer-booking-details-card__teacher-section__social__link__icon" />
        </IconButton>
      </div>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerBookingDetailsCardTeacherSection);
