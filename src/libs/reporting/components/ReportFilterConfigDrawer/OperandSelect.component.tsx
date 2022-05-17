import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles, Typography } from '@material-ui/core';

import { GROUP_AND_OPERAND, GROUP_OR_OPERAND } from '../../constants';

import { MaterialUiSingleSelectorField } from '#libs/custom-form/components/GenericFormik.input';

const OperandSelect: React.FC<{
  name: string;
  isPreview: boolean;
}> = ({ name, isPreview }) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();

  const options = useMemo(
    () => [
      {
        value: GROUP_OR_OPERAND,
        label: t(`filter.form.groupOperand.${GROUP_OR_OPERAND}`),
      },
      {
        value: GROUP_AND_OPERAND,
        label: t(`filter.form.groupOperand.${GROUP_AND_OPERAND}`),
      },
    ],
    [t],
  );

  return (
    <div className={classes.row}>
      <Typography className={classes.operandSelectLabel}>
        {t('filter.form.operandSelect')}
      </Typography>
      <MaterialUiSingleSelectorField
        options={options}
        className={classes.operandSelect}
        name={name}
        inScrollBar
        isDisabled={isPreview}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  operandSelect: {
    minWidth: 120,
  },
  operandSelectLabel: {
    whiteSpace: 'nowrap',
  },
}));

export default OperandSelect;
