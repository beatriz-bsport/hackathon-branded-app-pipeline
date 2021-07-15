// @flow

import React from 'react';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Selector from '../../../components/Selector.component';
import type { Suggestion } from '../../../components/Selector.component';
import type { CoachPaymentRule } from '../types';

type Props = {
  t: TFunction,
  selected: number,
  onChange: (Suggestion) => void,
  classes: { [string]: string },
  privateSlotList: Array<CoachPaymentRule>,
  isOverride?: boolean,
  id: string,
  enableReset?: boolean,
  disabled: boolean,
};

export function PrivateSlotSelector(props: Props) {
  const {
    t,
    privateSlotList,
    isOverride,
    selected,
    onChange,
    classes,
    enableReset,
    disabled,
  } = props;
  const suggestions = (privateSlotList || []).map((s) => ({
    value: s.id,
    label: s.name,
  }));
  if (enableReset) {
    suggestions.push({
      value: -9999,
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
        isDisabled={disabled}
      />
    </div>
  );
}

const styles = () => ({
  root: {
    minWidth: 200,
  },
});

export default withStyles(styles)(
  withTranslation(['paymentRules'])(PrivateSlotSelector),
);
