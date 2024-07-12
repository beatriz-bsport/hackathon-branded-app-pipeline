import React, { CSSProperties, useRef } from 'react';

import Select, { components } from 'react-select';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { colors } from '@bsport/common/lib/colors';
import BlockIcon from '@material-ui/icons/Block';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import type { Tag, TagGroup, TagGroupAPI, TagOption } from '../types';
import TagChip from './TagChip.component';
import type { MultiValueProps } from 'react-select/lib/components/MultiValue';
import type { SingleValueProps } from 'react-select/lib/components/SingleValue';
import type { IndicatorProps } from 'react-select/lib/components/indicators';
import type { FranchiseUserTagDict } from '#src/libs/franchise/types';

export type Props = {
  onChange: (
    options: {
      label: string;
      value: number;
      tag: Tag<TagGroup> | Tag<TagGroupAPI>;
    }[],
  ) => void;
  onDeleteTag: (optionId: number) => void;
  id?: string;
  isDisabled?: boolean;
  placeholder?: string;
  noMulti?: boolean;
  isClearable?: boolean;
  closeMenuOnSelect?: boolean;
  selectedTags?: number[];
  allTagsWithTagGroup: Tag<TagGroup>[] | Tag<TagGroupAPI>[];
  inScrollBar?: boolean;
  menuPlacement?: 'auto' | 'top';
  variant?: 'standard' | 'exclusive';
};

const MultiValueContainer: React.FC<MultiValueProps<TagOption>> = React.memo(
  ({ ...props }) => {
    const handleDelete = React.useCallback(
      () =>
        props?.data?.value &&
        props?.selectProps?.onDeleteTag?.(props.data.value),
      [props.data.value, props?.selectProps],
    );

    return (
      <components.MultiValueContainer {...props}>
        <div onMouseDown={handleDelete}>
          {props?.data?.tag && (
            <TagChip
              deleteOnClick
              onDelete={handleDelete}
              size="small"
              //@ts-expect-error: TagChip expects tag to be of type Tag<TagGroup> but it is of type Tag | Tag<TagGroup> | Tag<TagGroupAPI>
              tag={props?.data.tag}
            />
          )}
        </div>
      </components.MultiValueContainer>
    );
  },
);

const MultiValue: React.FC<MultiValueProps<TagOption>> = React.memo(
  ({ ...props }) => <components.MultiValue {...props} />,
);

const SingleValue: React.FC<SingleValueProps<TagOption>> = React.memo(
  ({ ...props }) => {
    const handleDelete = React.useCallback(
      () =>
        props?.data?.value &&
        props?.selectProps?.onDeleteTag?.(props.data.value),
      [props.data.value, props?.selectProps],
    );

    return (
      <components.SingleValue {...props}>
        {props?.data?.tag && (
          //@ts-expect-error: TagChip expects tag to be of type Tag<TagGroup> but it is of type Tag | Tag<TagGroup> | Tag<TagGroupAPI>
          <TagChip onDelete={handleDelete} size="small" tag={props?.data.tag} />
        )}
      </components.SingleValue>
    );
  },
);

const DropdownIndicator: React.FC<IndicatorProps<TagOption>> = React.memo(
  ({ ...props }) => (
    <components.DropdownIndicator {...props}>
      {props.selectProps.isDisabled ? (
        <BlockIcon fontSize="small" />
      ) : (
        <ExpandMoreIcon fontSize="small" />
      )}
    </components.DropdownIndicator>
  ),
);

