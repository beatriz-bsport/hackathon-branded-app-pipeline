import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import FileUploaderCustomized, { Props } from '../FileUploaderCustomized';
import { action } from '@storybook/addon-actions';
import { CSSProperties, makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

const actionsData = {
  onChange: action('onChange'),
  onAddFile: action('onAddFile'),
  onRemoveFile: action('onRemoveFile'),
};

const fakeCsvFile = new File(['hola\nbonjour\nhello\nkonnichiwa'], 'test.csv', {
  type: 'text/csv',
});

const fakeError = "The file doesn't have correct data.";

const customStyle: CSSProperties = {
  flex: 1,
  color: 'black',
  height: '127px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '16px',
  borderWidth: 2,
  borderRadius: 5,
  border: 'none',
  backgroundColor: '#F8F8F8',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const promoCodeCustomStyle: CSSProperties = {
  height: '127px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '16px',
  borderWidth: 2,
  borderRadius: 5,
  border: 'none',
  backgroundColor: '#F8F8F8',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

export default {
  title: 'Components/Input/FileUploaderCustomized',
  component: FileUploaderCustomized,
  argTypes: {
    backgroundColor: { control: 'color' },
    onChange: actionsData.onChange,
    onAddFile: actionsData.onAddFile,
    onRemoveFile: actionsData.onRemoveFile,
  },
} as ComponentMeta<typeof FileUploaderCustomized>;

const Template: ComponentStory<typeof FileUploaderCustomized> = (
  args: Props,
) => <FileUploaderCustomized {...args} />;

export const Base = Template.bind({});
Base.args = {
  label: 'Basic',
};

export const WithFile = Template.bind({});
WithFile.args = {
  label: 'With File',
  file: fakeCsvFile,
};

export const WithCustomStyle = Template.bind({});
WithCustomStyle.args = {
  label: 'With Custom Style',
  customStyle: customStyle,
  subtitle: 'Hola, this is a subtitle',
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  label: 'With full width',
  customStyle: customStyle,
  subtitle: 'Hola, this is a subtitle',
  isFullWidth: true,
};

export const WithHelperText = Template.bind({});
WithHelperText.args = {
  label: 'With helper text',
  helperText: 'This is a custom helper text passed in props',
};

const CustomClassesTemplate: ComponentStory<typeof FileUploaderCustomized> = (
  args: Props,
) => {
  const useStyles = makeStyles((theme: Theme) => ({
    title: {
      color: theme.palette.text.primary,
    },
    folderIcon: {
      color: 'inherit',
    },
  }));

  const customClasses = useStyles();

  return <FileUploaderCustomized {...args} customClasses={customClasses} />;
};

export const WithCustomClasses = CustomClassesTemplate.bind({});
WithCustomClasses.args = {
  label: 'Drag and drop or click to select file',
  subtitle: 'CSV file (1MO max)',
};

export const PromoCodeStyle = CustomClassesTemplate.bind({});
PromoCodeStyle.args = {
  label: 'Drag and drop or click to select file',
  customStyle: promoCodeCustomStyle,
  isFullWidth: true,
  subtitle: 'CSV file (1MO max)',
  helperText:
    'Upload a CSV file with all voucher codes in the first column, one code per row, no heading',
};

export const PromoCodeStyleWithError = CustomClassesTemplate.bind({});
PromoCodeStyleWithError.args = {
  label: 'Drag and drop or click to select file',
  customStyle: promoCodeCustomStyle,
  isFullWidth: true,
  subtitle: 'CSV file (1MO max)',
  helperText:
    'Upload a CSV file with all voucher codes in the first column, one code per row, no heading',
  error: fakeError,
};
