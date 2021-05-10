import lodash from 'lodash';
import React from 'react';

import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import type { Tfunction } from 'react-i18next';
import {
  BONUS_COACH_PAYMENT_RULE_FIXED_VLAUE,
  BONUS_COACH_PAYMENT_RULE_EVERY_BOOKING,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import type { BonusCoachPaymentRule } from '../types';
import { bonusCoachPaymentRuleConstructor } from '../utils';

type Props = {
  anchorEl: boolean,
  setAnchorEl: () => void,
  bonusesSortByApplicability: object<BonusCoachPaymentRule>,
  bonusCreationApplicability: ?String,
  id: Number,
  t: Tfunction,
};
const PopoverCoachPaymentRuleForm = (props: Props) => {
  const {
    anchorEl,
    setAnchorEl,
    bonusCreationApplicability,
    bonusesSortByApplicability,
    id,
    t,
  } = props;
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
        <ListItem
          button
          onClick={() => {
            bonusesSortByApplicability[bonusCreationApplicability].push(
              bonusCoachPaymentRuleConstructor(id, {
                applicability: bonusCreationApplicability,
                kind: BONUS_COACH_PAYMENT_RULE_FIXED_VLAUE,
                lower_interval: lodash.last(
                  lodash.sortBy(
                    bonusesSortByApplicability[bonusCreationApplicability],
                    'lower_interval',
                  ),
                )
                  ? lodash.last(
                      lodash.sortBy(
                        bonusesSortByApplicability[bonusCreationApplicability],
                        'lower_interval',
                      ),
                    ).upper_interval + 1
                  : 0,
              }),
            );
            setAnchorEl(null);
          }}
        >
          <Typography>
            {t('coach_payment_rules.fixedBonusbyInterval')}
          </Typography>
        </ListItem>
        <ListItem
          button
          onClick={() => {
            bonusesSortByApplicability[bonusCreationApplicability].push(
              bonusCoachPaymentRuleConstructor(id, {
                applicability: bonusCreationApplicability,
                kind: BONUS_COACH_PAYMENT_RULE_EVERY_BOOKING,
                lower_interval: lodash.last(
                  lodash.sortBy(
                    bonusesSortByApplicability[bonusCreationApplicability],
                    'lower_interval',
                  ),
                )
                  ? lodash.last(
                      lodash.sortBy(
                        bonusesSortByApplicability[bonusCreationApplicability],
                        'lower_interval',
                      ),
                    ).upper_interval + 1
                  : 0,
              }),
            );
            setAnchorEl(null);
          }}
        >
          <Typography>
            {t('coach_payment_rules.bonusForEachReservationInInterval')}
          </Typography>
        </ListItem>
      </List>
    </Popover>
  );
};

export default PopoverCoachPaymentRuleForm;
