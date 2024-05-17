import React, { useRef } from 'react';
import { compose } from 'recompose';

import Select, { components } from 'react-select';
import { withTranslation, WithTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { colors } from '@bsport/common/lib/colors';
import BlockIcon from '@material-ui/icons/Block';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { v4 as uuidv4 } from 'uuid';
import type { Tag, TagGroup, TagGroupAPI } from '../types';
import TagChip from './TagChip.component';

const getBackgroundColor = (
  isDisabled: boolean,
  isSelected: boolean,
  isFocused: boolean,
) => {
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
};

const getColor = (
  isDisabled: boolean,
  isSelected: boolean,
  isFocused: boolean,
) => {
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
};

const tagGroupStyles = {
  // @ts-expect-error
  groupHeading: (base) => ({
    ...base,
    margin: 0,
    color: '#868686',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    borderBottom: '1px solid #868686',
  }),
  // @ts-expect-error
  control: (styles) => ({
    ...styles,
    backgroundColor: 'white',
    paddingTop: '4px',
    paddingBottom: '4px',
    zIndex: 1,
  }),
  // @ts-expect-error
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (
    // @ts-expect-error
    styles,
    {
      isDisabled,
      isFocused,
      isSelected,
    }: { isDisabled: boolean; isFocused: boolean; isSelected: boolean },
  ) => {
    const color = chroma(colors.secondary);

    return {
      ...styles,
      backgroundColor: getBackgroundColor(isDisabled, isFocused, isSelected),
      color: getColor(isDisabled, isFocused, isSelected),
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor:
          !isDisabled &&
          (isSelected ? colors.secondary : color.alpha(0.3).css()),
      },
    };
  },
  // @ts-expect-error
  multiValue: (styles) => {
    return {
      ...styles,
      backgroundColor: 'transparent',
    };
  },
  // @ts-expect-error
  multiValueLabel: (styles) => ({
    ...styles,
    color: colors.secondary,
  }),
  // @ts-expect-error
  multiValueRemove: (styles) => ({
    ...styles,
    color: colors.secondary,
    ':hover': {
      backgroundColor: colors.secondary,
      color: 'white',
    },
  }),
};

const MultiValueContainer = ({ ...props }) => (
  /* eslint-disable */
  <components.MultiValueContainer {...props}>
    <div
      onMouseDown={() => props?.selectProps?.onDeleteTag(props?.data.tag.id)}
      /* eslint-enable */
    >
      {props?.data.tag && (
        <TagChip
          deleteOnClick
          onDelete={() => props?.selectProps?.onDeleteTag(props?.data.tag.id)}
          size="small"
          tag={props?.data.tag}
        />
      )}
    </div>
  </components.MultiValueContainer>
);
const MultiValue = ({ ...props }) => {
  // @ts-expect-error
  return <components.MultiValue {...props} />;
};
const SingleValue = ({ ...props }) => {
  return (
    // @ts-expect-error
    <components.SingleValue {...props}>
      {props?.data.tag && (
        <TagChip
          onDelete={() => props?.selectProps?.onDeleteTag(props?.data.tag.id)}
          size="small"
          tag={props?.data.tag}
        />
      )}
    </components.SingleValue>
  );
};

const DropdownIndicator = ({ ...props }) => {
  return (
    // @ts-expect-error
    <components.DropdownIndicator {...props}>
      {props.selectProps.isDisabled ? (
        <BlockIcon fontSize="small" />
      ) : (
        <ExpandMoreIcon fontSize="small" />
      )}
    </components.DropdownIndicator>
  );
};

const getTagListOptions = (tags: Array<Tag>) =>
  tags?.map((t) => ({ label: t.name, value: t.id, tag: t }));

const getTagGroupedByTagGroup = (tag_list: Array<Tag>) => {
  const tagGroupByGroup = tag_list?.reduce((accumulator, tagItem) => {
    const temp = accumulator.findIndex(
      // @ts-expect-error
      (group) => group.id === tagItem.group.id,
    );
    if (temp === -1) {
      accumulator.push({
        // @ts-expect-error
        label: tagItem.group.name,
        // @ts-expect-error
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
        // @ts-expect-error
        id: tagItem.group.id,
        label: tagItem.name,
        tag: tagItem,
      });
    }
    return accumulator;
  }, []);
  return tagGroupByGroup;
};

type OwnProps = {
  onChange: (
    options: Array<{
      label: string;
      value: number;
      tag: Tag<TagGroup>;
    }>,
  ) => void;
  onDeleteTag: (optionId: number) => void;
  id?: string;
  isDisabled?: boolean;
  placeholder?: string;
  noMulti?: boolean;
  isClearable?: boolean;
  closeMenuOnSelect?: boolean;
  selectedTags?: number[];
  allTagsWithTagGroup:
    | Array<Tag>
    | Array<Tag<TagGroup>>
    | Array<Tag<TagGroupAPI>>;
  inScrollBar: boolean;
  menuPlacement?: 'auto' | 'top';
  noSpaceBelow?: boolean;
};

export type Props = Partial<WithTranslation> & OwnProps;
export function TagSelector(props: Props) {
  const {
    t,
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
  } = props;
  const uuid = useRef(uuidv4());
  const tagsOptionsSelected =
    selectedTags && allTagsWithTagGroup
      ? // @ts-expect-error
        getTagListOptions(allTagsWithTagGroup).filter(
          (tagOption: { value: number; label: string }) =>
            selectedTags.includes(tagOption.value),
        )
      : null;
  if (inScrollBar) {
    return (
      <div
        id={`selector_${uuid.current}`}
        style={{ position: 'relative', width: '100%' }}
      >
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
          menuPortalTarget={document.getElementById(`selector_${uuid.current}`)}
          onChange={onChange}
          onDeleteTag={onDeleteTag}
          options={getTagGroupedByTagGroup(
            // @ts-expect-error
            allTagsWithTagGroup ? [...allTagsWithTagGroup] : [],
          )}
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
          tagList={allTagsWithTagGroup}
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
      }}
      id={id}
      isClearable={isClearable}
      isDisabled={isDisabled}
      isMulti={!noMulti}
      menuPlacement={menuPlacement}
      menuPortalTarget={document.querySelector('body')}
      onChange={onChange}
      onDeleteTag={onDeleteTag}
      options={getTagGroupedByTagGroup(
        // @ts-expect-error
        allTagsWithTagGroup ? [...allTagsWithTagGroup] : [],
      )}
      placeholder={placeholder || t('select')}
      styles={tagGroupStyles}
      tagList={allTagsWithTagGroup}
      value={tagsOptionsSelected}
    />
  );
}

export default compose<any, Props>(withTranslation('tag'))(TagSelector);
