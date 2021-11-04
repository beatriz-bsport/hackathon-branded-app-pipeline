import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import { PrivateConsumerPass } from '../../private-service/types';

import { getExpirationDate } from '../../private-service/utils';

interface Props {
  privateConsumerPass: PrivateConsumerPass;
}

const PrivateConsumerPassBookableItem = (props: Props) => {
  const classes = useStyles(['paymentPack']);
  const { t } = useTranslation(['privateService']);
  const { privateConsumerPass } = props;

  const expirationDate = getExpirationDate(privateConsumerPass);

  return (
    <div className={classes.itemContainer}>
      <Typography component="span" variant="h6" color="primary">
        {`${
          privateConsumerPass.private_pass.credits -
          privateConsumerPass.used_credits
        }/${privateConsumerPass.private_pass.credits} ${t(
          'privatePass.parameters.nbCredits',
          {
            current_credits: '',
            count: 0,
          },
        )}`}
      </Typography>
      <Typography variant="body1" color="textSecondary" align="left">
        {t('consumerPass.expiresOn', {
          date: moment(expirationDate).format('LL'),
        })}
      </Typography>
      <Typography variant="body1" color="textPrimary" align="left">
        {props.privateConsumerPass.private_pass.name}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  itemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

export default PrivateConsumerPassBookableItem;
