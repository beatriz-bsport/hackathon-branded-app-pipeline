import last from 'lodash/last';
import sortBy from 'lodash/sortBy';
import React, { memo, useCallback, useMemo } from 'react';

import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import {
  BONUS_COACH_PAYMENT_RULE_FIXED_VLAUE,
  BONUS_COACH_PAYMENT_RULE_EVERY_BOOKING,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import type { BonusCoachPaymentRule } from '../types';
// @ts-expect-error
import { bonusCoachPaymentRuleConstructor } from '../utils';

type Props = {
  anchorEl: Element;
  setAnchorEl: (anchorEl: Element | null) => void;
  bonusesSortByApplicability: {
    [applicability: string]: BonusCoachPaymentRule[];
  };
  bonusCreationApplicability?: string;
  id: number;
};

const PopoverCoachPaymentRuleForm: React.FC<Props> = ({
  anchorEl,
  setAnchorEl,
  bonusCreationApplicability,
  bonusesSortByApplicability,
  id,
}) => {
  const { t } = useTranslation('paymentRules');

  const getLowerIntervalFilter = useMemo(
    () =>
      last(
        sortBy(
          bonusesSortByApplicability[bonusCreationApplicability],
          'lower_interval',
        ),
      ),
    [bonusesSortByApplicability, bonusCreationApplicability],
  );

  const handleSortBonusesByApplicability = useCallback(
    (kind: number) => {
      bonusesSortByApplicability[bonusCreationApplicability].push(
        bonusCoachPaymentRuleConstructor(id, {
          applicability: bonusCreationApplicability,
          kind,
          lower_interval: getLowerIntervalFilter
            ? parseInt(getLowerIntervalFilter.upper_interval.toString()) + 1
            : 0,
        }),
      );

      setAnchorEl(null);
    },
    [
      bonusesSortByApplicability,
      id,
      setAnchorEl,
      bonusCreationApplicability,
      getLowerIntervalFilter,
    ],
  );

  const handleClickFixedBonusByInterval = useCallback(
    () =>
      handleSortBonusesByApplicability(BONUS_COACH_PAYMENT_RULE_FIXED_VLAUE),
    [handleSortBonusesByApplicability],
  );

  const handleClickBonusForEachReservationInInterval = useCallback(
    () =>
      handleSortBonusesByApplicability(BONUS_COACH_PAYMENT_RULE_EVERY_BOOKING),
    [handleSortBonusesByApplicability],
  );

  return (
    <Popover
      id="bonus-popover"
      open={!!anchorEl}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      disableRestoreFocus
      onClose={() => setAnchorEl(null)}
    >
      <List dense>
        <ListItem button onClick={handleClickFixedBonusByInterval}>
          <Typography>
            {t('coach_payment_rules.fixedBonusbyInterval')}
          </Typography>
        </ListItem>
        <ListItem button onClick={handleClickBonusForEachReservationInInterval}>
          <Typography>
            {t('coach_payment_rules.bonusForEachReservationInInterval')}
          </Typography>
        </ListItem>
      </List>
    </Popover>
  );
};

export default memo(PopoverCoachPaymentRuleForm);
