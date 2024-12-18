import React, { useEffect } from 'react';
import { WithTranslation, useTranslation } from 'react-i18next';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import { Tag, TagGroup } from '#src/libs/tag/types';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { ResolvedGenericTags } from '#src/libs/email-editor/types';
import { OptionCallback } from '../../../state/types';
import useFeatureProvider from '#src/libs/company/hooks/feature-list-provider.hook';
// @ts-expect-error
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

  fetchIsMetaActivityPublishedOnUSC?: (metaActivityId: number) => void;
  getIsMetaActivityPublishedOnUSC?: (metaActivityId: number) => boolean;
  id?: number;
};
type Props = OwnProps & WithTranslation;
export const MetaActivityEditDrawer: React.FC<Props> = ({
  open,
  isWorkshop,
  SCTs,
  initial,
  onCancel,
  tags,
  onSubmit,
  resolvedGenericTags,
  fetchIsMetaActivityPublishedOnUSC,
  getIsMetaActivityPublishedOnUSC,
  id,
}) => {
  const { t } = useTranslation('');

  const { USCEnabled } = useFeatureProvider();

  useEffect(() => {
    if (id && !isWorkshop && USCEnabled)
      fetchIsMetaActivityPublishedOnUSC?.(id);
  }, [USCEnabled, fetchIsMetaActivityPublishedOnUSC, id, isWorkshop]);

  const { trackFormCancel } = rudderStackFormTrackingFunctionsRegistry(
    isWorkshop
      ? SegmentAnalyticsFormObjectIdentifier.Workshop
      : SegmentAnalyticsFormObjectIdentifier.Activity,
  );

  const metaActivityIsPublishedOnUSC = !!(
    USCEnabled &&
    id &&
    !isWorkshop &&
    getIsMetaActivityPublishedOnUSC?.(id)
  );

  return (
    <GenericResponsiveDrawer
      onClose={() => {
        onCancel();
        trackFormCancel(initial?.id);
      }}
      open={open}
      subtitle={
        isWorkshop
          ? t('titles:workshopActivity.workshopActivityEditFormSubtitle')
          : t('titles:metaActivity.metaActivityEditFormSubtitle')
      }
      title={
        isWorkshop
          ? t('titles:workshopActivity.workshopActivityFormPage')
          : t('titles:metaActivity.metaActivityFormPage')
      }
    >
      <MetaActivityForm
        is_broadcast_enabled
        initial={initial}
        metaActivityIsPublishedOnUSC={metaActivityIsPublishedOnUSC}
        onCancel={onCancel}
        onSubmit={onSubmit}
        resolvedGenericTags={resolvedGenericTags}
        SCTs={SCTs}
        tags={tags}
        variant={isWorkshop ? 'workshop' : null}
      />
    </GenericResponsiveDrawer>
  );
};

export default MetaActivityEditDrawer;
