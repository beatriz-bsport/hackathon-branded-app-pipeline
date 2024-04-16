import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import type { ImmutableArray, ImmutableObject } from 'seamless-immutable';

import BarcodeIcon from '#components/icons/BarcodeIcon.component';

import type {
  Establishment,
  EstablishmentGroupAPI,
} from '#libs/establishment/types';

type Props = {
  enableMultiLocalization: boolean;
  establishments: Establishment[] | ImmutableArray<Establishment>;
  staffLocationAddress?: string;
  staffLocationEstablishmentGroup?:
    | EstablishmentGroupAPI
    | ImmutableObject<EstablishmentGroupAPI>;
};

const MemberVisitPlaceHolder: React.FC<Props> = ({
  enableMultiLocalization,
  establishments,
  staffLocationAddress,
  staffLocationEstablishmentGroup,
}) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles();

  const showLocation = enableMultiLocalization
    ? !!staffLocationEstablishmentGroup?.name
    : !!staffLocationAddress;

  return (
    <div className={classes.root}>
      <BarcodeIcon className={classes.barcodeIcon} color="primary" />
      <Typography variant="h6">
        {t('memberVisit.emptyState.waitForScan')}
      </Typography>
      {!!establishments?.length && showLocation && (
        <Typography color="textSecondary" variant="body2">
          <Trans
            i18nKey="accessControl:memberVisit.emptyState.establishmentsSelectedInRole"
            values={{
              establishments: establishments
                .map((establishment) => establishment?.title)
                .join(', '),
              address: enableMultiLocalization
                ? staffLocationEstablishmentGroup?.name
                : staffLocationAddress,
            }}
          />
        </Typography>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  barcodeIcon: {
    height: 86,
    width: 86,
  },
}));

export default React.memo(MemberVisitPlaceHolder);
