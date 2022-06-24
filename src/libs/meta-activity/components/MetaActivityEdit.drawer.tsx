import React from 'react';
import { WithTranslation, useTranslation } from 'react-i18next';
import MetaActivityForm from './MetaActivityForm.component';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { Tag, TagGroup } from '#libs/tag/types';
import { OptionCallback } from '../../../state/types';

type OwnProps = {
  open: boolean;
  isWorkshop?: boolean;
  SCTs: any;
  initial: any;
  onCancel: () => void;
  tags: Array<Tag<TagGroup>>;
  onSubmit: (values: any, options: OptionCallback) => void;
};
type Props = OwnProps & WithTranslation;
export const MetaActivityEditDrawer = (props: Props) => {
  const { t } = useTranslation('');
  return (
    <GenericResponsiveDrawer
      open={props.open}
      onClose={() => {
        props.onCancel();
      }}
      title={
        props.isWorkshop
          ? t('titles:workshopActivity.workshopActivityFormPage')
          : t('titles:metaActivity.metaActivityFormPage')
      }
      subtitle={
        props.isWorkshop
          ? t('titles:workshopActivity.workshopActivityEditFormSubtitle')
          : t('titles:metaActivity.metaActivityEditFormSubtitle')
      }
    >
      <MetaActivityForm
        initial={props.initial}
        variant={props.isWorkshop ? 'workshop' : null}
        SCTs={props.SCTs}
        onSubmit={props.onSubmit}
        onCancel={props.onCancel}
        is_broadcast_enabled
        tags={props.tags}
      />
    </GenericResponsiveDrawer>
  );
};
export default MetaActivityEditDrawer;
