// @ts-nocheck
import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';

import { OptionCallback } from '../../../state/types';
import {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '../../email-editor/types';
import { MarketingNotification } from '../types';

import MarketingRuleFormPrivateBooking from './marketing-rule-form/MarketingRuleFormPrivateBooking.component';
import MarketingRuleFormBooking from './marketing-rule-form/MarketingRuleFormBooking.component';
import MarketingRuleFormProduct from './marketing-rule-form/MarketingRuleFormProduct.component';

import { Contract } from '#libs/subscription/types';
import MarketingRuleFormBirthday from './marketing-rule-form/MarketingRuleFormBirthday.component';
import NotificationSourceSelector from './NotificationSourceSelector.component';

import { MetaActivity } from '../../meta-activity/types';
import { Establishment, EstablishmentGroup } from '../../establishment/types';
import { PrivatePass, PrivateService } from '../../private-service/types';
import { PaymentPack } from '../../payment-packs/types';
import MarketingRuleFormContract from './marketing-rule-form/MarketingRuleFormContract.component';
import { SmartList } from '#libs/smart-list/types';

import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

type Identifier =
  | 'birthday'
  | 'workshop'
  | 'meta_activity'
  | 'establishment'
  | 'private_service'
  | 'contract'
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
  onCreateMarketingNotification: (
    n: MarketingNotification,
    option: OptionCallback,
  ) => any;
  goToSmartlist: () => void;
  getSmartLists: () => void;
  smartLists: SmartList[];
  smartListLoading: boolean;
  metaActivities: MetaActivity[];
  workshopList: MetaActivity[];
  establishments: Establishment[];
  privateServices: PrivateService[];
  paymentPacks: PaymentPack[];
  contracts: Contract[];
  tags: { [tag_name: string]: string[] };
  resolvedGenericTags: ResolvedGenericTags;
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

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.MarketingNotification,
);

export class MarketingRuleFormGeneric extends React.PureComponent<
  Props,
  State
