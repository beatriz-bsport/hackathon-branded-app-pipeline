import React from 'react';
import { useTranslation } from 'react-i18next';

import { useFormik } from 'formik';

import TagSelector from '#src/libs/tag/components/TagSelector.selector';
import { TagActionType } from '#src/libs/sequential_marketing/constants';
import { tagValidationSchema } from '#src/libs/sequential_marketing/components/form/marketing_actions/validationSchemas';

import type { Tag, TagGroup, TagGroupAPI } from '#src/libs/tag/types';
import type {
  StepMarketingActions,
  StepMarketingActionsTagSpec,
} from '#src/libs/sequential_marketing/types';

export type Props = {
  marketingAction: Partial<StepMarketingActions>;
  tagList: Tag<TagGroupAPI>[];
  withoutValidation?: boolean;
  submit?: (data: Partial<StepMarketingActions>) => void;
};

const TagForm: React.FC<Props> = ({
  marketingAction,
  tagList,
  withoutValidation,
  submit,
}) => {
  const { t } = useTranslation('marketing');
  const formik = useFormik<Partial<StepMarketingActions>>({
    initialValues: marketingAction,
    enableReinitialize: true,
    onSubmit: submit,
    validationSchema: withoutValidation ? null : tagValidationSchema,
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
    const action_spec = formik.values.action_spec;
    if (!!action_spec && 'tag_id' in action_spec) {
      return action_spec;
    }
    return { tag_id: null, tag_action_type: TagActionType.ADD };
  }, [formik.values.action_spec]);

  return (
    <TagSelector
      closeMenuOnSelect
      isClearable
      noMulti
      allTagsWithTagGroup={tagList}
      //@ts-expect-error: TagSelector expects options to be a list but it's not
      onChange={handleChangeTag}
      onDeleteTag={handleDeleteTag}
      placeholder={t(`cadence.form.marketing_action.select_tag`)}
      selectedTags={[actionSpec?.tag_id]}
    />
  );
};

export default React.memo(TagForm);
