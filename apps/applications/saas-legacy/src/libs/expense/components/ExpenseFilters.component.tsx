import React from 'react';
import Chip from '@material-ui/core/Chip';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MaterialUISelector from '../../../components/Selector/MaterialUISelector.component';

type Props = {
  categoryOptions: Array<{ value: string; label: string }>;
  categoryFilterOnChange: (
    categories: Array<{ value: string; label: string }>,
  ) => void;
  supplierOptions: Array<{ value: string; label: string }>;
  supplierFilterOnChange: (
    suppliers: Array<{ value: string; label: string }>,
  ) => void;
  staffOptions: Array<{ value: number; label: string }>;
  staffFilterOnChange: (staff: Array<{ value: number; label: string }>) => void;
  categoryValue: Array<{ value: string; label: string }>;
  supplierValue: Array<{ value: string; label: string }>;
  staffValue: Array<{ value: number; label: string }>;
  showFuture: boolean;
  setShowFuture: (showFuture: boolean) => void;
};

export const ExpenseFilters = (props: Props) => {
  const { t } = useTranslation(['expense']);
  return (
    <Grid
      container
      alignItems="center"
      direction="row"
      justify="center"
      spacing={2}
      style={{ marginBottom: 8 }}
    >
      <Grid item md={3} xs={12}>
        <Typography style={{ marginBottom: 4 }} variant="body2">
          {t('filters.titleCategory')}
        </Typography>
        <MaterialUISelector
          isMulti
          chipsRenderer={({ data, onDelete }) => (
            <Chip color="primary" label={data.label} onDelete={onDelete} />
          )}
          onChange={props.categoryFilterOnChange}
          options={props.categoryOptions}
          placeholder={t('filters.filterCategory')}
          value={props.categoryValue}
        />
      </Grid>
      <Grid item md={3} xs={12}>
        <Typography style={{ marginBottom: 4 }} variant="body2">
          {t('filters.titleSupplier')}
        </Typography>
        <MaterialUISelector
          isMulti
          chipsRenderer={({ data, onDelete }) => (
            <Chip color="primary" label={data.label} onDelete={onDelete} />
          )}
          onChange={props.supplierFilterOnChange}
          options={props.supplierOptions}
          placeholder={t('filters.filterSupplier')}
          value={props.supplierValue}
        />
      </Grid>
      <Grid item md={3} xs={12}>
        <Typography style={{ marginBottom: 4 }} variant="body2">
          {t('filters.titleStaff')}
        </Typography>
        <MaterialUISelector
          isMulti
          chipsRenderer={({ data, onDelete }) => (
            <Chip color="primary" label={data.label} onDelete={onDelete} />
          )}
          onChange={props.staffFilterOnChange}
          options={props.staffOptions}
          placeholder={t('filters.filterStaff')}
          value={props.staffValue}
        />
      </Grid>
      <Grid item md={3} style={{ alignSelf: 'end', marginBottom: 6 }} xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={props.showFuture}
              color="primary"
              onChange={() => props.setShowFuture(!props.showFuture)}
            />
          }
          label={t('filters.showFuture')}
          labelPlacement="end"
        />
      </Grid>
    </Grid>
  );
};

export default ExpenseFilters;
