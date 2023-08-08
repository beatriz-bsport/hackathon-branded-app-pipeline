import React from 'react';
import { useTranslation } from 'react-i18next';

import { useFormik } from 'formik';

import { TagSelector } from '#libs/tag/components/TagSelector.selector';
import { tagValidationSchema } from '#libs/sequential_marketing/components/form/marketing_actions/validationSchemas';

import type { Tag, TagGroup, TagGroupAPI } from '#libs/tag/types';
import type {
  StepMarketingActions,
  StepMarketingActionsTagSpec,
} from '#libs/sequential_marketing/types';

export type Props = {
  marketingAction: StepMarketingActions;
  tagList: Tag<TagGroupAPI>[];
  submit?: (data: StepMarketingActions) => void;
};

const TagForm: React.FC<Props> = ({ marketingAction, tagList, submit }) => {
  const { t } = useTranslation('marketing');
  const formik = useFormik<StepMarketingActions>({
    initialValues: marketingAction,
    enableReinitialize: true,
    onSubmit: submit,
    validationSchema: tagValidationSchema,
  });

  const { setFieldValue, handleSubmit } = formik;

  const handleChangeTag = React.useCallback(
    async (options?: { tag: Tag<TagGroup>; label: string; value: number }) => {
      await setFieldValue(`action_spec.tag_id`, options?.value ?? null);
      handleSubmit?.();
    },
    [handleSubmit, setFieldValue],
  );

  const handleDeleteTag = React.useCallback(async () => {
    await setFieldValue(`action_spec.tag_id`, null);
    handleSubmit?.();
  }, [handleSubmit, setFieldValue]);

  const actionSpec: StepMarketingActionsTagSpec = React.useMemo(() => {
    if ('tag_id' in formik.values.action_spec) {
      return formik.values.action_spec;
    }
    return { tag_id: null };
  }, [formik.values.action_spec]);

  return (
    <TagSelector
      closeMenuOnSelect
      inScrollBar
      isClearable
      noMulti
      allTagsWithTagGroup={tagList}
      // @ts-expect-error : no multi - TagSelector needs refactor
      onChange={handleChangeTag}
      onDeleteTag={handleDeleteTag}
      placeholder={t(`cadence.form.marketing_action.select_tag`)}
      selectedTags={[actionSpec?.tag_id]}
    />
  );
};

export default React.memo(TagForm);
