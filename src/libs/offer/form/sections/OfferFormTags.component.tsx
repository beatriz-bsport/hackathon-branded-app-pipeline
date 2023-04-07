import React, { useCallback, useMemo } from 'react';

import LabelIcon from '@material-ui/icons/Label';
import BlockIcon from '@material-ui/icons/Block';
import CheckIcon from '@material-ui/icons/Check';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import FormSection from '#components/forms/FormSection';
import { useOfferFormStyles } from '#libs/offer/hooks';
import OfferFormField from '#libs/offer/form/OfferFormField.component';
import { TagSelector } from '#libs/tag/components/TagSelector.selector';

import { Tag, TagGroup } from '#libs/tag/types';
import { OfferFormValues } from '#libs/offer/types';

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
        ? tagList.filter(
            (tag) => !selectedBlacklistTags?.includes(tag.id) ?? tag,
          )
        : [],
    [selectedBlacklistTags, tagList],
  );
  const availableBlacklistTags = useMemo(
    () =>
      tagList?.length
        ? tagList.filter(
            (tag) => !selectedWhitelistTags?.includes(tag.id) ?? tag,
          )
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
      id="offer-form-tags-section"
      sectionTitle={t('form.section.tags.title')}
      sectionIcon={LabelIcon}
      isCollapse
      sectionCustomIconStyle={classes.sectionIcon}
      sectionIconContainerStyle={classes.sectionIconContainer}
    >
      <div>
        <Typography variant="caption">
          {t('form.section.tags.helperText')}
        </Typography>
      </div>

      <OfferFormField
        label={t('form.section.tags.field.whitelistTags')}
        isFlexColumn
        icon={<CheckIcon className={classes.tagSelectorIcon} />}
      >
        <div className={classes.fullWidth}>
          <TagSelector
            id="offer-form-whitelist-tags-selector"
            allTagsWithTagGroup={availableWhitelistTags}
            placeholder={t('form.section.tags.placeholder')}
            onChange={handleSelectWhitelistTag}
            onDeleteTag={handleDeleteWhitelistTag}
            selectedTags={selectedWhitelistTags}
            isClearable
            closeMenuOnSelect
            inScrollBar
          />
        </div>
      </OfferFormField>

      <OfferFormField
        label={t('form.section.tags.field.blacklistTags')}
        isFlexColumn
        icon={<BlockIcon className={classes.tagSelectorIcon} />}
      >
        <div className={classes.fullWidth}>
          <TagSelector
            id="offer-form-blacklist-tags-selector"
            allTagsWithTagGroup={availableBlacklistTags}
            placeholder={t('form.section.tags.placeholder')}
            onChange={handleSelectBlacklistTag}
            onDeleteTag={handleDeleteBlacklistTag}
            selectedTags={selectedBlacklistTags}
            isClearable
            closeMenuOnSelect
            inScrollBar
          />
        </div>
      </OfferFormField>
    </FormSection>
  );
};

export default OfferFormTags;
