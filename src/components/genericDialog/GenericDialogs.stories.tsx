import React from 'react';
// --------------------------------------------------
// COMPONENTS TO VISUALIZE IN STORYBOOK
import GenericDialogWithIconHeader, {
  Props,
} from './GenericDialogWithIconHeader.component';
import GenericDialog from './GenericDialog';
import GenericFormDialog from './GenericFormDialog';
import GenericMuiDialog from './GenericMuiDIalog';
import GenericResponsiveDialog from './GenericMuiDIalog';
import CustomMuiDialog from './CustomMuiDialog.component';
import GenericDeleteDialog, {
  Props as DeleteDialogProps,
} from './GenericDeleteDialog.component';
// --------------------------------------------------
import Typography from '@material-ui/core/Typography';
import TypographyMultiline from '#components/typo/TypographyMultiline.component';
import ValidationIcon from '#components/icons/ValidationIcon.component';
import Alert from '@material-ui/lab/Alert';
// @ts-ignore
import faker from 'faker';
faker.locale = 'fr';

const GenericDialogWithIconHeaderTemplate = (args: Props) => (
  <GenericDialogWithIconHeader {...args} />
);
export const DialogWithIconHeader = GenericDialogWithIconHeaderTemplate.bind(
  {},
);
DialogWithIconHeader.args = {
  bottomAlign: 'center',
  children: <Typography>{faker.hacker.phrase()}</Typography>,
  headerAlign: 'center',
  headerIcon: <ValidationIcon />,
  headerTitle: 'Well done !',
  onCancelClick: () => {},
  onCancelText: 'Cancel',
  onCancelVariant: 'fail',
  onConfirmClick: () => {},
  onConfirmText: 'Confirm',
  onConfirmVariant: 'contained',
  open: true,
  withoutBottomAction: false,
};

const GenericDialogTemplate = (args: any) => <GenericDialog {...args} />;
export const Dialog = GenericDialogTemplate.bind({});
Dialog.args = {
  open: true,
  text: faker.lorem.words(4),
  title: faker.hacker.phrase(),
  buttons: [
    { label: 'Button 1', color: 'primary', variant: 'contained' },
    { label: 'Button 2', color: 'secondary', variant: 'outlined' },
    { label: 'Button 3', color: 'inherit', variant: 'text' },
  ],
};

const GenericFormDialogTemplate = (args: any) => (
  <GenericFormDialog {...args} />
);
export const FormDialog = GenericFormDialogTemplate.bind({});
FormDialog.args = {
  open: true,
  children: <Typography>{faker.hacker.phrase()}</Typography>,
};

const GenericMuiDialogTemplate = (args: any) => <GenericMuiDialog {...args} />;
export const MuiDialog = GenericMuiDialogTemplate.bind({});
MuiDialog.args = {
  open: true,
  title: faker.hacker.phrase(),
  content: faker.hacker.phrase(),
  confirmText: 'Confirmer',
  cancelText: 'Annuler',
};

const GenericResponsiveDialogTemplate = (args: any) => (
  <GenericResponsiveDialog {...args}>
    <Typography>{faker.hacker.phrase()}</Typography>,
  </GenericResponsiveDialog>
);
export const ResponsiveDialog = GenericResponsiveDialogTemplate.bind({});
ResponsiveDialog.args = {
  open: true,
};

const CustomMuiDialogTemplate = (args: any) => (
  <CustomMuiDialog {...args}>
    <TypographyMultiline>
      {Array(25)
        .fill(0)
        .reduce((accu, next) => accu + `\n${faker.hacker.phrase()}`, '')}
    </TypographyMultiline>
  </CustomMuiDialog>
);
export const CustomableMuiDialog = CustomMuiDialogTemplate.bind({});
CustomableMuiDialog.args = {
  open: true,
  title: faker.lorem.words(5),
  content: 'This is a text pass in props',
  contentAlign: 'center',
  buttons: [
    {
      label: 'With alert timer',
      color: 'primary',
      variant: 'outlined',
      onClick: () => {},
      delayBeforeActivation: 3,
    },
    {
      commonLabel: 'cancel',
      variant: 'text',
      color: 'default',
      onClick: () => {},
    },
    {
      commonLabel: 'confirm',
      variant: 'contained',
      color: 'primary',
      onClick: () => {},
    },
  ],
};

const GenericDeleteDialogTemplate = (args: DeleteDialogProps) => (
  <GenericDeleteDialog {...args}>
    <Typography>{faker.hacker.phrase()}</Typography>
    <Alert severity="info">Hello I am a children</Alert>
  </GenericDeleteDialog>
);
export const DeleteDialog = GenericDeleteDialogTemplate.bind({});
DeleteDialog.args = {
  open: true,
  title: 'Basic delete dialog',
  cancelLabel: 'Cancel !',
  validateLabel: 'Boom',
  content: 'I am the content of the delete dialog',
};

export default {
  title: 'Components/Dialogs&Drawers',
  parameters: {
    docs: {
      page: null,
    },
  },
};
