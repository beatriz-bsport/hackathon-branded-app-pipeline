import React from 'react';

import classNames from 'classnames';

import Typography from '#Fabrique/Typography';

import type { TypographyVariantType } from '#Fabrique/Typography/types';

import './styles.css';

type Props = {
  /** Optional title of the section */
  title?: string;
  /** Required section name to be able to target from CSS Editor */
  className: string;
  /** Optional class name to pass to the child elements (section title) */
  classes?: { title?: string; textContainer?: string };
  /** The section content */
  children: React.ReactNode;
  /** Custom variant for title component */
  titleVariant?: TypographyVariantType;
  /** Optional subtitle of the section */
  subtitle?: string;
};

const ConsumerCardSection: React.FC<Props> = ({
  title,
  className,
  classes,
  children,
  titleVariant,
  subtitle,
}) => (
  <section className={classNames('bs-consumer-card__section', className)}>
    <div
      className={classNames(
        'bs-consumer-card__section__text-container',
        { 'bs-consumer-card__section__text-container--hidden': !title },
        classes?.textContainer,
      )}
    >
      <Typography
        className={classNames(
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

export default React.memo(ConsumerCardSection);
