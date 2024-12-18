import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { FABRIQUE_TYPOGRAPHY_BODY_MD_TWO_LINES_HEIGHT } from '#Fabrique/constants';
import Typography from '#Fabrique/Typography';
import Button from '#Fabrique/ButtonV2';
import Collapse from '#Fabrique/Collapse';

import './styles.css';

type Props = {
  /** Optional CSS classes passed to child elements */
  classes?: {
    text?: string;
    button?: string;
  };
  /** Text that goes in the section content */
  description?: string;
};

const ConsumerCardDescription: React.FC<Props> = ({ classes, description }) => {
  const { t } = useTranslation('consumerSpace');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleShowMore = useCallback(
    () => setIsExpanded((state) => !state),
    [],
  );

  return (
    <>
      <Collapse
        classes={{
          content: classNames(
            'bs-consumer-card-description__collapse-content',
            {
              'bs-consumer-card-description__collapse-content--expanded':
                isExpanded,
            },
          ),
        }}
        collapsedHeight={FABRIQUE_TYPOGRAPHY_BODY_MD_TWO_LINES_HEIGHT}
        isExpanded={isExpanded}
      >
        <Typography
          className={classNames(
            'bs-consumer-card-description__collapse__text',
            {
              'bs-consumer-card-description__collapse__text--hidden':
                !description,
            },
            classes?.text,
          )}
          variant="body-md"
        >
          {description}
        </Typography>
      </Collapse>

      <Button
        className={classNames(
          'bs-consumer-card-description__show-more',
          classes?.button,
        )}
        color="grey"
        onClick={handleShowMore}
        size="sm"
        variant="text"
      >
        {isExpanded
          ? t('consumerSpace:reworked.showLess')
          : t('consumerSpace:reworked.showMore')}
      </Button>
    </>
  );
};

export default React.memo(ConsumerCardDescription);
