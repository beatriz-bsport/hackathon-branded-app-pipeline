// @flow
import React from 'react';
import type { TFunction } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import { compose, withState } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import PaginatedListStateful from '../../../components/PaginatedListStateful.component';
import PrivateConsumerPassBookerListItem from '../../private-service/components/booking-module/PrivateConsumerPassBookerListItem.component';
import type { PrivateConsumerPass } from '../../private-service/types.ts';

type Props = {
  t: TFunction,
  classes: Object,
  privateConsumerPasses: Array<PrivateConsumerPass>,
  onCancel: () => void,
  onSubmit: (privateConsumerPassId: number) => void,
  selectedPrivateConsumerPass: PrivateConsumerPass,
  setSelectedPrivateConsumerPass: (PrivateConsumerPass) => void,
  loading: boolean,
  disabledStuff: Array<number>,
};

export const PrivateConsumerPassLinkForm = (props: Props) => {
  const { t, classes } = props;
  if (!props.selectedPrivateConsumerPass) {
    return (
      <div className={classes.fullWidth}>
        <Typography className={classes.title} variant="h4">
          {t('private_consumer_pass_links.form.create.title')}
        </Typography>
        <PaginatedListStateful
          itemPerPage={5}
          loading={props.loading}
          listProps={{ disablePadding: true }}
          items={props.privateConsumerPasses}
          renderItem={(pcp) => (
            <PrivateConsumerPassBookerListItem
              divider
              key={pcp.id}
              private_consumer_pass={pcp}
              button={
                <Button
                  onClick={() => props.setSelectedPrivateConsumerPass(pcp)}
                  color="primary"
                  variant="outlined"
                  disabled={props.disabledStuff.includes(pcp.id)}
                >
                  {t(
                  'private_consumer_pass_links.form.create.linkButton',
                  )}
                </Button>
                }
            />
          )}
        />
        <div className={classes.buttonContainer}>
          <Button onClick={props.onCancel}>
            {t('private_consumer_pass_links.form.create.cancel')}
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Typography className={classes.title} variant="h4">
        {t('private_consumer_pass_links.form.create.title')}
      </Typography>
      <Typography className={classes.confirmText} color="textSecondary">
        {t('private_consumer_pass_links.form.create.explain')}
      </Typography>
      <PrivateConsumerPassBookerListItem
        divider
        private_consumer_pass={props.selectedPrivateConsumerPass}
      />
      <div className={classes.buttonContainer}>
        <Button onClick={() => props.setSelectedPrivateConsumerPass(null)}>
          {t('private_consumer_pass_links.form.create.previous')}
        </Button>
        <Button
          color="primary"
          onClick={() => props.onSubmit(props.selectedPrivateConsumerPass.id)}
        >
          {t('private_consumer_pass_links.form.create.submit')}
        </Button>
      </div>
    </div>
  );
};

const styles = (theme) => ({
  title: {
    paddingBottom: theme.spacing(2),
  },
  fullWidth: {
    width: '100%',
  },
  confirmText: {
    paddingBottom: theme.spacing(2),
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
  },
  });

  export default compose(
  withStyles(styles),
  withTranslation(['relationship']),
  withState('selectedPrivateConsumerPass', 'setSelectedPrivateConsumerPass', null),
  )(PrivateConsumerPassLinkForm);
