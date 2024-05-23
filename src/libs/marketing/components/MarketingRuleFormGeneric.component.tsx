import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';

import { Contract } from '#src/libs/subscription/types';
import { SmartList } from '#src/libs/smart-list/types';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
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

import MarketingRuleFormBirthday from './marketing-rule-form/MarketingRuleFormBirthday.component';
import NotificationSourceSelector from './NotificationSourceSelector.component';

import { MetaActivity } from '../../meta-activity/types';
import { Establishment, EstablishmentGroup } from '../../establishment/types';
import { PrivatePass, PrivateService } from '../../private-service/types';
import { PaymentPack } from '../../payment-packs/types';
import MarketingRuleFormContract from './marketing-rule-form/MarketingRuleFormContract.component';
import { PassSelectorDialog } from './PassSelectorDialog.component';

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
  closeForm: () => void;
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
  establishmentGroups: Array<EstablishmentGroup>;
  createFormOpenType: Identifier;
  sourceObjectId?: number;
  sourceObjectIds?: number[];
  containsAllSourceObjects?: boolean;
};

type Props = OwnProps & WithTranslation;

type State = {
  sourceObjectId: number | null;
  sourceObjectIds: number[];
  containsAllSourceObjects: boolean;
  sourceObjectSelected: boolean;
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
  constructor(props: Props) {
    super(props);
    this.state = {
      sourceObjectId: props.sourceObjectId || null,
      sourceObjectIds: props.sourceObjectIds || [],
      containsAllSourceObjects: props.containsAllSourceObjects || false,
      sourceObjectSelected: false,
    };
  }

  state: State = {
    sourceObjectId: null,
    sourceObjectIds: [],
    containsAllSourceObjects: false,
    sourceObjectSelected: false,
  };

  onCancel = () => {
    trackFormCancel(this.props.selectedNotification?.id, {
      kind: this.props.createFormOpenType,
    });
    this.props.onCancel();
    this.props.closeForm();
    this.setState({
      sourceObjectId: null,
      sourceObjectIds: [],
      sourceObjectSelected: false,
    });
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
      this.setState({
        sourceObjectId: null,
        sourceObjectIds: [],
        sourceObjectSelected: false,
      });
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

  onSelectSourceObjectSingle = (sourceObjectId: number) => {
    this.setState({
      sourceObjectId,
      sourceObjectSelected: true,
    });
  };

  onSelectSourceObjectMultiple = (
    sourceObjectIds: number[],
    allSourceObjects: boolean,
  ) => {
    this.setState({
      sourceObjectIds,
      containsAllSourceObjects: allSourceObjects || false,
      sourceObjectSelected: true,
    });
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
      (this.props.createFormOpenType === 'payment_pack' ||
        this.props.createFormOpenType === 'private_pass') &&
      !this.state.sourceObjectSelected
    ) {
      return (
        <PassSelectorDialog
          open
          identifier={this.props.createFormOpenType}
          onClose={this.props.closeForm}
          onSubmit={this.onSelectSourceObjectMultiple}
          passes={
            this.props.createFormOpenType === 'payment_pack'
              ? this.props.paymentPacks
              : this.props.privatePasses
          }
        />
      );
    }
    if (
      this.props.createFormOpenType &&
      this.props.createFormOpenType !== 'payment_pack' &&
      this.props.createFormOpenType !== 'private_pass' &&
      this.props.createFormOpenType !== 'birthday' &&
      !this.state.sourceObjectSelected
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
          onSubmit={this.onSelectSourceObjectSingle}
          privateServices={this.props.privateServices}
        />
      );
    }

    let identifier: Identifier;
    let objectId: number;
    let objectIds: number[];
    let containsAllObjects: boolean;

    if (this.state.sourceObjectSelected) {
      identifier = this.props.createFormOpenType;
      objectId = this.state.sourceObjectId;
      objectIds = this.state.sourceObjectIds;
      containsAllObjects = this.state.containsAllSourceObjects;
    }

    if (this.props.selectedNotification) {
      const {
        establishment_id,
        establishment_group_id,
        meta_activity_id,
        private_service_id,
        contains_all_payment_packs,
        payment_pack_ids,
        contains_all_private_passes,
        private_pass_ids,
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

      if (payment_pack_ids !== undefined) {
        identifier = 'payment_pack';
        objectIds = payment_pack_ids;
      }

      if (contains_all_payment_packs) {
        identifier = 'payment_pack';
        objectIds = [];
        containsAllObjects = true;
      }

      if (private_pass_ids !== undefined) {
        identifier = 'private_pass';
        objectIds = private_pass_ids;
      }

      if (contains_all_private_passes) {
        identifier = 'private_pass';
        objectIds = [];
        containsAllObjects = true;
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
          // @ts-expect-error
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
          // @ts-expect-error
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
          containsAllPasses={containsAllObjects}
          emailDetailLoading={this.props.emailDetailLoading}
          // @ts-expect-error
          emailDetails={this.props.emailDetails}
          emailListLoading={this.props.emailListLoading}
          emails={this.props.emailSummaryList}
          getEmailDetail={this.props.getEmailDetail}
          getEmails={this.props.getEmails}
          getSmartLists={this.props.getSmartLists}
          goToSmartlist={this.props.goToSmartlist}
          identifier={identifier}
          ids={objectIds}
          initial={this.props.selectedNotification}
          onCancel={this.onCancel}
          onSubmit={this.onSubmit}
          onSubmitIntent={this.onSubmitIntent}
          resolvedGenericTags={this.props.resolvedGenericTags}
          smartListLoading={this.props.smartListLoading}
          smartLists={this.props.smartLists}
          // @ts-expect-error
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
          // @ts-expect-error
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
          // @ts-expect-error
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
          // @ts-expect-error
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
