// @flow

import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withTranslation } from 'react-i18next';
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
    marginRight: theme.spacing(1),
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

export default withTranslation([])(withStyles(styles)(LevelInput));
