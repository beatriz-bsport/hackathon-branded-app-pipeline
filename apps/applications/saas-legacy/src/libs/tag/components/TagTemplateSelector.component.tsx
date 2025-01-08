import React, { CSSProperties, useRef } from 'react';

import Select, { components } from 'react-select';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { colors } from '@bsport/common/colors.js';
import BlockIcon from '@material-ui/icons/Block';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import type { TagGroup, TagTemplate } from '#src/libs/tag/types';
import TagChip from '#src/libs/tag/components/TagChip.component';
import type {
  FranchiseUserTagDict,
  FranchiseUserTagOption,
} from '#src/libs/franchise/types';
import omit from 'lodash/omit';
import type { MultiValueProps } from 'react-select/lib/components/MultiValue';
import type { SingleValueProps } from 'react-select/lib/components/SingleValue';
import type { IndicatorProps } from 'react-select/lib/components/indicators';

type Props = {
  allTags: TagTemplate[];
  allTagsGroupedByTagGroup: TagGroup[];
  closeMenuOnSelect?: boolean;
  id?: string;
  inScrollBar?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  menuPlacement?: 'auto' | 'top';
  noMulti?: boolean;
  selectedTagsByTagGroup?: FranchiseUserTagDict;
  setSelectedTagsByTagGroup: React.Dispatch<
    React.SetStateAction<FranchiseUserTagDict>
  >;
};

const MultiValueContainer: React.FC<MultiValueProps<FranchiseUserTagOption>> =
  React.memo(({ ...props }) => {
    const handleDelete = React.useCallback(
      () => props?.data && props?.selectProps?.onDeleteTag?.(props.data),
      [props.data, props?.selectProps],
    );

    return (
      <components.MultiValueContainer {...props}>
        <div onMouseDown={handleDelete}>
          {props?.data?.tag && (
            <TagChip
              deleteOnClick
              onDelete={handleDelete}
              size="small"
              tag={props?.data.tag}
            />
          )}
        </div>
      </components.MultiValueContainer>
    );
  });

const MultiValue: React.FC<MultiValueProps<FranchiseUserTagOption>> =
  React.memo(({ ...props }) => <components.MultiValue {...props} />);

const SingleValue: React.FC<SingleValueProps<FranchiseUserTagOption>> =
  React.memo(({ ...props }) => {
    const handleDelete = React.useCallback(
      () => props?.data && props?.selectProps?.onDeleteTag?.(props.data),
      [props.data, props?.selectProps],
    );

    return (
      <components.SingleValue {...props}>
        {props?.data?.tag && (
          <TagChip onDelete={handleDelete} size="small" tag={props?.data.tag} />
        )}
      </components.SingleValue>
    );
  });

const DropdownIndicator: React.FC<IndicatorProps<FranchiseUserTagOption>> =
  React.memo(({ ...props }) => (
    <components.DropdownIndicator {...props}>
      {props.selectProps.isDisabled ? (
        <BlockIcon fontSize="small" />
      ) : (
        <ExpandMoreIcon fontSize="small" />
      )}
    </components.DropdownIndicator>
  ));

