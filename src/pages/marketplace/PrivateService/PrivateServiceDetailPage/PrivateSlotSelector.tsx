import React from 'react';
import { Fade, ButtonBase, Typography, makeStyles } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Paper from '@material-ui/core/Paper';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import classNames from 'classnames';

import {
  PrivateService,
  PrivateSlot,
} from '../../../../libs/private-service/types';
import { getTextColorFromRGB } from '../../../../color';

type Props = {
  privateService: PrivateService;
  privateSlot: PrivateSlot;
  onSelect: (slot: PrivateSlot) => void;
};

const PrivateSlotSelector: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('privateService');

  return (
    <Fade in timeout={500}>
      <div className={classes.container}>
        <Typography className={classes.titleMargin} variant="h5">
          {t('selector.privateSlot')}
        </Typography>
        <div className={classes.container2}>
          {props.privateService.slots
            .filter((slot: PrivateSlot) => !!slot && slot.available)
            .map((slot: PrivateSlot) => {
              const isSelected = props?.privateSlot?.id === slot.id;

              return (
                <div key={slot.name} className={classes.itemContainerLayout}>
                  <Paper
                    className={classNames({
                      [classes.itemContainer]: true,
                      [classes.selectedItem]: isSelected,
                    })}
                  >
                    <ButtonBase
                      className={classes.item}
                      onClick={() => props.onSelect(slot)}
                    >
                      <Typography
                        className={classes.maxLine}
                        variant="subtitle1"
                      >
                        {slot.name}
                      </Typography>

                      <div className={classes.row}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography
                          variant="subtitle2"
                          color={isSelected ? 'inherit' : 'textSecondary'}
                        >
                          {t('privateSlot.duration', {
                            minutes: slot.duration_minutes,
                          })}
                        </Typography>
                      </div>
                      {slot.people_capacity_used > 1 && (
                        <Typography
                          variant="subtitle2"
                          color={isSelected ? 'inherit' : 'textSecondary'}
                        >
                          {t('slot.form.people_capacity_used.label')}:{' '}
                          {slot.people_capacity_used}
                        </Typography>
                      )}
                    </ButtonBase>
                  </Paper>
                </div>
              );
            })}
        </div>
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
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '&>*': {
      marginRight: theme.spacing(0.5),
    },
  },
  itemContainerLayout: {
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
  itemContainer: {
    display: 'flex',
    flex: 1,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  item: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
  },
  selectedItem: {
    backgroundColor: theme.palette.primary.main,
    color: getTextColorFromRGB(chroma(theme.palette.primary.main).rgb()),
  },
  maxLine: {
    textAlign: 'left',
    lineHeight: '140%',
    marginBottom: theme.spacing(1),
  },
  titleMargin: {
    marginLeft: theme.spacing(1),
  },
}));

export default PrivateSlotSelector;
