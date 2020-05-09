// @flow
import React from 'react';

import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, withState } from 'recompose';
import Button from '@material-ui/core/Button';

import ConsumerPackRowItem from '../../consumer-payment-pack/components/ConsumerPackRowItem.component';
import PaginatedListBase from '../../../components/PaginatedListBase.component';

const CONSUMER_PAYMENT_PACK_PAGE_SIZE = 6;

type Props = {
  consumerPacks: Array<ConsumerPassWithPack>,
  onCancel: () => void,
  onSubmit: (consumerPackId: number) => void,
  selectedConsumerPass: ?ConsumerPassWithPack,
  loading: boolean,
  classes: Object,
  setSelectedConsumerPass: (id: number) => void,
  t: TFunction,
  page: number,
  count: number,
  fetchConsumerPacks: (
    memberId: number,
    page: number,
    page_size: number,
  ) => void,
  disabledStuff: Array<number>,
};

export const ConsumerPackLinkForm = (props: Props) => {
  if (!props.selectedConsumerPass) {
    return (
      <div className={props.classes.fullWidth}>
        <Typography className={props.classes.title} variant="h4">
          {props.t('consumer_payment_pack_links.form.create.title')}
        </Typography>
        <PaginatedListBase
          itemPerPage={CONSUMER_PAYMENT_PACK_PAGE_SIZE}
          loading={props.loading}
          listProps={{ disablePadding: true }}
          items={props.consumerPacks}
          nbItems={props.count}
          page={props.page}
          onPageRequested={props.fetchConsumerPacks}
          renderItem={(cpp) => (
            <ConsumerPackRowItem
              consumerPack={cpp}
              paymentPack={cpp.payment_pack}
              hideConsumer
              key={cpp.id}
              button={
                <Button
                  onClick={() => props.setSelectedConsumerPass(cpp)}
                  color="primary"
                  variant="outlined"
                  disabled={props.disabledStuff.includes(cpp.id)}
                >
                  {props.t(
                    'consumer_payment_pack_links.form.create.linkButton',
                  )}
                </Button>
              }
            />
          )}
        />

        <div className={props.classes.buttonContainer}>
          <Button onClick={props.onCancel}>
            {props.t('consumer_payment_pack_links.form.create.cancel')}
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Typography className={props.classes.title} variant="h4">
        {props.t('consumer_payment_pack_links.form.create.title')}
      </Typography>
      <Typography className={props.classes.confirmText} color="textSecondary">
        {props.t('consumer_payment_pack_links.form.create.explain')}
      </Typography>
      <ConsumerPackRowItem
        consumerPack={props.selectedConsumerPass}
        paymentPack={props.selectedConsumerPass.payment_pack}
        hideConsumer
      />
      <div className={props.classes.buttonContainer}>
        <Button onClick={() => props.setSelectedConsumerPass(null)}>
          {props.t('consumer_payment_pack_links.form.create.previous')}
        </Button>
        <Button
          color="primary"
          onClick={() => props.onSubmit(props.selectedConsumerPass.id)}
        >
          {props.t('consumer_payment_pack_links.form.create.submit')}
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
  withNamespaces(['relationship']),
  withState('selectedConsumerPass', 'setSelectedConsumerPass', null),
)(ConsumerPackLinkForm);
