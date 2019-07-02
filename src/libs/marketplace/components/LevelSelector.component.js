// @flow

import React from 'react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import type { TFunction } from 'react-i18next';
import LEVELS from '@bsport/common/lib/master-data/levels';

import Selector from '../../../components/Selector.component';
import type { Suggestion } from '../../../components/Selector.component';

import type { Level } from '../types';

type Props = {
  t: TFunction,
  selected: number,
  onChange: (Suggestion) => void,
  classes: { [string]: string },
  isOverride?: boolean,
};

export function LevelSelector(props: Props) {
  const { t, isOverride, selected, onChange, classes } = props;
  const suggestions = LEVELS.map((lvl) => ({
    value: lvl.id,
    label: lvl.text,
  }));
  return (
    <Selector
      searchIcon
      className={classes.root}
      suggestions={suggestions}
      selected={selected}
      placeholder={
        isOverride ? t('select.placeholderOverride') : t('select.placeholder')
      }
      onChange={onChange}
    />
  );
}

const styles = () => ({
  root: {},
});

export default withStyles(styles)(
  withNamespaces(['marketplace'])(LevelSelector),
);