> {
  constructor(props) {
    super(props);
    this.state = {
      sourceObjectId: props.sourceObjectId || null,
    };
  }

  state: State = {};

  onCancel = () => {
    trackFormCancel(this.props.selectedNotification?.id, {
      kind: this.props.createFormOpenType,
    });
    this.props.onCancel();
    this.props.closeForm();
    this.setState({ sourceObjectId: null });
  };

  onSubmitIntent = () => {
    trackFormSubmitIntent(this.props.selectedNotification?.id, {
      kind: this.props.createFormOpenType,
    });
  };

  onSubmit = (n: MarketingNotification) => {
    if (this.props.selectedNotification) {
      trackFormSuccess(this.props.selectedNotification?.id, {
        kind: this.props.createFormOpenType,
      });
      this.props.onUpdateMarketingNotification(
        this.props.selectedNotification.id,
        n,
      );
    } else {
      trackFormSuccess(undefined, { kind: this.props.createFormOpenType });
      this.props.onCreateMarketingNotification(n, {});
      this.props.closeForm();
      this.setState({ sourceObjectId: null });
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

  componentDidUpdate(prevProps: Props) {
    if (
      (prevProps.createFormOpenType !== this.props.createFormOpenType &&
        this.props.createFormOpenType) ||
      (this.props.selectedNotification?.id !==
        prevProps.selectedNotification?.id &&
        this.props.selectedNotification?.id)
    ) {
      trackFormAdd(this.props.selectedNotification?.id, {
        kind: this.props.createFormOpenType,
      });
    }
  }

  render() {
    if (
      this.props.createFormOpenType &&
      this.props.createFormOpenType !== 'birthday' &&
      typeof this.state.sourceObjectId !== 'number'
    ) {
      return (
        <NotificationSourceSelector
          contracts={this.props.contracts}
          establishmentGroups={this.props.establishmentGroups}
          establishments={this.props.establishments}
          identifier={this.props.createFormOpenType}
          metaActivities={
            this.props.createFormOpenType === 'workshop'
              ? this.props.workshopList
              : this.props.metaActivities
          }
          onCancel={this.onCancel}
          onClose={this.props.closeForm}
          onSubmit={(sourceObjectId) => {
            this.setState({
              sourceObjectId,
            });
          }}
          paymentPacks={this.props.paymentPacks}
          privatePasses={this.props.privatePasses}
          privateServices={this.props.privateServices}
        />
      );
    }

    let identifier = '';
    let objectId = -1;

    if (this.state.sourceObjectId) {
      /* eslint-disable-next-line */
      identifier = this.props.createFormOpenType;
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
        contract_id,
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
      if (contract_id !== undefined) {
        identifier = 'contract';
        objectId = contract_id;
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
          emailDetailLoading={this.props.emailDetailLoading}
          emailDetails={this.props.emailDetails}
          emailListLoading={this.props.emailListLoading}
          emails={this.props.emailSummaryList}
          getEmailDetail={this.props.getEmailDetail}
          getEmails={this.props.getEmails}
          getSmartLists={this.props.getSmartLists}
          goToSmartlist={this.props.goToSmartlist}
          identifier={identifier}
          initial={this.props.selectedNotification}
          objectId={objectId}
          onCancel={this.onCancel}
          onSubmit={this.onSubmit}
          onSubmitIntent={this.onSubmitIntent}
          resolvedGenericTags={this.props.resolvedGenericTags}
          smartLists={this.props.smartLists}
          tags={this.getMergeTags()}
        />
      );
    }

    if (identifier === 'private_service') {
      return (
        <MarketingRuleFormPrivateBooking
          emailDetailLoading={this.props.emailDetailLoading}
          emailDetails={this.props.emailDetails}
          emailListLoading={this.props.emailListLoading}
          emails={this.props.emailSummaryList}
          getEmailDetail={this.props.getEmailDetail}
          getEmails={this.props.getEmails}
          getSmartLists={this.props.getSmartLists}
          goToSmartlist={this.props.goToSmartlist}
          initial={this.props.selectedNotification}
          onCancel={this.onCancel}
          onSubmit={this.onSubmit}
          onSubmitIntent={this.onSubmitIntent}
          resolvedGenericTags={this.props.resolvedGenericTags}
          serviceId={objectId}
          smartLists={this.props.smartLists}
          tags={this.getMergeTags()}
        />
      );
    }

    if (identifier === 'payment_pack' || identifier === 'private_pass') {
      return (
        <MarketingRuleFormProduct
          emailDetailLoading={this.props.emailDetailLoading}
          emailDetails={this.props.emailDetails}
          emailListLoading={this.props.emailListLoading}
          emails={this.props.emailSummaryList}
          getEmailDetail={this.props.getEmailDetail}
          getEmails={this.props.getEmails}
          getSmartLists={this.props.getSmartLists}
          goToSmartlist={this.props.goToSmartlist}
          id={objectId}
          identifier={identifier}
          initial={this.props.selectedNotification}
          onCancel={this.onCancel}
          onSubmit={this.onSubmit}
          onSubmitIntent={this.onSubmitIntent}
          resolvedGenericTags={this.props.resolvedGenericTags}
          smartListLoading={this.props.smartListLoading}
          smartLists={this.props.smartLists}
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
          emailDetails={this.props.emailDetails}
          emailListLoading={this.props.emailListLoading}
          emails={this.props.emailSummaryList}
          getEmailDetail={this.props.getEmailDetail}
          getEmails={this.props.getEmails}
          getSmartLists={this.props.getSmartLists}
          goToSmartlist={this.props.goToSmartlist}
          initial={this.props.selectedNotification}
          onCancel={this.onCancel}
          onSubmit={this.onSubmit}
          onSubmitIntent={this.onSubmitIntent}
          resolvedGenericTags={this.props.resolvedGenericTags}
          smartLists={this.props.smartLists}
          tags={this.getMergeTags()}
        />
      );
    }

    if (identifier === 'contract') {
      return (
        <MarketingRuleFormContract
          emailDetailLoading={this.props.emailDetailLoading}
          emailDetails={this.props.emailDetails}
          emailListLoading={this.props.emailListLoading}
          emails={this.props.emailSummaryList}
          getEmailDetail={this.props.getEmailDetail}
          getEmails={this.props.getEmails}
          getSmartLists={this.props.getSmartLists}
          goToSmartlist={this.props.goToSmartlist}
          id={objectId}
          initial={this.props.selectedNotification}
          onCancel={this.onCancel}
          onSubmit={this.onSubmit}
          resolvedGenericTags={this.props.resolvedGenericTags}
          smartListLoading={this.props.smartListLoading}
          smartLists={this.props.smartLists}
          tags={this.getMergeTags()}
        />
      );
    }

    return null;
  }
}

export default compose<any, OwnProps>(withTranslation(['marketing']))(
  MarketingRuleFormGeneric,
);