const TagTemplateSelector: React.FC<Props> = ({
  allTags,
  allTagsGroupedByTagGroup,
  closeMenuOnSelect,
  id,
  inScrollBar,
  isClearable,
  isDisabled,
  menuPlacement,
  noMulti,
  selectedTagsByTagGroup,
  setSelectedTagsByTagGroup,
}) => {
  const { t } = useTranslation('franchise');

  const divRef = useRef<HTMLDivElement | null>(null);

  const tagsWithTagGroup = React.useMemo(
    () =>
      [...allTags].map((tag) => ({
        ...tag,
        group: allTagsGroupedByTagGroup.find(
          (tag_group) => tag_group.id === tag.group,
        ),
      })),
    [allTags, allTagsGroupedByTagGroup],
  );

  const tagListOptions = React.useMemo(
    () =>
      [...tagsWithTagGroup].map((tag) => ({
        label: tag.name,
        value: tag.id,
        tag: tag,
      })),
    [tagsWithTagGroup],
  );

  const tagsOptionsSelected = React.useMemo(
    () =>
      selectedTagsByTagGroup && !!tagListOptions?.length
        ? tagListOptions.filter((tagOption) =>
            Object.values(selectedTagsByTagGroup).includes(tagOption.value),
          )
        : null,
    [selectedTagsByTagGroup, tagListOptions],
  );

  const tagGroupedByTagGroupOptions = React.useMemo(
    () =>
      [...allTagsGroupedByTagGroup].map((tagGroup) => ({
        label: tagGroup.name,
        value: tagGroup.id,
        options: tagGroup.tags.map((tag) => ({
          value: tag.id,
          label: tag.name,
          tag: { ...tag, group: tagGroup },
        })),
      })),
    [allTagsGroupedByTagGroup],
  );

  const handleSetTag = React.useCallback(
    (options: FranchiseUserTagOption[]) => {
      if (!options.length) {
        setSelectedTagsByTagGroup({});
      } else {
        const addedTag = options?.at(-1)?.tag;
        !!addedTag &&
          setSelectedTagsByTagGroup((prevState: FranchiseUserTagDict) => ({
            ...prevState,
            [addedTag.group_template]: addedTag.id,
          }));
      }
    },
    [setSelectedTagsByTagGroup],
  );

  const handleDeleteTag = React.useCallback(
    (option: FranchiseUserTagOption) => {
      option?.tag &&
        setSelectedTagsByTagGroup((prevState: FranchiseUserTagDict) =>
          omit(prevState, option.tag.group_template),
        );
    },
    [setSelectedTagsByTagGroup],
  );

  const getBackgroundColor = React.useCallback(
    (isSelected: boolean, isFocused: boolean) => {
      if (isDisabled) {
        return null;
      }

      if (isSelected) {
        return colors.primary;
      }
      const color = chroma(colors.secondary);

      if (isFocused) {
        return color.alpha(0.1).css();
      }

      return null;
    },
    [isDisabled],
  );

  const getColor = React.useCallback(
    (isSelected: boolean, isFocused: boolean) => {
      if (isDisabled) {
        return '#ccc';
      }
      const color = chroma(colors.secondary);

      if (isSelected) {
        return chroma.contrast(color, 'white') > 2 ? 'white' : 'black';
      }

      if (isFocused) {
        return colors.secondary;
      }

      return null;
    },
    [isDisabled],
  );

  const tagGroupStyles = {
    groupHeading: (base: CSSProperties) => ({
      ...base,
      margin: 0,
      color: '#868686',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      borderBottom: '1px solid #868686',
    }),
    control: (styles: CSSProperties) => ({
      ...styles,
      backgroundColor: 'white',
      paddingTop: '4px',
      paddingBottom: '4px',
      zIndex: 1,
    }),
    menuPortal: (base: CSSProperties) => ({ ...base, zIndex: 9999 }),
    option: (
      styles: CSSProperties,
      { isFocused, isSelected }: { isFocused: boolean; isSelected: boolean },
    ) => {
      const color = chroma(colors.secondary);

      return {
        ...styles,
        backgroundColor: getBackgroundColor(isFocused, isSelected),
        color: getColor(isFocused, isSelected),
        cursor: isDisabled ? 'not-allowed' : 'default',

        ':active': {
          // @ts-expect-error
          ...styles[':active'],
          backgroundColor:
            !isDisabled &&
            (isSelected ? colors.secondary : color.alpha(0.3).css()),
        },
      };
    },
    multiValue: (styles: CSSProperties) => {
      return {
        ...styles,
        backgroundColor: 'transparent',
      };
    },
    multiValueLabel: (styles: CSSProperties) => ({
      ...styles,
      color: colors.secondary,
    }),
    multiValueRemove: (styles: CSSProperties) => ({
      ...styles,
      color: colors.secondary,
      ':hover': {
        backgroundColor: colors.secondary,
        color: 'white',
      },
    }),
  };

  if (inScrollBar) {
    return (
      <div ref={divRef} style={{ position: 'relative', width: '100%' }}>
        <Select
          closeMenuOnSelect={closeMenuOnSelect}
          components={{
            SingleValue,
            DropdownIndicator,
            MultiValueContainer,
            MultiValue,
          }}
          id={id}
          isClearable={!!isClearable}
          isDisabled={!!isDisabled}
          isMulti={!noMulti}
          menuPlacement={menuPlacement}
          menuPortalTarget={divRef.current}
          onChange={handleSetTag}
          onDeleteTag={handleDeleteTag}
          options={tagGroupedByTagGroupOptions}
          placeholder={t('userProfile.tagModalPlaceholcer')}
          styles={{
            ...tagGroupStyles,
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
              position: 'absolute',
              top: '100%',
              left: '0px',
            }),
          }}
          tagList={tagsWithTagGroup}
          value={tagsOptionsSelected}
        />
      </div>
    );
  }

  return (
    <Select
      closeMenuOnSelect={closeMenuOnSelect}
      components={{
        SingleValue,
        DropdownIndicator,
        MultiValueContainer,
        MultiValue,
      }}
      id={id}
      isClearable={!!isClearable}
      isDisabled={!!isDisabled}
      isMulti={!noMulti}
      menuPlacement={menuPlacement}
      menuPortalTarget={document.querySelector('body')}
      onChange={handleSetTag}
      onDeleteTag={handleDeleteTag}
      options={tagGroupedByTagGroupOptions}
      placeholder={t('userProfile.tagModalPlaceholcer')}
      styles={tagGroupStyles}
      tagList={tagsWithTagGroup}
      value={tagsOptionsSelected}
    />
  );
};

export default React.memo(TagTemplateSelector);
