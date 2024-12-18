import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ChipColor } from '#Fabrique/Chip';

import { Building05, PauseCircle, Users01 } from '#src/components/untitledui';

import { ConsumerGenericCardHeader } from '#src/libs/consumer-space/components/reworked/common/ConsumerCard';
import type { ConsumerPassCardProps } from '..';

type Props = Required<
  Pick<
    ConsumerPassCardProps,
    | 'creditsLeft'
    | 'isMultistudio'
    | 'isShared'
    | 'isSuspended'
    | 'isUnlimited'
    | 'passName'
    | 'totalCredits'
  >
>;

/**
 * `ConsumerPassCardHeader` is a React component that displays the header information for a consumer's pass.
 *
 * The component displays the pass name, whether it's shared or suspended, the number of credits left (if not unlimited),
 * and the total number of credits (if not unlimited). It uses the `ConsumerGenericCardHeader` component to display this information.
 */
const ConsumerPassCardHeader: React.FC<Props> = ({
  creditsLeft,
  isMultistudio,
  isShared,
  isSuspended,
  isUnlimited,
  passName,
  totalCredits,
}) => {
  const { t } = useTranslation('consumerSpace');
  const subtitle = isUnlimited
    ? t('reworked.myPasses.consumerPassCard.unlimited')
    : t('reworked.myPasses.consumerPassCard.credits', {
        creditsLeft,
        totalCredits,
      });
  const chipsDataList = React.useMemo(
    () => [
      {
        shouldDisplay: isShared,
        chipColor: 'grey' as ChipColor,
        leftIcon: <Users01 stroke="currentColor" />,
        text: t('reworked.myPasses.consumerPassCard.chip.shared'),
        chipClassName: 'bs-consumer__pass-card__header__chip',
      },
      {
        shouldDisplay: isSuspended,
        chipColor: 'warning' as ChipColor,
        leftIcon: <PauseCircle stroke="currentColor" />,
        text: t('reworked.myPasses.consumerPassCard.chip.suspended'),
        chipClassName: 'bs-consumer__pass-card__header__chip',
      },
      {
        shouldDisplay: isMultistudio,
        chipColor: 'info' as ChipColor,
        leftIcon: <Building05 stroke="currentColor" />,
        text: t('reworked.myPasses.consumerPassCard.chip.multiStudio'),
        chipClassName: 'bs-consumer__pass-card__header__chip',
      },
    ],
    [isMultistudio, isShared, isSuspended, t],
  );
  return (
    <ConsumerGenericCardHeader
      chipsDataList={chipsDataList}
      chipsWrapperClassName="bs-consumer__pass-card__header__chips-wrapper"
      className="bs-consumer__pass-card__header"
      subtitle={subtitle}
      title={passName}
    />
  );
};

export default React.memo(ConsumerPassCardHeader);
