import React from 'react';
import Chip from '@material-ui/core/Chip';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { TFunction } from 'i18next';
import MaterialUISelector from '../../../components/Selector/MaterialUISelector.component';
import { MaterialStyleType } from '../../../utils/types';

export enum ManagerOnly {
  showAll = 0,
  showManagerOnly = 1,
  showManagerExclude = 2,
  showInvisibleForStaff = 3,
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

const managerOnlyOptions = (t: TFunction) => [
  { value: '0', label: t('selector.filterManagerOnly') },
  { value: '1', label: t('selector.managerOnly') },
  { value: '2', label: t('selector.noManagerOnly') },
  { value: '3', label: t('selector.unusableByStaff') },
];

const sortOptions = (t: TFunction) => [
  { value: '0', label: t('selector.sorting.ascendingPrice') },
  { value: '1', label: t('selector.sorting.descendingPrice') },
  { value: '2', label: t('selector.sorting.ascendingCredit') },
  { value: '3', label: t('selector.sorting.descendingCredit') },
  { value: '4', label: t('selector.sorting.customSort') },
];

export class PaymentPackFilterAndSortHeader extends React.PureComponent<Props> {
  // @ts-expect-error
  categoryFilterOnchange = (categories) => {
    this.props.categoryFilterOnchange(
      // @ts-expect-error
      categories.map((selected) => parseInt(selected.value, 10)),
    );
  };

  // @ts-expect-error
  managerOnlyOnChange = (value) =>
    this.props.managerOnlyOnChange(
      parseInt(value?.value || ManagerOnly.showAll, 10),
    );

  // @ts-expect-error
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
        alignItems="center"
        className={classes.title}
        direction="row"
        justify="center"
        spacing={2}
      >
        <Grid item md={4} xs={12}>
          <Typography className={classes.title}>
            {t('selector.titleCategory')}
          </Typography>
          <MaterialUISelector
            isMulti
            chipsRenderer={({ data, onDelete }) => (
              <Chip color="primary" label={data.label} onDelete={onDelete} />
            )}
            onChange={this.categoryFilterOnchange}
            options={this.props.categoryOptions}
            placeholder={t('selector.filterCategory')}
            value={this.props.categoryOptions.filter((option) =>
              this.props.categoryValue.includes(parseInt(option.value, 10)),
            )}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Typography className={classes.title}>
            {t('selector.titleManagerOnly')}
          </Typography>
          <MaterialUISelector
            isClearable
            isMulti={false}
            onChange={this.managerOnlyOnChange}
            options={managerOnlyOptions(this.props.t)}
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
            isClearable
            isMulti={false}
            onChange={this.sortOnChange}
            options={sortOptions(this.props.t)}
            placeholder={t('selector.sorting.customSort')}
            value={sortOptions(this.props.t).find(
              (option) => this.props.sortValue === parseInt(option.value, 10),
            )}
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
