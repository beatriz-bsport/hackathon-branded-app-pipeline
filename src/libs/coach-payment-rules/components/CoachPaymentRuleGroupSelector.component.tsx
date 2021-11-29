// @flow

import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Selector, { Suggestion } from '../../../components/Selector.component';
import { CoachPaymentRuleGroup } from '../types';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  selected: number;
  onChange: (Suggestion: Suggestion) => void;
  coachPaymentRuleGroupsList: Array<CoachPaymentRuleGroup>;
  isOverride?: boolean;
  id: string;
  enableReset?: boolean;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export const CoachPaymentRuleGroupSelector = (props: Props) => {
  const {
    t,
    coachPaymentRuleGroupsList,
    isOverride,
    selected,
    onChange,
    classes,
    enableReset,
  } = props;

  const suggestions = (coachPaymentRuleGroupsList || []).map(
    (s: CoachPaymentRuleGroup) => ({
      value: s.id,
      label: s.name,
    }),
  );
  if (enableReset) {
    suggestions.push({
      value: -8000,
      label: (
        <Typography color="error" variant="subtitle2">
          {t('select.reset')}
        </Typography>
      ),
    });
  }
  return (
    <div>
      <Selector
        id={props.id}
        className={classes.root}
        suggestions={suggestions}
        selected={selected}
        nullCurrentValue={!selected}
        placeholder={
          isOverride ? t('select.placeholderOverride') : t('select.placeholder')
        }
        onChange={onChange}
      />
    </div>
  );
};

const styles = () => ({
  root: {
    minWidth: 200,
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['paymentRules']),
)(CoachPaymentRuleGroupSelector);
