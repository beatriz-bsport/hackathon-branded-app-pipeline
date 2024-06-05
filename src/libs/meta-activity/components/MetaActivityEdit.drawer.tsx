import React from 'react';
import { WithTranslation, useTranslation } from 'react-i18next';
// @ts-expect-error
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { Tag, TagGroup } from '#libs/tag/types';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { ResolvedGenericTags } from '#libs/email-editor/types';
import { OptionCallback } from '../../../state/types';
import MetaActivityForm from './MetaActivityForm.component';

type OwnProps = {
  open: boolean;
  isWorkshop?: boolean;
  SCTs: any;
  initial: any;
  onCancel: () => void;
  tags: Array<Tag<TagGroup>>;
  onSubmit: (values: any, options: OptionCallback) => void;
  resolvedGenericTags: ResolvedGenericTags;
};
type Props = OwnProps & WithTranslation;
export const MetaActivityEditDrawer = (props: Props) => {
  const { t } = useTranslation('');
  const { trackFormCancel } = rudderStackFormTrackingFunctionsRegistry(
    props.isWorkshop
      ? SegmentAnalyticsFormObjectIdentifier.Workshop
      : SegmentAnalyticsFormObjectIdentifier.Activity,
  );
  return (
    <GenericResponsiveDrawer
      onClose={() => {
        props.onCancel();
        trackFormCancel(props.initial?.id);
      }}
      open={props.open}
      subtitle={
        props.isWorkshop
          ? t('titles:workshopActivity.workshopActivityEditFormSubtitle')
          : t('titles:metaActivity.metaActivityEditFormSubtitle')
      }
      title={
        props.isWorkshop
          ? t('titles:workshopActivity.workshopActivityFormPage')
          : t('titles:metaActivity.metaActivityFormPage')
      }
    >
      <MetaActivityForm
        is_broadcast_enabled
        initial={props.initial}
        onCancel={props.onCancel}
        onSubmit={props.onSubmit}
        resolvedGenericTags={props.resolvedGenericTags}
        SCTs={props.SCTs}
        tags={props.tags}
        variant={props.isWorkshop ? 'workshop' : null}
      />
    </GenericResponsiveDrawer>
  );
};

export default MetaActivityEditDrawer;
