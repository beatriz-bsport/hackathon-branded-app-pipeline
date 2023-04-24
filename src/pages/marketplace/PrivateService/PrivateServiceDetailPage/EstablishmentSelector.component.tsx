// @ts-nocheck
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Fade, Typography, Theme } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

import {
  PrivateService,
  PrivateSlot,
} from '../../../../libs/private-service/types';
import { Establishment } from '../../../../libs/establishment/types';
import { Coach } from '../../../../libs/associated-coach/types';
import EstablishmentSelectorItem from './EstablishmentSelectorItem.component';

type Props = {
  privateService: PrivateService<Coach, Establishment, PrivateSlot>;
  privateSlot: PrivateSlot;
  selectedEstablishments: Establishment[];
  onSelect: (establishments: Establishment) => void;
};

const EstablishmentSelector: React.FC<Props> = ({
  privateService,
  privateSlot,
  selectedEstablishments,
  onSelect,
}) => {
  const isEstablishmentSelected = useCallback(
    (establishment) => {
      return (
        selectedEstablishments?.length &&
        selectedEstablishments.find((e) => e.id === establishment.id)
      );
    },
    [selectedEstablishments],
  );

  const classes = useStyles();
  const { t } = useTranslation('privateService');

  const renderEstablishment = useCallback(() => {
    return privateService.establishments.map((establishment: Establishment) => {
      return (
        <EstablishmentSelectorItem
          key={establishment.id}
          privateSlot={privateSlot}
          establishment={establishment}
          onSelect={onSelect}
          isEstablishmentSelected={isEstablishmentSelected}
        />
      );
    });
  }, [privateService, privateSlot, isEstablishmentSelected, onSelect]);

  return (
    <Fade in timeout={500}>
      <div className={classes.container}>
        <Typography className={classes.titleMargin} variant="h5">
          {t('slotSearcher.establishment')}
        </Typography>
        <div className={classes.container2}>{renderEstablishment()}</div>
      </div>
    </Fade>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  container2: {
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardItemLayout: {
    display: 'flex',
    padding: theme.spacing(1),
    [theme.breakpoints.up('lg')]: {
      flexBasis: '25%',
      maxWidth: '25%',
    },
    [theme.breakpoints.down('md')]: {
      flexBasis: '33%',
      maxWidth: '33%',
    },
    [theme.breakpoints.down('sm')]: {
      flexBasis: '50%',
      maxWidth: '50%',
    },
    [theme.breakpoints.down('xs')]: {
      flexBasis: '100%',
      maxWidth: '100%',
    },
  },
  cardContainer: {
    display: 'flex',
    flex: 1,
    maxHeight: 100,
    position: 'relative',
    overflow: 'hidden',
    maxWidth: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  },
  cardDesc: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1.5),
    justifyContent: 'space-between',
    flex: 1,
    flexShrink: 2,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  image: {
    minWidth: 100,
    minHeight: 100,
  },
  establishmentName: {
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textAlign: 'left',
  },
  establishmentAddress: {
    lineHeight: 1.4,
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textAlign: 'left',
  },
  selected: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  mask: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#CCCCCC88',
    borderRadius: 5,
  },
  titleMargin: {
    marginLeft: theme.spacing(1),
  },
}));

export default EstablishmentSelector;