const TagSelector: React.FC<Props> = ({
  id,
  allTagsWithTagGroup,
  isDisabled,
  placeholder,
  noMulti,
  isClearable,
  closeMenuOnSelect,
  selectedTags,
  onChange,
  onDeleteTag,
  inScrollBar,
  menuPlacement,
  variant,
}) => {
  const { t } = useTranslation('tag');

  const divRef = useRef<HTMLDivElement | null>(null);

  const [selectedTagsByTagGroup, setSelectedTagsByTagGroup] =
    React.useState<FranchiseUserTagDict>({});

  const tagListOptions = React.useMemo(
    () =>
      [...allTagsWithTagGroup]?.map((tag) => ({
        label: tag.name,
        value: tag.id,
        tag: tag,
      })),
    [allTagsWithTagGroup],
  );

  const tagsOptionsSelected = React.useMemo(
    () =>
      selectedTags && tagListOptions
        ? tagListOptions.filter((tagOption) =>
            selectedTags.includes(tagOption.value),
          )
        : null,
    [selectedTags, tagListOptions],
  );

  const exclusiveTagsOptionsSelected = React.useMemo(
    () =>
      variant === 'exclusive' && selectedTagsByTagGroup && tagListOptions
        ? tagListOptions.filter((tagOption) =>
            Object.values(selectedTagsByTagGroup).includes(tagOption.value),
          )
        : null,
    [selectedTagsByTagGroup, tagListOptions, variant],
  );

  const tagGroupedByTagGroup = React.useMemo(() => {
    const tagGroupByGroup = [...(allTagsWithTagGroup ?? [])].reduce(
      (accumulator, tagItem) => {
        const temp = accumulator.findIndex(
          (group) => group.id === tagItem.group.id,
        );
        if (temp === -1) {
          accumulator.push({
            label: tagItem.group.name,
            id: tagItem.group.id,
            options: [
              {
                value: tagItem.id,
                label: tagItem.name,
                tag: tagItem,
              },
            ],
          });
        } else {
          accumulator[temp].options.push({
            value: tagItem.id,
            id: tagItem.group.id,
            label: tagItem.name,
            tag: tagItem,
          });
        }
        return accumulator;
      },
      [],
    );
    return tagGroupByGroup ?? [];
  }, [allTagsWithTagGroup]);

  const onChangeExclusive = React.useCallback(
    (selectedOptions: TagOption[]) => {
      if (!selectedOptions.length) {
        onChange(selectedOptions);
      } else {
        const addedTag = selectedOptions?.at(-1)?.tag;
        if (addedTag) {
          const groupId = addedTag.group.id;
          if (groupId in selectedTagsByTagGroup) {
            const tagIdToDelete = selectedTagsByTagGroup[groupId];
            onDeleteTag(tagIdToDelete);
            const updatedSelectedOptions = selectedOptions.filter(
              (option) => option.value !== tagIdToDelete,
            );
            onChange(updatedSelectedOptions);
          } else {
            onChange(selectedOptions);
          }
        }
      }
    },
    [onChange, selectedTagsByTagGroup, onDeleteTag],
  );

  const onDeleteExclusive = React.useCallback(
    (selectedTagId: number) => {
      onDeleteTag(selectedTagId);
    },
    [onDeleteTag],
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

  React.useEffect(() => {
    if (variant === 'exclusive') {
      !!allTagsWithTagGroup &&
        !!selectedTags &&
        setSelectedTagsByTagGroup(
          [...allTagsWithTagGroup]?.reduce<FranchiseUserTagDict>((acc, tag) => {
            if ([...selectedTags]?.includes(tag.id)) {
              acc[tag.group.id] = tag.id;
            }
            return acc;
          }, {}),
        );
    }
  }, [selectedTags, allTagsWithTagGroup, setSelectedTagsByTagGroup, variant]);

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
          isClearable={isClearable}
          isDisabled={isDisabled}
          isMulti={!noMulti}
          menuPlacement={menuPlacement}
          menuPortalTarget={divRef.current}
          onChange={variant === 'exclusive' ? onChangeExclusive : onChange}
          onDeleteTag={
            variant === 'exclusive' ? onDeleteExclusive : onDeleteTag
          }
          options={tagGroupedByTagGroup}
          placeholder={placeholder || t('select')}
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
          tagList={allTagsWithTagGroup ?? []}
          value={
            variant === 'exclusive'
              ? exclusiveTagsOptionsSelected
              : tagsOptionsSelected
          }
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
      }}
      id={id}
      isClearable={isClearable}
      isDisabled={isDisabled}
      isMulti={!noMulti}
      menuPlacement={menuPlacement}
      menuPortalTarget={document.querySelector('body')}
      onChange={variant === 'exclusive' ? onChangeExclusive : onChange}
      onDeleteTag={variant === 'exclusive' ? onDeleteExclusive : onDeleteTag}
      options={tagGroupedByTagGroup}
      placeholder={placeholder || t('select')}
      styles={tagGroupStyles}
      tagList={allTagsWithTagGroup ?? []}
      value={
        variant === 'exclusive'
          ? exclusiveTagsOptionsSelected
          : tagsOptionsSelected
      }
    />
  );
};

export default React.memo(TagSelector);
