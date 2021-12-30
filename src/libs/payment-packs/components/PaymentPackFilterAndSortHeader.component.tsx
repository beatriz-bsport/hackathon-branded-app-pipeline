import React from 'react';
import Chip from '@material-ui/core/Chip';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import memoize from 'memoize-one';
import Typography from '@material-ui/core/Typography';
import MaterialUISelector from '../../../components/Selector/MaterialUISelector.component';
import { MaterialStyleType } from '../../../utils/types';

export enum ManagerOnly {
  showAll = 0,
  showManagerOnly = 1,
  showManagerExclude = 2,
}

export enum SortOption {
  ascendingPrice = 0,
  descendingPrice = 1,
  ascendingCredit = 2,
  descendingCredit = 3,
  customSort = 4,
}

type OwnProps = {
  categoryOptions: Array<{ value: string; label: string }>;
  categoryFilterOnchange: (value: Array<number>) => void;
  managerOnlyOnChange: (value: number) => void;
  sortOnChange: (value: number) => void;
  categoryValue: Array<number>;
  managerOnlyValue: ManagerOnly;
  sortValue: SortOption | null;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const managerOnlyOptions = memoize((t) => [
  { value: '0', label: t('selector.filterManagerOnly') },
  { value: '1', label: t('selector.managerOnly') },
  { value: '2', label: t('selector.noManagerOnly') },
]);

const sortOptions = memoize((t) => [
  { value: '0', label: t('selector.sorting.ascendingPrice') },
  { value: '1', label: t('selector.sorting.descendingPrice') },
  { value: '2', label: t('selector.sorting.ascendingCredit') },
  { value: '3', label: t('selector.sorting.descendingCredit') },
  { value: '4', label: t('selector.sorting.customSort') },
]);

export class PaymentPackFilterAndSortHeader extends React.PureComponent<Props> {
  categoryFilterOnchange = (categories) => {
    this.props.categoryFilterOnchange(
      categories.map((selected) => parseInt(selected.value, 10)),
    );
  };

  managerOnlyOnChange = (value) =>
    this.props.managerOnlyOnChange(
      parseInt(value?.value || ManagerOnly.showAll, 10),
    );

  sortOnChange = (sortOpt) => {
    this.props.sortOnChange(
      parseInt(sortOpt?.value || SortOption.customSort, 10),
    );
  };

  render() {
    const { t, classes } = this.props;
    return (
      <Grid
        container
        justify="center"
        direction="row"
        alignItems="center"
        spacing={2}
        className={classes.title}
      >
        <Grid item md={4} xs={12}>
          <Typography className={classes.title}>
            {t('selector.titleCategory')}
          </Typography>
          <MaterialUISelector
            options={this.props.categoryOptions}
            onChange={this.categoryFilterOnchange}
            value={this.props.categoryOptions.filter((option) =>
              this.props.categoryValue.includes(parseInt(option.value, 10)),
            )}
            isMulti
            chipsRenderer={({ data, onDelete }) => (
              <Chip color="primary" label={data.label} onDelete={onDelete} />
            )}
            placeholder={t('selector.filterCategory')}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Typography className={classes.title}>
            {t('selector.titleManagerOnly')}
          </Typography>
          <MaterialUISelector
            options={managerOnlyOptions(this.props.t)}
            onChange={this.managerOnlyOnChange}
            isMulti={false}
            isClearable
            value={managerOnlyOptions(this.props.t).find(
              (option) =>
                this.props.managerOnlyValue === parseInt(option.value, 10),
            )}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Typography className={classes.title}>
            {t('selector.titleSort')}
          </Typography>
          <MaterialUISelector
            options={sortOptions(this.props.t)}
            onChange={this.sortOnChange}
            isMulti={false}
            isClearable
            value={sortOptions(this.props.t).find(
              (option) => this.props.sortValue === parseInt(option.value, 10),
            )}
            placeholder={t('selector.sorting.customSort')}
          />
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme: Theme) => ({
  title: {
    marginBottom: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  withTranslation('paymentPack'),
  withStyles(styles),
)(PaymentPackFilterAndSortHeader);
