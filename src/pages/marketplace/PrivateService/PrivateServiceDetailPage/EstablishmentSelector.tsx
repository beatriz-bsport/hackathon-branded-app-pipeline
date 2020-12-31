import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Fade,
  CardMedia,
  Typography,
  makeStyles,
  ButtonBase,
} from '@material-ui/core';
import classNames from 'classnames';

import {
  PrivateEstablishment,
  PrivateService,
  PrivateSlot,
} from '../../../../libs/private-service/types';

type Props = {
  privateService: PrivateService;
  privateSlot: PrivateSlot;
  selectedEstablishments: PrivateEstablishment[];
  onSelect: (establishments: PrivateEstablishment) => void;
};

const EstablishmentSelector: React.FC<Props> = (props) => {
  const isEstablishmentSelected = useCallback(
    (establishment) => {
      return (
        props.selectedEstablishments &&
        props.selectedEstablishments.length &&
        props.selectedEstablishments.find((e) => e.id === establishment.id)
      );
    },
    [props.selectedEstablishments],
  );

  const classes = useStyles();
  const { t } = useTranslation('privateService');

  const renderEstablishment = useCallback(() => {
    return props.privateService.establishments.map(
      (establishment: PrivateEstablishment) => {
        return (
          <div className={classes.cardItemLayout} key={establishment.id}>
            <ButtonBase
              className={classNames({
                [classes.cardContainer]: true,
                [classes.selected]: isEstablishmentSelected(establishment),
              })}
              onClick={() => props.privateSlot && props.onSelect(establishment)}
            >
              <CardMedia
                className={classes.image}
                image={establishment.cover}
                title={establishment.title}
              />
              <div className={classes.cardDesc}>
                <Typography
                  className={classes.establishmentName}
                  variant="subtitle2"
                >
                  {establishment.title}
                </Typography>

                <Typography
                  className={classes.establishmentAddress}
                  variant="subtitle2"
                  color={
                    isEstablishmentSelected(establishment)
                      ? 'inherit'
                      : 'textSecondary'
                  }
                >
                  {establishment.location.address}
                </Typography>
              </div>
              {!props.privateSlot && <div className={classes.mask} />}
            </ButtonBase>
          </div>
        );
      },
    );
  }, [props.privateService, props.privateSlot, props.selectedEstablishments]);

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

const useStyles = makeStyles((theme) => ({
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
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
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
