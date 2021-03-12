import React from 'react';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { ListItem, Theme } from '@material-ui/core';
import moment from 'moment-timezone';
import { WithTranslation, withTranslation } from 'react-i18next';
// @ts-ignore
import RedButton from '../../../../components/button/RedButton.component';

import { MaterialStyleType } from '../../../../utils/types';
import { PrivateConsumerPassMassExtension } from '../../types';

type OwnProps = {
  massExtension: PrivateConsumerPassMassExtension;
  onDelete: (p: PrivateConsumerPassMassExtension) => void;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export const PrivatePassMassExtensionListItem = (props: Props) => {
  const { classes, t, massExtension } = props;
  return (
    <ListItem divider dense className={classes.itemContainer}>
      <div className={classes.itemContent}>
        <Typography>{massExtension.note}</Typography>

        <Typography>
          {t('massExtension.listItemNbDays', {
            nbDays: massExtension.nb_days,
          })}
        </Typography>
        <Typography variant="caption">
          {t('massExtension.listItemDate', {
            minDate: moment(massExtension.min_ending_date).format('ll'),
            maxDate: moment(massExtension.max_ending_date).format('ll'),
          })}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {t('massExtension.createdAt', {
            date: moment(massExtension.date_created).format('lll'),
          })}
        </Typography>
      </div>

      <RedButton
        variant="outlined"
        onClick={() => props.onDelete(massExtension)}
      >
        {t('form.paymentPack.delete.actions.submit')}
      </RedButton>
    </ListItem>
  );
};

const styles = (theme: Theme) => ({
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
});

export default compose<any, OwnProps>(
  withTranslation(['paymentPack']),
  // @ts-ignore
  withStyles(styles),
)(PrivatePassMassExtensionListItem);
