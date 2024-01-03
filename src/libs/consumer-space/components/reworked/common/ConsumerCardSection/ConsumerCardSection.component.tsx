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
  classes?: { title: string };
  /** The section content */
  children: React.ReactNode;
  /** Custom variant for title component */
  titleVariant?: TypographyVariantType;
};

const ConsumerCardSection: React.FC<Props> = ({
  title,
  className,
  classes,
  children,
  titleVariant,
}) => (
  <section className={classNames('bs-consumer-card__section', className)}>
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

    {children}
  </section>
);

export default React.memo(ConsumerCardSection);
