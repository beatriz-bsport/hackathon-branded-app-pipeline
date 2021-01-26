import { Paper, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';

// @ts-ignore
import TypographyMultiline from '../../../../components/TypographyMultiline.component';

import {
  PrivateService,
  PrivateSlot,
} from '../../../../libs/private-service/types';
import { Establishment } from '../../../../libs/establishment/types';
import { Coach } from '../../../../libs/associated-coach/types';

interface Props {
  privateService: PrivateService<Coach, Establishment, PrivateSlot>;
}

const PrivateServiceDetailSummary: React.FC<Props> = (props) => {
  const { privateService } = props;
  const classes = useStyles();

  return (
    <Paper className={classes.serviceDescriptionContainer}>
      {privateService && (
        <img
          alt={privateService.name}
          src={privateService.cover_main}
          className={classes.privateServiceImage}
        />
      )}

      <div className={classes.serviceDescriptionContent}>
        {privateService && (
          <>
            <Typography variant="h6">{privateService.name}</Typography>

            <TypographyMultiline
              className={classes.serviceDescription}
              variant="subtitle2"
              color="textSecondary"
            >
              {privateService.description}
            </TypographyMultiline>
          </>
        )}
      </div>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  serviceDescriptionContainer: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
    width: 400,
    [theme.breakpoints.up('xl')]: {
      width: 600,
    },
    height: '100%',
    minHeight: '100vh',
  },
  serviceDescription: {
    marginTop: theme.spacing(2),
  },
  serviceDescriptionContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
  },
  privateServiceImage: {
    width: '100%',
  },
}));

export default PrivateServiceDetailSummary;
