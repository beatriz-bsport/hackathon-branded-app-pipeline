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
      justify="center"
      direction="row"
      alignItems="center"
      spacing={2}
      style={{ marginBottom: 8 }}
    >
      <Grid item md={3} xs={12}>
        <Typography variant="body2" style={{ marginBottom: 4 }}>
          {t('filters.titleCategory')}
        </Typography>
        <MaterialUISelector
          options={props.categoryOptions}
          onChange={props.categoryFilterOnChange}
          value={props.categoryValue}
          isMulti
          chipsRenderer={({ data, onDelete }) => (
            <Chip color="primary" label={data.label} onDelete={onDelete} />
          )}
          placeholder={t('filters.filterCategory')}
        />
      </Grid>
      <Grid item md={3} xs={12}>
        <Typography variant="body2" style={{ marginBottom: 4 }}>
          {t('filters.titleSupplier')}
        </Typography>
        <MaterialUISelector
          options={props.supplierOptions}
          onChange={props.supplierFilterOnChange}
          value={props.supplierValue}
          isMulti
          chipsRenderer={({ data, onDelete }) => (
            <Chip color="primary" label={data.label} onDelete={onDelete} />
          )}
          placeholder={t('filters.filterSupplier')}
        />
      </Grid>
      <Grid item md={3} xs={12}>
        <Typography variant="body2" style={{ marginBottom: 4 }}>
          {t('filters.titleStaff')}
        </Typography>
        <MaterialUISelector
          options={props.staffOptions}
          onChange={props.staffFilterOnChange}
          value={props.staffValue}
          isMulti
          chipsRenderer={({ data, onDelete }) => (
            <Chip color="primary" label={data.label} onDelete={onDelete} />
          )}
          placeholder={t('filters.filterStaff')}
        />
      </Grid>
      <Grid item md={3} xs={12} style={{ alignSelf: 'end', marginBottom: 6 }}>
        <FormControlLabel
          control={
            <Switch
              checked={props.showFuture}
              onChange={() => props.setShowFuture(!props.showFuture)}
              color="primary"
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
