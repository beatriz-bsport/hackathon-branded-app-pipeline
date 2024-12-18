// @flow
import React from 'react';

import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import { compose, withState } from 'recompose';
import Button from '@material-ui/core/Button';

import ConsumerPackRowItem from '../../consumer-payment-pack/components/ConsumerPackRowItem.component';
import PaginatedListBase from '../../../components/PaginatedListBase.component';
import { WithIsSharedActive } from '../types';

const CONSUMER_PAYMENT_PACK_PAGE_SIZE = 6;

type Props = {
  consumerPacks: Array<WithIsSharedActive<ConsumerPassWithPack>>,
  onCancel: () => void,
  onSubmit: (consumerPackId: number) => void,
  selectedConsumerPass: ?WithIsSharedActive<ConsumerPassWithPack>,
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
  processing: boolean,
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
          items={props.consumerPacks}
          listProps={{ disablePadding: true }}
          loading={props.loading}
          nbItems={props.count}
          onPageRequested={props.fetchConsumerPacks}
          page={props.page}
          renderItem={(cpp) => (
            <ConsumerPackRowItem
              key={cpp.id}
              hideConsumer
              button={
                <Button
                  color="primary"
                  disabled={props.disabledStuff.includes(cpp.id)}
                  onClick={() => props.setSelectedConsumerPass(cpp)}
                  variant="outlined"
                >
                  {props.t(
                    'consumer_payment_pack_links.form.create.linkButton',
                  )}
                </Button>
              }
              consumerPack={cpp}
              paymentPack={cpp.payment_pack}
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
        hideConsumer
        consumerPack={props.selectedConsumerPass}
        paymentPack={props.selectedConsumerPass.payment_pack}
      />
      <div className={props.classes.buttonContainer}>
        <Button onClick={() => props.setSelectedConsumerPass(null)}>
          {props.t('consumer_payment_pack_links.form.create.previous')}
        </Button>
        <Button
          color="primary"
          disabled={props.processing}
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
  withTranslation(['relationship']),
  withState('selectedConsumerPass', 'setSelectedConsumerPass', null),
)(ConsumerPackLinkForm);
