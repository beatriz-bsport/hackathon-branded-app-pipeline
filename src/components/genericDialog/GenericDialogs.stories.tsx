import React from 'react';
// --------------------------------------------------
// COMPONENTS TO VISUALIZE IN STORYBOOK
import GenericDialogWithIconHeader, {
  Props as GenericDialogWithIconHeaderProps,
} from './GenericDialogWithIconHeader.component';
import GenericDialogWithIconHeaderMUI, {
  Props as GenericDialogWithIconHeaderMUIProps,
} from './GenericDialogWithIconHeaderMUI.component';
import GenericDialog from './GenericDialog';
import GenericFormDialog from './GenericFormDialog';
import GenericMuiDialog from './GenericMuiDIalog';
import GenericResponsiveDialog from './GenericMuiDIalog';
import CustomMuiDialog from './CustomMuiDialog.component';
import GenericDialogWithCountdownConfirm, {
  Props as DelayedDialogProps,
} from './GenericDialogWithCountdownConfirm.component';
import GenericDeleteDialog, {
  Props as DeleteDialogProps,
} from './GenericDeleteDialog.component';
// --------------------------------------------------
import Typography from '@material-ui/core/Typography';
import TypographyMultiline from '#components/typo/TypographyMultiline.component';
import ValidationIcon from '#components/icons/ValidationIcon.component';
import Alert from '@material-ui/lab/Alert';
// @ts-ignore
import { faker } from '@faker-js/faker';
faker.locale = 'fr';

const fakeSentence = faker.hacker.phrase();

const GenericDialogWithIconHeaderTemplate = (
  args: GenericDialogWithIconHeaderProps,
) => <GenericDialogWithIconHeader {...args} />;
export const DialogWithIconHeader = GenericDialogWithIconHeaderTemplate.bind(
  {},
);
DialogWithIconHeader.args = {
  footerAlign: 'center',
  children: <Typography>{fakeSentence}</Typography>,
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
  withoutBottomActions: false,
};

const GenericDialogWithIconHeaderMUITemplate = (
  args: GenericDialogWithIconHeaderMUIProps,
) => (
  <GenericDialogWithIconHeaderMUI {...args}>
    <Typography>{fakeSentence}</Typography>
  </GenericDialogWithIconHeaderMUI>
);
export const DialogWithIconHeaderMUI =
  GenericDialogWithIconHeaderMUITemplate.bind({});
DialogWithIconHeaderMUI.args = {
  headerIcon: <ValidationIcon />,
  headerAlign: 'center',
  footerAlign: 'center',
  content: fakeSentence,
  contentAlign: 'center',
  headerTitle: 'Well done !',
  onCancelClick: () => {},
  onCancelText: 'Cancel',
  onCancelVariant: 'fail',
  onConfirmClick: () => {},
  onConfirmText: 'Confirm',
  onConfirmVariant: 'contained',
  open: true,
  withoutBottomActions: false,
};

const GenericDialogTemplate = (args: any) => <GenericDialog {...args} />;
export const Dialog = GenericDialogTemplate.bind({});
Dialog.args = {
  open: true,
  text: faker.lorem.words(4),
  title: fakeSentence,
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
  children: <Typography>{fakeSentence}</Typography>,
};

const GenericMuiDialogTemplate = (args: any) => <GenericMuiDialog {...args} />;
export const MuiDialog = GenericMuiDialogTemplate.bind({});
MuiDialog.args = {
  open: true,
  title: fakeSentence,
  content: fakeSentence,
  confirmText: 'Confirmer',
  cancelText: 'Annuler',
};

const GenericResponsiveDialogTemplate = (args: any) => (
  <GenericResponsiveDialog {...args}>
    <Typography>{fakeSentence}</Typography>,
  </GenericResponsiveDialog>
);
export const ResponsiveDialog = GenericResponsiveDialogTemplate.bind({});
ResponsiveDialog.args = {
  open: true,
  confirmText: 'Confirmer',
  cancelText: 'Annuler',
};

const CustomMuiDialogTemplate = (args: any) => (
  <CustomMuiDialog {...args}>
    <TypographyMultiline>
      {Array(25)
        .fill(0)
        .reduce((accu, next) => accu + `\n${fakeSentence}`, '')}
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
    <Typography>{fakeSentence}</Typography>
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

const GenericDialogWithCountdownConfirmTemplate = (
  args: DelayedDialogProps,
) => <GenericDialogWithCountdownConfirm {...args} />;
export const CountdownDialog = GenericDialogWithCountdownConfirmTemplate.bind(
  {},
);
CountdownDialog.args = {
  open: true,
  title: 'Basic delayed dialog',
  validateLabel: 'Boom',
  content: 'I am the content of the delayed dialog',
};

export default {
  title: 'Components/Dialogs&Drawers',
  parameters: {
    docs: {
      page: null,
    },
  },
};
