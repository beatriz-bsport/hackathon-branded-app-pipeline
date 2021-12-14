import React, { useRef } from 'react';
import { compose } from 'recompose';
import Select, { components } from 'react-select';
import { withTranslation, WithTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { colors } from '@bsport/common/lib/colors';
import BlockIcon from '@material-ui/icons/Block';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { v4 as uuidv4 } from 'uuid';
import type { Tag, TagGroup } from '../types';
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
  groupHeading: (base) => ({
    ...base,
    margin: 0,
    color: '#868686',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    borderBottom: '1px solid #868686',
  }),
  control: (styles) => ({
    ...styles,
    backgroundColor: 'white',
    paddingTop: '4px',
    paddingBottom: '4px',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (
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
  multiValue: (styles) => {
    return {
      ...styles,
      backgroundColor: 'transparent',
    };
  },
  multiValueLabel: (styles) => ({
    ...styles,
    color: colors.secondary,
  }),
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
  <components.MultiValueContainer {...props}>
    {props?.data.tag && (
      <TagChip
        tag={props?.data.tag}
        onDelete={() => props?.selectProps?.onDeleteTag(props?.data.tag.id)}
        size="small"
      />
    )}
  </components.MultiValueContainer>
);

const SingleValue = ({ ...props }) => {
  return (
    <components.SingleValue {...props}>
      {props?.data.tag && (
        <TagChip
          tag={props?.data.tag}
          onDelete={() => props?.selectProps?.onDeleteTag(props?.data.tag.id)}
          size="small"
        />
      )}
    </components.SingleValue>
  );
};

const DropdownIndicator = (
  props: ReturnType<typeof components.DropdownIndicator>,
) => {
  return (
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
  }, []);
  return tagGroupByGroup;
};

type OwnProps = {
  onChange: (options: {
    label: string;
    value: number;
    tag: Tag<TagGroup>;
  }) => void;
  onDeleteTag: (optionId: number) => void;
  isDisabled: boolean;
  placeholder?: string;
  noMulti?: boolean;
  isClearable?: boolean;
  closeMenuOnSelect?: boolean;
  selectedTags?: Array<number>;
  allTagsWithTagGroup: Array<Tag>;
  inScrollBar: boolean;
};

type Props = WithTranslation & OwnProps;
export function TagSelector(props: Props) {
  const { t } = props;
  const {
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
  } = props;
  const uuid = useRef(uuidv4());
  const tagsOptionsSelected = selectedTags
    ? getTagListOptions(allTagsWithTagGroup).filter(
        (tagOption: { value: number; label: string }) =>
          selectedTags.includes(tagOption.value),
      )
    : null;
  if (inScrollBar) {
    return (
      <div id={`selector_${uuid.current}`} style={{ position: 'relative' }}>
        <Select
          closeMenuOnSelect={closeMenuOnSelect}
          options={getTagGroupedByTagGroup(
            allTagsWithTagGroup ? [...allTagsWithTagGroup] : [],
          )}
          onChange={onChange}
          value={tagsOptionsSelected}
          menuPortalTarget={document.querySelector(`#selector_${uuid.current}`)}
          isDisabled={isDisabled}
          components={{
            SingleValue,
            DropdownIndicator,
            MultiValueContainer,
          }}
          placeholder={placeholder || t('select')}
          isMulti={!noMulti}
          isClearable={isClearable}
          tagList={allTagsWithTagGroup}
          onDeleteTag={onDeleteTag}
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
        />
      </div>
    );
  }
  return (
    <Select
      closeMenuOnSelect={closeMenuOnSelect}
      options={getTagGroupedByTagGroup(
        allTagsWithTagGroup ? [...allTagsWithTagGroup] : [],
      )}
      onChange={onChange}
      value={tagsOptionsSelected}
      styles={tagGroupStyles}
      menuPortalTarget={document.querySelector('body')}
      isDisabled={isDisabled}
      components={{
        SingleValue,
        DropdownIndicator,
        MultiValueContainer,
      }}
      placeholder={placeholder || t('select')}
      isMulti={!noMulti}
      isClearable={isClearable}
      tagList={allTagsWithTagGroup}
      onDeleteTag={onDeleteTag}
    />
  );
}

export default compose<any, Props>(withTranslation('tag'))(TagSelector);
