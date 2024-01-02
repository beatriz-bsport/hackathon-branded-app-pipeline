import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WithStyles, makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { FormikProps, withFormik } from 'formik';
import type { Offer as OfferAPI } from 'src/api/types';
import { OptionCallback } from '../../../../state/types';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import PromptOnPageLeave from '#components/Prompt';

export type Props = {
  noDivider?: boolean;
  permissionType: 'activity' | 'workshop' | 'privateSlot';
  onSubmit: (values: FormValues, options?: OptionCallback<OfferAPI>) => void;
  initialValue: string;
  isLoading?: boolean;
  withPaper?: boolean;
};

interface FormValues {
  internalNote: string;
}

const InnerComponent: React.FC<
  Omit<Props, 'withPaper'> & FormikProps<FormValues> & WithStyles
> = ({
  permissionType,
  noDivider,
  handleSubmit,
  dirty,
  values,
  setFieldValue,
  resetForm,
  initialValue,
  isLoading,
  classes,
}) => {
  const { t } = useTranslation('offer');

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    resetForm({ values: { internalNote: initialValue } });
  }, [initialValue, resetForm]);

  // According to the meta-activity type, we adjust the required permissions.
  const editPermissions = {
    activity: 'session.activity.allowed_actions.editNotes',
    workshop: 'session.workshop.allowed_actions.editNotes',
    privateSlot: 'session.privateSlot.allowed_actions.editNotes',
  };
  const viewPermissions = {
    activity: 'session.activity.allowed_actions.viewNotes',
    workshop: 'session.workshop.allowed_actions.viewNotes',
    privateSlot: 'session.privateSlot.allowed_actions.viewNotes',
  };
  const requiredPermissions = [
    viewPermissions[permissionType] || '',
    editPermissions[permissionType] || '',
  ];

  const onClickOpen = useCallback(
    () => setIsOpen((previousValue) => !previousValue),
    [setIsOpen],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFieldValue('internalNote', event.target.value);
    },
    [setFieldValue],
  );

  return (
    requiredPermissions.every((permission) => !!permission) && (
      <ObjectLevelPermissionProvider requiredPermission={requiredPermissions}>
        {([canView, canEdit]: boolean[]) => {
          if (canView) {
            return (
              <form className={classes.root} onSubmit={handleSubmit}>
                <div className={classes.container}>
                  <ButtonBase
                    className={classes.titleSection}
                    onClick={onClickOpen}
                  >
                    <Typography variant="h6">{t('notePad.title')}</Typography>
                    {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </ButtonBase>
                  {!noDivider && <Divider />}
                  <Collapse in={isOpen}>
                    <div className={classes.contentSection}>
                      <TextareaAutosize
                        className={classes.textInput}
                        disabled={!canEdit}
                        onChange={handleChange}
                        placeholder={
                          isLoading
                            ? t('notePad.loading')
                            : t('notePad.placeholder')
                        }
                        value={isLoading ? '' : values.internalNote}
                      />
                      {canEdit && (
                        <Button color="primary" disabled={!dirty} type="submit">
                          {t('save', { context: 'common' })}
                        </Button>
                      )}
                    </div>
                  </Collapse>
                </div>
                <PromptOnPageLeave
                  openPromptOnPageLeave
                  description={t('notePad.modal.description')}
                  isDataClean={!dirty}
                  leaveWithoutSavingText={t('discard', { context: 'common' })}
                  leaveWithSavingText={t('save', { context: 'common' })}
                  onLeaveWithSaving={handleSubmit}
                  title={t('notePad.modal.title')}
                />
              </form>
            );
          }
          return null;
        }}
      </ObjectLevelPermissionProvider>
    )
  );
};

const WithPaperComponent: React.FC<Props & FormikProps<FormValues>> = ({
  withPaper,
  ...props
}) => {
  const classes = useStyles();

  if (withPaper) {
    return (
      <Paper className={classes.paper}>
        <InnerComponent classes={classes} {...props} />
      </Paper>
    );
  }
  return <InnerComponent classes={classes} {...props} />;
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
  },
  titleSection: {
    dislplay: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  contentSection: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
  },
  textInput: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderRadius: theme.spacing(0.5),
    border: '1px solid',
    borderColor: theme.palette.grey[400],
    fontFamily: 'Roboto',
    letterSpacing: '0.15px',
    lineHeight: '150%',
    marginBottom: theme.spacing(1.5),
    width: '100%',
    resize: 'none',
  },
  paper: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
}));

const SessionNotePad = withFormik<Props, FormValues>({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    return {
      internalNote: props.initialValue || '',
    };
  },
  handleSubmit: (values, { props: { onSubmit } }) => {
    onSubmit(values);
  },
})(WithPaperComponent);

export default React.memo(SessionNotePad);
