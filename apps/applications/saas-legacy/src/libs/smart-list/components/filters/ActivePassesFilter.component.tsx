import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { createStyles, Theme, withStyles } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
  DURATION_COMPARATORS_DICT_BETWEEN,
  BETWEEN_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list.js';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import DelayedNumericInput from '#src/components/DelayedNumericInput.component';

import { PrivatePassListItem } from '#src/libs/private-service/components/pass/PrivatePassListItem.component';
import { PrivatePass } from '#src/libs/private-service/types';
import ToolTip from '#src/components/Tooltip.component';
import type { PaymentPack } from '../../../payment-packs/types';
// @ts-expect-error
import Selector from '../MultiSelector.component';
import PaymentPackListItem from '../../../payment-packs/components/PaymentPackListItem.component';
import { MaterialStyleType } from '../../../../utils/types';

type OwnProps = {
  filter_data: any;
  payment_packs: Array<PaymentPack>;
  private_passes: Array<PrivatePass>;
  onChange: (dict: any) => void;
  isNew: boolean;
  fetchItems: any;
  fetchBulkItems: any;
  renderSelectorWarning: (text: string, active: boolean) => void;

  setNotNullableData: (data: Array<string>) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export class ActivePassesFilter extends Component<Props> {
  componentDidMount() {
    if (
      this.props.filter_data?.payment_packs &&
      this.props.filter_data?.payment_packs.length === 1
    ) {
      this.props.fetchBulkItems.payment_packs(
        this.props.filter_data?.payment_packs,
      );
    }
    if (
      this.props.filter_data?.private_passes &&
      this.props.filter_data?.private_passes.length === 1
    ) {
      this.props.fetchBulkItems.private_passes(
        this.props.filter_data?.private_passes,
      );
    }
    this.props.setNotNullableData([
      'nb_active_passes_comparator',
      'nb_active_passes_value',
      'nb_active_passes_value_second',
      'payment_packs',
      'private_passes',
    ]);
    if (this.props.isNew) {
      this.props.onChange({
        payment_packs: null,
        private_passes: null,
        nb_active_passes_comparator: null,
        nb_active_passes_value: 1,
        nb_active_passes_value_second: 2,
      });
    }
  }

  render() {
    const { filter_data, t, classes, onChange, payment_packs, private_passes } =
      this.props;
    const sortName = (
      a: PaymentPack | PrivatePass,
      b: PaymentPack | PrivatePass,
    ) => (a?.name < b?.name ? -1 : 1);
    const sortedPaymentPacks = [...(payment_packs || [])].sort(sortName);
    const sortedFilterDataPaymentPacks = [
      ...(filter_data?.payment_packs || []),
    ].sort(sortName);
    const sortedPrivatePasses = [...(private_passes || [])].sort(sortName);
    const sortedFilterDataPrivatePasses = [
      ...(filter_data?.private_passes || []),
    ].sort(sortName);
    return (
      <div>
        <div className={classes.wrapper}>
          {t(`filters.${filter_data?.filter_identifier}.first`)}
          <Select
            required
            className={classes.input}
            onChange={(ev) =>
              onChange({ nb_active_passes_comparator: ev.target.value })
            }
            value={filter_data?.nb_active_passes_comparator}
          >
            {DURATION_COMPARATORS_DICT_BETWEEN.map((item) => (
              <MenuItem key={item.key} value={item.value}>
                {t(`filters.durations_comparators.${item.value}`)}
              </MenuItem>
            ))}
          </Select>
          <DelayedNumericInput
            isPositive
            classes={classes}
            InputProps={{ inputProps: { min: 0 } }}
            onChange={(ev) =>
              onChange({
                nb_active_passes_value:
                  ev.target.value === '' ? null : ev.target.value,
              })
            }
            value={filter_data?.nb_active_passes_value}
          />{' '}
          {filter_data?.nb_active_passes_comparator === BETWEEN_COMPARATOR
            ? t(`filters.${filter_data?.filter_identifier}.between`)
            : null}
          {filter_data?.nb_active_passes_comparator === BETWEEN_COMPARATOR ? (
            <DelayedNumericInput
              isPositive
              classes={classes}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(ev) =>
                onChange({
                  nb_active_passes_value_second:
                    ev.target.value === '' ? null : ev.target.value,
                })
              }
              value={filter_data?.nb_active_passes_value_second}
            />
          ) : null}
          {t(`filters.${filter_data?.filter_identifier}.second`)}
          <Selector
            fetchItems={this.props.fetchItems.payment_packs}
            helperAllSelectedText={t(
              'multiSelector.paymentPacks.helperAllSelectedText',
            )}
            helperSelectedText={t(
              'multiSelector.paymentPacks.helperSelectedText',
            )}
            helperText={t('multiSelector.activePasses.paymentPackHelperText')}
            items={sortedPaymentPacks}
            nameIdentifier="name"
            onChange={(items: PaymentPack[], selectAll: boolean) => {
              if (
                (sortedFilterDataPaymentPacks &&
                  !(
                    items.length === sortedFilterDataPaymentPacks.length &&
                    [...(items || [])].sort(sortName).every((value, index) => {
                      return value === sortedFilterDataPaymentPacks[index];
                    })
                  )) ||
                (!sortedFilterDataPaymentPacks && items.length > 0)
              ) {
                onChange({
                  payment_packs: items,
                  select_all_payment_packs: selectAll,
                });
              }
              // at least one of payment_packs or private_passes must not be empty, so we switch between [] and null to have valid/invalid data
              if (!(sortedFilterDataPrivatePasses?.length > 0)) {
                onChange({
                  private_passes: items?.length > 0 ? [] : null,
                });
              }
            }}
            renderItem={(item: PaymentPack) => {
              return <PaymentPackListItem pack={item} />;
            }}
            selectAll={this.props.filter_data?.select_all_payment_packs}
            selectedItems={sortedFilterDataPaymentPacks}
            textFieldPlaceholder={t(
              'multiSelector.paymentPacks.textFieldPlaceholder',
            )}
          />
          {t(`filters.${filter_data?.filter_identifier}.third`)}
          <Selector
            fetchItems={this.props.fetchItems.private_passes}
            helperAllSelectedText={t(
              'multiSelector.privatePass.helperAllSelectedText',
            )}
            helperSelectedText={t(
              'multiSelector.privatePass.helperSelectedText',
            )}
            helperText={t('multiSelector.activePasses.privatePassHelperText')}
            items={sortedPrivatePasses}
            nameIdentifier="name"
            onChange={(items: PrivatePass[], selectAll: boolean) => {
              if (
                (sortedFilterDataPrivatePasses &&
                  !(
                    items.length === sortedFilterDataPrivatePasses.length &&
                    [...(items || [])].sort(sortName).every((value, index) => {
                      return value === sortedFilterDataPrivatePasses[index];
                    })
                  )) ||
                (!sortedFilterDataPrivatePasses && items.length > 0)
              ) {
                onChange({
                  private_passes: items,
                  select_all_private_passes: selectAll,
                });
              }
              // at least one of payment_packs or private_passes must not be empty, so we switch between [] and null to have valid/invalid data
              if (!(sortedFilterDataPaymentPacks?.length > 0)) {
                onChange({
                  payment_packs: items?.length > 0 ? [] : null,
                });
              }
            }}
            renderItem={(item: PrivatePass) => {
              return <PrivatePassListItem removePaper pass={item} />;
            }}
            selectAll={this.props.filter_data?.select_all_private_passes}
            selectedItems={sortedFilterDataPrivatePasses}
            textFieldPlaceholder={t(
              'multiSelector.privatePass.textFieldPlaceholder',
            )}
          />
          {t(`filters.${filter_data?.filter_identifier}.fourth`)}
          <ToolTip
            aria-label="info"
            title={
              <Typography variant="subtitle2">
                {t(`filters.${filter_data?.filter_identifier}.info`)}
              </Typography>
            }
          >
            <IconButton>
              <InfoIcon />
            </IconButton>
          </ToolTip>
          {this.props.renderSelectorWarning(
            t('multiSelector.activePasses.warning'),
            !(
              sortedFilterDataPaymentPacks?.length > 0 ||
              sortedFilterDataPrivatePasses?.length > 0
            ),
          )}
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    input: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    textInput: {
      width: '50px',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
  });

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(ActivePassesFilter);
