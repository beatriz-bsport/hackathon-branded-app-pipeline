import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';

import {
  EmailTemplateDetail,
  EmailTemplateSummary,
} from '../../email-editor/types';
import { MarketingNotification } from '../types';

import BookingCreationNotificationForm from '../../booking/components/BookingCreationNotificationForm.component';
import PrivateBookingNotificationForm from '../../private-service/components/booking/PrivateBookingNotificationForm.component';
import PaymentPackNotificationForm from '../../payment-packs/components/PaymentPackNotificationForm.component';
import NotificationSourceSelector from './NotificationSourceSelector.component';
import { MetaActivity } from '../../meta-activity/types';
import { Establishment } from '../../establishment/types';
import { PrivateService } from '../../private-service/types';
import { PaymentPack } from '../../payment-packs/types';
import FabWithItems from '../../../components/button/FabWithItems';

type Identifier =
  | 'meta_activity'
  | 'establishment'
  | 'private_service'
  | 'payment_pack';

type OwnProps = {
  selectedNotification?: MarketingNotification;
  emailListLoading: boolean;
  emailDetailLoading: boolean;
  getEmailDetail: (id: number) => any;
  getEmails: () => void;
  emailSummaryList: EmailTemplateSummary[];
  emailDetails: { [key: string]: EmailTemplateDetail };
  onCancel: () => void;
  onUpdateMarketingNotification: (id: number, n: MarketingNotification) => any;
  onCreateMarketingNotification: (n: MarketingNotification) => any;
  goToSmartlist: () => void;
  getSmartLists: () => void;
  smartLists: any[];
  smartListLoading: boolean;
  metaActivities: MetaActivity[];
  workshopList: MetaActivity[];
  establishments: Establishment[];
  privateServices: PrivateService[];
  paymentPacks: PaymentPack[];
};

type Props = OwnProps & WithTranslation;

type State = {
  createFromSource?: null | {
    identifier?: Identifier;
    objectId?: number;
  };
};

export class NotificationFormGeneric extends React.PureComponent<Props, State> {
  state: State = {};

  onCancel = () => {
    this.props.onCancel();
    this.setState({ createFromSource: null });
  };

  onSubmit = (n: MarketingNotification) => {
    if (this.props.selectedNotification) {
      this.props.onUpdateMarketingNotification(
        this.props.selectedNotification.id,
        n,
      );
    } else {
      this.props.onCreateMarketingNotification(n);
      this.setState({ createFromSource: null });
    }
  };

  onClickCreateForIdentifier = (identifier: Identifier) => {
    this.setState({
      createFromSource: {
        identifier,
      },
    });
  };

  renderDialog = () => {
    if (
      this.state.createFromSource &&
      this.state.createFromSource.identifier &&
      typeof this.state.createFromSource.objectId !== 'number'
    ) {
      return (
        <NotificationSourceSelector
          identifier={this.state.createFromSource.identifier}
          onClose={() => this.setState({ createFromSource: null })}
          onSubmit={(identifier, objectId) => {
            this.setState({
              createFromSource: { identifier, objectId },
            });
          }}
          metaActivities={
            this.state.createFromSource.identifier === 'workshop'
              ? this.props.workshopList
              : this.props.metaActivities
          }
          establishments={this.props.establishments}
          privateServices={this.props.privateServices}
          paymentPacks={this.props.paymentPacks}
        />
      );
    }

    let identifier = '';
    let objectId = -1;

    if (this.state.createFromSource && this.state.createFromSource.objectId) {
      /* eslint-disable-next-line */
      identifier = this.state.createFromSource.identifier;
      /* eslint-disable-next-line */
      objectId = this.state.createFromSource.objectId;
    }

    if (this.props.selectedNotification) {
      const {
        establishment_id,
        meta_activity_id,
        private_service_id,
        payment_pack_id,
      } = this.props.selectedNotification.event_rules;

      if (meta_activity_id !== undefined) {
        identifier = 'meta_activity';
        objectId = meta_activity_id;
      }
      if (establishment_id !== undefined) {
        identifier = 'establishment';
        objectId = establishment_id;
      }

      if (private_service_id !== undefined) {
        identifier = 'private_service';
        objectId = private_service_id;
      }

      if (payment_pack_id !== undefined) {
        identifier = 'payment_pack';
        objectId = payment_pack_id;
      }
    }

    if (['meta_activity', 'establishment', 'workshop'].includes(identifier)) {
      return (
        <BookingCreationNotificationForm
          objectId={objectId}
          identifier={identifier}
          emailListLoading={this.props.emailListLoading}
          emailDetailLoading={this.props.emailDetailLoading}
          getEmails={this.props.getEmails}
          getEmailDetail={this.props.getEmailDetail}
          emails={this.props.emailSummaryList}
          emailDetails={this.props.emailDetails}
          initial={this.props.selectedNotification}
          onCancel={this.onCancel}
          onSubmit={this.onSubmit}
        />
      );
    }

    if (identifier === 'private_service') {
      return (
        <PrivateBookingNotificationForm
          serviceId={objectId}
          emailListLoading={this.props.emailListLoading}
          emailDetailLoading={this.props.emailDetailLoading}
          getEmails={this.props.getEmails}
          getEmailDetail={this.props.getEmailDetail}
          emails={this.props.emailSummaryList}
          emailDetails={this.props.emailDetails}
          initial={this.props.selectedNotification}
          onCancel={this.onCancel}
          onSubmit={this.onSubmit}
        />
      );
    }

    if (identifier === 'payment_pack') {
      return (
        <PaymentPackNotificationForm
          id={objectId}
          emailDetailLoading={this.props.emailDetailLoading}
          emailListLoading={this.props.emailListLoading}
          getEmails={this.props.getEmails}
          getEmailDetail={this.props.getEmailDetail}
          emails={this.props.emailSummaryList}
          emailDetails={this.props.emailDetails}
          goToSmartlist={this.props.goToSmartlist}
          getSmartLists={this.props.getSmartLists}
          smartLists={this.props.smartLists}
          smartListLoading={this.props.smartListLoading}
          initial={this.props.selectedNotification}
          onCancel={this.onCancel}
          onSubmit={this.onSubmit}
        />
      );
    }

    return null;
  };

  render() {
    const { t } = this.props;

    return (
      <>
        {this.renderDialog()}

        <FabWithItems
          label={t('notifications.createNotificationFabLabel')}
          items={[
            {
              label: t('notifications.fabLabels.meta_activity'),
              onClick: () => this.onClickCreateForIdentifier('meta_activity'),
            },
            {
              label: t('notifications.fabLabels.workshop'),
              onClick: () => this.onClickCreateForIdentifier('workshop'),
            },
            {
              label: t('notifications.fabLabels.establishment'),
              onClick: () => this.onClickCreateForIdentifier('establishment'),
            },
            {
              label: t('notifications.fabLabels.private_service'),
              onClick: () => this.onClickCreateForIdentifier('private_service'),
            },
            {
              label: t('notifications.fabLabels.payment_pack'),
              onClick: () => this.onClickCreateForIdentifier('payment_pack'),
            },
          ]}
        />
      </>
    );
  }
}

export default compose<any, OwnProps>(withTranslation(['marketing']))(
  NotificationFormGeneric,
);
