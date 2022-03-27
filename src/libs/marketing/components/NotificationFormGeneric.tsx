import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';

import {
  EmailTemplateDetail,
  EmailTemplateSummary,
} from '../../email-editor/types';
import { MarketingNotification } from '../types';

import MarketingRuleFormPrivateBooking from './marketing-rule-form/MarketingRuleFormPrivateBooking.component';
import MarketingRuleFormBooking from './marketing-rule-form/MarketingRuleFormBooking.component';
import MarketingRuleFormProduct from './marketing-rule-form/MarketingRuleFormProduct.component';

import MarketingRuleFormBirthday from './marketing-rule-form/MarketingRuleFormBirthday.component';
import NotificationSourceSelector from './NotificationSourceSelector.component';

import { MetaActivity } from '../../meta-activity/types';
import { Establishment, EstablishmentGroup } from '../../establishment/types';
import { PrivatePass, PrivateService } from '../../private-service/types';
import { PaymentPack } from '../../payment-packs/types';

type Identifier =
  | 'birthday'
  | 'workshop'
  | 'meta_activity'
  | 'establishment'
  | 'private_service'
  | 'payment_pack'
  | 'private_pass'
  | 'workshop'
  | 'establishment_group';

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
  tags: { [tag_name: string]: string[] };
  privatePasses: PrivatePass[];
  withoutBirthday: boolean;
  establishmentGroups: Array<EstablishmentGroup>;
  onlyEdit?: boolean;
  createFormOpenType: Identifier;
};

type Props = OwnProps & WithTranslation;

type State = {
  sourceObjectId: number | null;
};

export class NotificationFormGeneric extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      sourceObjectId: props.sourceObjectId || null,
    };
  }

  state: State = {};

  onCancel = () => {
    this.props.onCancel();
    this.props.closeForm();
  };

  onSubmit = (n: MarketingNotification) => {
    if (this.props.selectedNotification) {
      this.props.onUpdateMarketingNotification(
        this.props.selectedNotification.id,
        n,
      );
    } else {
      this.props.onCreateMarketingNotification(n);
      this.props.closeForm();
    }
  };

  getMergeTags = () => {
    if (this.props.tags) {
      return [
        ...Object.entries(this.props.tags).reduce(
          (acc, [tagCategory, tagList]) => {
            acc.push({
              label: this.props.t(`notificationRule:tag.${tagCategory}.name`),
              options: [...tagList].map((tag) => ({
                label: this.props.t(
                  `notificationRule:tag.${tagCategory}.tags.${tag}`,
                ),
                value: `{${tag}}`,
              })),
            });
            return acc;
          },
          [],
        ),
      ];
    }
    return null;
  };

  render() {
    if (
      this.props.createFormOpenType &&
      this.props.createFormOpenType !== 'birthday' &&
      typeof this.state.sourceObjectId !== 'number'
    ) {
      return (
        <NotificationSourceSelector
          identifier={this.props.createFormOpenType}
          onClose={this.props.closeForm}
          onSubmit={(sourceObjectId) => {
            this.setState({
              sourceObjectId,
            });
          }}
          metaActivities={
            this.props.createFormOpenType === 'workshop'
              ? this.props.workshopList
              : this.props.metaActivities
          }
          establishments={this.props.establishments}
          establishmentGroups={this.props.establishmentGroups}
          privateServices={this.props.privateServices}
          paymentPacks={this.props.paymentPacks}
          privatePasses={this.props.privatePasses}
        />
      );
    }

    let identifier = '';
    let objectId = -1;

    if (this.state.sourceObjectId) {
      /* eslint-disable-next-line */
      identifier = this.props.createFormOpenType
      /* eslint-disable-next-line */
      objectId = this.state.sourceObjectId;
    }

    if (this.props.selectedNotification) {
      const {
        establishment_id,
        establishment_group_id,
        meta_activity_id,
        private_service_id,
        payment_pack_id,
        private_pass_id,
      } = this.props.selectedNotification.event_rules;

      if (meta_activity_id !== undefined) {
        identifier = 'meta_activity';
        objectId = meta_activity_id;
      }
      if (establishment_id !== undefined) {
        identifier = 'establishment';
        objectId = establishment_id;
      }
      if (establishment_group_id !== undefined) {
        identifier = 'establishment_group';
        objectId = establishment_group_id;
      }

      if (private_service_id !== undefined) {
        identifier = 'private_service';
        objectId = private_service_id;
      }

      if (payment_pack_id !== undefined) {
        identifier = 'payment_pack';
        objectId = payment_pack_id;
      }
      if (private_pass_id !== undefined) {
        identifier = 'private_pass';
        objectId = private_pass_id;
      }
    }

    if (
      [
        'meta_activity',
        'establishment',
        'workshop',
        'establishment_group',
      ].includes(identifier)
    ) {
      return (
        <MarketingRuleFormBooking
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
          tags={this.getMergeTags()}
        />
      );
    }

    if (identifier === 'private_service') {
      return (
        <MarketingRuleFormPrivateBooking
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
          tags={this.getMergeTags()}
        />
      );
    }

    if (identifier === 'payment_pack' || identifier === 'private_pass') {
      return (
        <MarketingRuleFormProduct
          identifier={identifier}
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
          tags={this.getMergeTags()}
        />
      );
    }

    if (
      this.props.createFormOpenType === 'birthday' ||
      this.props.selectedNotification?.kind === NOTIFICATION_KIND.BIRTHDAY
    ) {
      return (
        <MarketingRuleFormBirthday
          emailDetailLoading={this.props.emailDetailLoading}
          emailListLoading={this.props.emailListLoading}
          getEmails={this.props.getEmails}
          getEmailDetail={this.props.getEmailDetail}
          emails={this.props.emailSummaryList}
          emailDetails={this.props.emailDetails}
          initial={this.props.selectedNotification}
          onCancel={this.onCancel}
          onSubmit={this.onSubmit}
          tags={this.getMergeTags()}
        />
      );
    }

    return null;
  }
}

export default compose<any, OwnProps>(withTranslation(['marketing']))(
  NotificationFormGeneric,
);
