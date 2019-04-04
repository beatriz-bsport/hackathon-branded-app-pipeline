// @flow

import React from 'react';

import {
  withStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import LEVELS from '@bsport/common/lib/master-data/levels';

import { Level } from '../category';

type Props = {
  classes: Object,
  value: ?number,
  onChange: (*) => void,
  required: ?boolean,
  t: TFunction,
};
const styles = (theme) => ({
  formControl: {
    minWidth: 140,
    marginRight: theme.spacing.unit,
  },
});

export function LevelInput(props: Props) {
  const { classes, value, onChange, required, t } = props;
  return (
    <FormControl
      className={classes.formControl}
      required={required}
      margin="normal"
    >
      <InputLabel htmlFor="level-helper">{t('form.level')}</InputLabel>
      <Select name="level" value={value} onChange={onChange}>
        {LEVELS.map((l) => (
          <MenuItem value={l.id}>
            <Level levelId={l.id} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default withNamespaces([])(withStyles(styles)(LevelInput));
