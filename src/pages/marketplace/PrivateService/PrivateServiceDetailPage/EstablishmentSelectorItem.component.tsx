import React from 'react';
import { CardMedia, Typography, ButtonBase } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import classNames from 'classnames';

import { PrivateSlot } from '../../../../libs/private-service/types';
import { Establishment } from '../../../../libs/establishment/types';

type Props = {
  privateSlot: PrivateSlot;
  establishment: Establishment;
  onSelect: (establishments: Establishment) => void;
  isEstablishmentSelected: (establishment: Establishment) => Establishment;
};

const EstablishmentSelectorItem: React.FC<Props> = (props) => {
  const { establishment, privateSlot, onSelect, isEstablishmentSelected } =
    props;

  const classes = useStyles();

  return (
    <div className={classes.cardItemLayout}>
      <ButtonBase
        className={classNames({
          [classes.cardContainer]: true,
          [classes.selected]: isEstablishmentSelected(establishment),
        })}
        onClick={() => privateSlot && onSelect(establishment)}
      >
        <CardMedia
          className={classes.image}
          image={establishment.cover}
          title={establishment.title}
        />
        <div className={classes.cardDesc}>
          <Typography className={classes.establishmentName} variant="subtitle2">
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
        {!privateSlot && <div className={classes.mask} />}
      </ButtonBase>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
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

export default EstablishmentSelectorItem;
