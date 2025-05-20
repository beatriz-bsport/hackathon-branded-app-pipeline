import React from 'react';

import clsx from 'clsx';

import Typography from '#Fabrique/Typography';

import type { TypographyVariantType } from '#Fabrique/Typography/types';

import './styles.css';

type Props = {
  /** Optional title of the section */
  title?: string;
  /** Required section name to be able to target from CSS Editor */
  className: string;
  /** Optional class name to pass to the child elements (section title) */
  classes?: {
    title?: string;
    textContainer?: string;
    sectionContainer?: string;
  };
  /** The section content */
  children: React.ReactNode;
  /** Custom variant for title component */
  titleVariant?: TypographyVariantType;
  /** Optional subtitle of the section */
  subtitle?: string;
  /** If you want to include alerts to your component  */
  isWithAlert?: boolean;
  /** The alert components to display */
  alerts?: React.ReactNode[];
};

const ConsumerCardSection: React.FC<Props> = ({
  title,
  className,
  classes,
  children,
  titleVariant,
  subtitle,
  isWithAlert,
  alerts,
}) => {
  if (isWithAlert) {
    return (
      <section className={clsx('bs-consumer-card__section', className)}>
        <div
          className={clsx(
            'bs-consumer-card__section__container',
            { 'bs-consumer-card__section__container--hidden': !title },
            classes?.textContainer,
          )}
        >
          <div
            className={clsx(
              'bs-consumer-card__section__text-container',
              { 'bs-consumer-card__section__text-container--hidden': !title },
              classes?.textContainer,
            )}
          >
            <Typography
              className={clsx(
                'bs-consumer-card__section__title',
                {
                  'bs-consumer-card__section__title--hidden': !title,
                },
                classes?.title,
              )}
              variant={titleVariant || 'body-lg'}
            >
              {title}
            </Typography>
            <Typography
              className="bs-consumer-card__section__subtitle"
              variant="body-md"
            >
              {subtitle}
            </Typography>
          </div>
          {children}
        </div>
        <div
          className={clsx('bs-consumer-card__section__alerts', {
            'bs-consumer-card__section__alerts"--hidden': !!alerts,
          })}
        >
          {alerts &&
            alerts.map((alert, index) => (
              <div key={index} className="bs-consumer-card__section__alert">
                {alert}
              </div>
            ))}
        </div>
      </section>
    );
  }

  return (
    <section className={clsx('bs-consumer-card__section', className)}>
      <div
        className={clsx(
          'bs-consumer-card__section__text-container',
          { 'bs-consumer-card__section__text-container--hidden': !title },
          classes?.textContainer,
        )}
      >
        <Typography
          className={clsx(
            'bs-consumer-card__section__title',
            {
              'bs-consumer-card__section__title--hidden': !title,
            },
            classes?.title,
          )}
          variant={titleVariant || 'body-lg'}
        >
          {title}
        </Typography>
        <Typography
          className="bs-consumer-card__section__subtitle"
          variant="body-md"
        >
          {subtitle}
        </Typography>
      </div>
      {children}
    </section>
  );
};

export default React.memo(ConsumerCardSection);
