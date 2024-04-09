import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { SvgIcon, SvgIconProps, Typography } from '@material-ui/core';

import type { ImmutableArray, ImmutableObject } from 'seamless-immutable';

import {
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

const BarcodeIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <svg
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 12V6h1m-1 6h1V6m-1 12v-3h1m0 0v3h-1M7 6v6m0 3v3m7-12v6m0 3v3m3-12v6m0 3v3M6 3H3v3m-1 6h20m-4-9h3v3M6 21H3v-3m15 3h3v-3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  </SvgIcon>
);

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
