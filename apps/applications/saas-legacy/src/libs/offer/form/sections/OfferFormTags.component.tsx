import React, { useCallback, useMemo } from 'react';

import LabelIcon from '@material-ui/icons/Label';
import BlockIcon from '@material-ui/icons/Block';
import CheckIcon from '@material-ui/icons/Check';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import FormSection from '#src/components/forms/FormSection';
import { useOfferFormStyles } from '#src/libs/offer/hooks';
import OfferFormField from '#src/libs/offer/form/OfferFormField.component';
import TagSelector from '#src/libs/tag/components/TagSelector.selector';

import { Tag, TagGroup } from '#src/libs/tag/types';
import { OfferFormValues } from '#src/libs/offer/types';

type Props = {
  tagList: Tag<TagGroup>[];
};

const OfferFormTags = (props: Props) => {
  const { tagList } = props;
  const classes = useOfferFormStyles();
  const { t } = useTranslation('offer');
  const { values, setFieldValue } = useFormikContext<OfferFormValues>();
  const { selectedWhitelistTags, selectedBlacklistTags } = values;

  const availableWhitelistTags = useMemo(
    () =>
      tagList?.length
        ? tagList.filter((tag) => !selectedBlacklistTags?.includes(tag.id))
        : [],
    [selectedBlacklistTags, tagList],
  );
  const availableBlacklistTags = useMemo(
    () =>
      tagList?.length
        ? tagList.filter((tag) => !selectedWhitelistTags?.includes(tag.id))
        : [],
    [selectedWhitelistTags, tagList],
  );

  const handleSelectTag = useCallback(
    (
      key: 'selectedWhitelistTags' | 'selectedBlacklistTags',
      tags: { label: string; value: number; tag: Tag<TagGroup> }[],
    ) => {
      const parsedTags = tags.map((tag) => tag.value);
      setFieldValue(key, parsedTags);
    },
    [setFieldValue],
  );

  const handleDeleteTag = useCallback(
    (key: 'selectedWhitelistTags' | 'selectedBlacklistTags', tagId: number) => {
      setFieldValue(
        key,
        values[key].filter((tag) => tag !== tagId),
      );
    },
    [setFieldValue, values],
  );

  const handleSelectWhitelistTag = useCallback(
    (tags) => handleSelectTag('selectedWhitelistTags', tags),
    [handleSelectTag],
  );

  const handleSelectBlacklistTag = useCallback(
    (tags) => handleSelectTag('selectedBlacklistTags', tags),
    [handleSelectTag],
  );

  const handleDeleteWhitelistTag = useCallback(
    (tagId) => handleDeleteTag('selectedWhitelistTags', tagId),
    [handleDeleteTag],
  );

  const handleDeleteBlacklistTag = useCallback(
    (tagId) => handleDeleteTag('selectedBlacklistTags', tagId),
    [handleDeleteTag],
  );

  return (
    <FormSection
      isCollapse
      id="offer-form-tags-section"
      sectionCustomIconStyle={classes.sectionIcon}
      sectionIcon={LabelIcon}
      sectionIconContainerStyle={classes.sectionIconContainer}
      sectionTitle={t('form.section.tags.title')}
    >
      <div>
        <Typography variant="caption">
          {t('form.section.tags.helperText')}
        </Typography>
      </div>

      <OfferFormField
        icon={<CheckIcon className={classes.tagSelectorIcon} />}
        label={t('form.section.tags.field.whitelistTags')}
      >
        <div className={classes.fullWidth}>
          <TagSelector
            closeMenuOnSelect
            inScrollBar
            isClearable
            allTagsWithTagGroup={availableWhitelistTags}
            id="offer-form-whitelist-tags-selector"
            onChange={handleSelectWhitelistTag}
            onDeleteTag={handleDeleteWhitelistTag}
            placeholder={t('form.section.tags.placeholder')}
            selectedTags={selectedWhitelistTags}
          />
        </div>
      </OfferFormField>

      <OfferFormField
        icon={<BlockIcon className={classes.tagSelectorIcon} />}
        label={t('form.section.tags.field.blacklistTags')}
      >
        <div className={classes.fullWidth}>
          <TagSelector
            closeMenuOnSelect
            inScrollBar
            isClearable
            allTagsWithTagGroup={availableBlacklistTags}
            id="offer-form-blacklist-tags-selector"
            onChange={handleSelectBlacklistTag}
            onDeleteTag={handleDeleteBlacklistTag}
            placeholder={t('form.section.tags.placeholder')}
            selectedTags={selectedBlacklistTags}
          />
        </div>
      </OfferFormField>
    </FormSection>
  );
};

export default React.memo(OfferFormTags);
