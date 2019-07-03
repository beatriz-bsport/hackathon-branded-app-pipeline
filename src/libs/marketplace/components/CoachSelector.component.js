// @flow

import React from 'react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import type { TFunction } from 'react-i18next';

import Selector from '../../../components/Selector.component';
import type { Suggestion } from '../../../components/Selector.component';

import type { Coach } from '../types';

type Props = {
  t: TFunction,
  selected: number,
  onChange: (Suggestion) => void,
  classes: { [string]: string },
  coaches: Coach[],
  isOverride?: boolean,
};

export function CoachSelector(props: Props) {
  const { t, coaches, isOverride, selected, onChange, classes } = props;
  const suggestions = coaches.asMutable().map((c) => ({
    value: c.id,
    label: c.name || 'no name',
    coach: c,
  }));
  return (
    <Selector
      searchIcon
      isMulti
      className={classes.root}
      suggestions={suggestions}
      selected={selected}
      placeholder={t('selector.coach.placeholder')}
      onChange={onChange}
    />
  );
}

const styles = () => ({
  root: {},
});

export default withStyles(styles)(withNamespaces('marketplace')(CoachSelector));
