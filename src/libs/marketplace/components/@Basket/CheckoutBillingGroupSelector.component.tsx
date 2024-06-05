import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import memoize from 'lodash/memoize';
import Select from 'react-select';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';

import type { EstablishmentBillingGroup } from '#src/libs/establishment/types';

type Props = {
  enableMultiLocalization: boolean;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  selectedEstablishmentBillingGroup: EstablishmentBillingGroup;
  setIsEstablishmentBillingGroupSelected: (
    isEstablishmentBillingGroupSelected: boolean,
  ) => void;
  setSelectedEstablishmentBillingGroup: (
    value: React.SetStateAction<EstablishmentBillingGroup>,
  ) => void;
};

/**
 * Functional component that renders a billing group selector in the marketplace.
 *
 * @param {boolean} props.enableMultiLocalization - Flag to enable multi localization. If false, the selector is hidden.
 * @param {Array} props.establishmentBillingGroups - The list of establishment billing groups.
 * @param {Object} props.selectedEstablishmentBillingGroup - The selected establishment billing group.
 * @param {Function} props.setSelectedEstablishmentBillingGroup - Function to set the selected establishment billing group.
 * @param {Function} props.setIsEstablishmentBillingGroupSelected - Function to set if an establishment billing group is selected.
 *
 * @returns {ReactElement} Returns a billing group selector component.
 */
const CheckoutBillingGroupSelector: React.FC<Props> = ({
  enableMultiLocalization,
  establishmentBillingGroups,
  selectedEstablishmentBillingGroup,
  setIsEstablishmentBillingGroupSelected,
  setSelectedEstablishmentBillingGroup,
}) => {
  const getEstablishmentBillingGroupById = React.useMemo(
    () =>
      memoize((establishmentBillingGroupId: number) =>
        establishmentBillingGroups.find(
          (establishmentBillingGroup) =>
            establishmentBillingGroup.id === establishmentBillingGroupId,
        ),
      ),
    [establishmentBillingGroups],
  );

  const handleSelectEstablishmentBillingGroup = useCallback(
    (newOption) => {
      setSelectedEstablishmentBillingGroup?.(
        getEstablishmentBillingGroupById(newOption.value),
      );
      setIsEstablishmentBillingGroupSelected?.(true);
    },
    [
      getEstablishmentBillingGroupById,
      setIsEstablishmentBillingGroupSelected,
      setSelectedEstablishmentBillingGroup,
    ],
  );

  const { t } = useTranslation('checkout');
  const classes = useStyles();
  const billingGroupOptions = React.useMemo(
    () =>
      establishmentBillingGroups?.reduce(
        (acc, establishmentBillingGroup) => [
          ...acc,
          {
            label: establishmentBillingGroup.name,
            value: establishmentBillingGroup.id,
          },
        ],
        [],
      ),
    [establishmentBillingGroups],
  );
  return enableMultiLocalization && establishmentBillingGroups?.length ? (
    <div>
      <Typography className={classes.title} variant="h6">
        {t('billingGroup.title')}
      </Typography>
      <Select
        className={classes.select}
        isSearchable={false}
        onChange={handleSelectEstablishmentBillingGroup}
        options={[...billingGroupOptions]}
        placeholder={t('billingGroup.placeholder')}
        value={
          selectedEstablishmentBillingGroup
            ? {
                value: selectedEstablishmentBillingGroup.id,
                label: selectedEstablishmentBillingGroup.name,
              }
            : null
        }
      />
      <Typography className={classes.helperText} variant="caption">
        {t('billingGroup.helperText')}
      </Typography>
    </div>
  ) : null;
};

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(1),
  },
  select: {
    marginBottom: theme.spacing(1),
  },
  helperText: {
    color: theme.palette.grey[600],
  },
}));

export default React.memo(CheckoutBillingGroupSelector);
