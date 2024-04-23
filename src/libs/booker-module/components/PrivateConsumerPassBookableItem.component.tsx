import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { PrivateConsumerPass } from '../../private-service/types';

import { getExpirationDate } from '../../private-service/utils';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';
import { getCreditsDividedDisplay } from '#libs/theme/utils';

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
      <Typography color="primary" component="span" variant="h6">
        {`${getCreditsDividedDisplay(
          privateConsumerPass.private_pass.credits -
            privateConsumerPass.used_credits,
        )} / ${getCreditsDividedDisplay(
          privateConsumerPass.private_pass.credits,
        )} ${t('privatePass.parameters.nbCredits', {
          current_credits: '',
          count: 0,
        })}`}
      </Typography>
      <Typography align="left" color="textSecondary" variant="body1">
        {t('consumerPass.expiresOn', {
          date: formatAsDatetimeAdapted(expirationDate, 'LL'),
        })}
      </Typography>
      <Typography align="left" color="textPrimary" variant="body1">
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
