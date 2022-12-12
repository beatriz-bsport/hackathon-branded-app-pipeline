import React from 'react'
import TagSelector, { Props as SelectorProps } from './TagSelector.selector';
import type {Tag, TagGroup} from '#libs/tag/types'
import FactoryBot from '../factory';



export const TagSelectorTemplate = (args: SelectorProps) => {
  const [selectedTags, setSelectedTags] = React.useState([])
  const onChange = (options: Array<{
    label: string;
    value: number;
    tag: Tag<TagGroup>;
  }>) => {
    setSelectedTags(options.map((item)=>item.value))
  }
  const onDeleteTag = (id:number) => {
    setSelectedTags(selectedTags.filter((tagId)=>tagId!==id))
  }
  return <TagSelector
    {...args}
    inScrollBar
    selectedTags={selectedTags}
    onChange={onChange}
    onDeleteTag={onDeleteTag}
  />;
}

export const TagSelectorState = TagSelectorTemplate.bind({})
  
TagSelectorState.args = {
  isDisabled: false,
  allTagsWithTagGroup: FactoryBot.Tag.create(5),
}
  
export default {
  title: 'Library/TagTSX/selectorTSX',
  component: TagSelector,
  parameters: {
    docs: {
      page:null
    }
  }
}
