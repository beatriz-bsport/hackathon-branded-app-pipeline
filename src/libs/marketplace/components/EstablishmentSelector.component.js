// @flow

import React from 'react';
import { withNamespaces } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import type { TFunction } from 'react-i18next';

import Selector from '../../../components/Selector.component';
import type { Suggestion } from '../../../components/Selector.component';

import type { Establishment } from '../types';

type Props = {
  t: TFunction,
  selected: number,
  onChange: (Suggestion) => void,
  classes: { [string]: string },
  establishments: Establishment[],
  isOverride?: boolean,
};

export function EstablishmentSelector(props: Props) {
  const { t, establishments, isOverride, selected, onChange, classes } = props;
  const suggestions = establishments.asMutable().map((es) => ({
    value: es.id,
    label: es.title,
  }));
  return (
    <Selector
      searchIcon
      isMulti
      className={classes.root}
      suggestions={suggestions}
      selected={selected}
      placeholder={t('selector.establishment.placeholder')}
      onChange={onChange}
    />
  );
}

const styles = () => ({
  root: {},
});

export default withStyles(styles)(
  withNamespaces('marketplace')(EstablishmentSelector),
);
