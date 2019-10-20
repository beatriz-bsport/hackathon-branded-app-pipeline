// @flow

import lodash from 'lodash';

import React from 'react';
import { compose } from 'recompose';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import * as Yup from 'yup';
import { withFormik, FieldArray } from 'formik';

import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import Typography from '@material-ui/core/Typography';

import {
  TextField,
  PriceField,
  CheckboxField,
} from '../../../components/forms';

import type { PaymentRule } from '../types';

type Props = { t: TFunction, classes: * } & PaymentRule & {
    onSubmit: (PaymentRule) => void,
  };

export function PaymentRuleFields(props: Props) {
  const { t, classes, setFieldValue } = props;
  return (
    <div>
      <TextField name="name" label={t('name')} required fullWidth />
      <PriceField
        name="base_price"
        label={t('base_price')}
        required
        fullWidth
      />
      <CheckboxField name="only_attendant" label={t('only_attendant')} />
      <Typography variant="subtitle2">{t('rules')}</Typography>
      <FieldArray name="bonuses">
        {({
          push,
          remove,
          form: {
            values: { bonuses },
          },
        }) => (
          <div>
            <Table padding="dense">
              <TableHead>
                <TableRow classes={lodash.pick(classes, ['root'])}>
                  <TableCell padding="none">{t('bookingThreshold')}</TableCell>
                  <TableCell padding="none">
                    {t('pricePerAdditionalBooking')}
                  </TableCell>
                  <TableCell padding="none" />
                </TableRow>
              </TableHead>
              <TableBody>
                {bonuses.map((bonus, i) => (
                  <TableRow
                    key={bonus.id}
                    classes={lodash.pick(classes, ['root'])}
                  >
                    <TableCell className={classes.dense}>
                      <TextField
                        type="number"
                        name={`bonuses.${i}.threshold`}
                        onBlur={() => {
                          setFieldValue(
                            'bonuses',
                            lodash.sortBy(bonuses, 'threshold'),
                          );
                        }}
                        InputProps={{
                          inputProps: { min: 0 },
                          startAdornment: (
                            <InputAdornment position="start">⩾</InputAdornment>
                          ),
                        }}
                        margin="dense"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell className={classes.dense}>
                      <PriceField
                        name={`bonuses.${i}.variable_bonus`}
                        margin="dense"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell className={classes.dense}>
                      <IconButton onClick={() => remove(i)} aria-label="Delete">
                        <ClearIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              onClick={() => {
                const max = lodash.maxBy(bonuses, 'variable_bonus');
                push({
                  id: Math.ceil(-Math.random() * 10000),
                  threshold: lodash.sumBy(bonuses, 'threshold') + 5,
                  variable_bonus:
                    (max || { variable_bonus: 0 }).variable_bonus + 1,
                });
              }}
              color="secondary"
            >
              <AddIcon className={classes.leftButton} />
              {t('addBonus')}
            </Button>
          </div>
        )}
      </FieldArray>
    </div>
  );
}
const styles = (theme) => ({
  rulesContainer: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  root: {
    height: theme.spacing.unit * 4,
  },
  dense: {
    paddingLeft: 0,
  },
});

const BonusSchema = Yup.object().shape({
  threshold: Yup.number().min(0),
  variable_bonus: Yup.number().min(0),
});

export const PaymentRuleFieldsSchema = Yup.object().shape({
  name: Yup.string().required(),
  base_price: Yup.number()
    .integer()
    .min(0),
  only_attendant: Yup.boolean(),
  bonuses: Yup.array().of(BonusSchema),
});

export const PaymentRuleFormHoc = withFormik({
  mapPropsToValues: ({ initial }) =>
    initial || {
      name: '',
      base_price: 10,
      only_attendant: false,
      bonuses: [],
    },
  validationSchema: PaymentRuleFieldsSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default compose(
  withNamespaces(['paymentRules']),
  withStyles(styles),
)(PaymentRuleFields);
