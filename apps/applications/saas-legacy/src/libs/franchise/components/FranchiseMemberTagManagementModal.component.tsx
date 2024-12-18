import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import CustomMuiDialog from '#src/components/genericDialog/CustomMuiDialog.component';
import TagTemplateSelector from '#src/libs/tag/components/TagTemplateSelector.component';
import Typography from '@material-ui/core/Typography';
import type {
  FranchiseUserTag,
  FranchiseUserTagDict,
} from '#src/libs/franchise/types';
import type { TagGroup, TagTemplate } from '#src/libs/tag/types';

type Props = {
  onSave: (selectedTagTemplateIds: number[]) => void;
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tagsByTagGroup: TagGroup[];
  tagTemplates: TagTemplate[];
  userTags: FranchiseUserTag[];
};

const FranchiseMemberTagManagementModal: React.FC<Props> = ({
  onSave,
  open,
  setOpen,
  tagsByTagGroup,
  tagTemplates,
  userTags,
}) => {
  const { t } = useTranslation('franchise');
  const classes = useStyles();

  const [selectedTagsByTagGroup, setSelectedTagsByTagGroup] =
    React.useState<FranchiseUserTagDict>({});

  const userTagsByTagGroup = React.useMemo(
    () =>
      userTags.reduce<FranchiseUserTagDict>((acc, tag) => {
        acc[tag.tag_group.tag_group_template] = tag.sub_tag.tag_template;
        return acc;
      }, {}),
    [userTags],
  );

  const isSaveButtonDisabled = React.useMemo(
    () => userTagsByTagGroup === selectedTagsByTagGroup,
    [selectedTagsByTagGroup, userTagsByTagGroup],
  );

  const onCancel = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleSave = React.useCallback(() => {
    setOpen(false);
    const selectedTagTemplateIds = Object.values(selectedTagsByTagGroup);
    onSave(selectedTagTemplateIds);
  }, [setOpen, onSave, selectedTagsByTagGroup]);

  const buttons = React.useMemo(
    () => [
      {
        variant: 'text',
        commonLabel: 'close',
        onClick: onCancel,
      },
      {
        variant: 'text',
        commonLabel: 'saveRecord',
        color: 'primary',
        onClick: handleSave,
        disabled: isSaveButtonDisabled,
      },
    ],
    [onCancel, handleSave, isSaveButtonDisabled],
  );

  React.useEffect(() => {
    if (open) setSelectedTagsByTagGroup(userTagsByTagGroup);
  }, [open, userTags, userTagsByTagGroup]);

  return (
    <CustomMuiDialog
      buttons={buttons}
      fullScreenBreakpoint="xs"
      open={open}
      title={t('userProfile.manageTags')}
    >
      <div>
        <Typography className={classes.text} variant="body1">
          {t('userProfile.tagModalText')}
        </Typography>
        <Typography className={classes.helper} variant="body1">
          {t('userProfile.tagModalHelperText')}
        </Typography>
        <TagTemplateSelector
          closeMenuOnSelect
          allTags={tagTemplates}
          allTagsGroupedByTagGroup={tagsByTagGroup}
          selectedTagsByTagGroup={selectedTagsByTagGroup}
          setSelectedTagsByTagGroup={setSelectedTagsByTagGroup}
        />
      </div>
    </CustomMuiDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  text: {
    marginBottom: theme.spacing(2),
  },
  helper: { marginBottom: theme.spacing(1) },
}));

export default React.memo(FranchiseMemberTagManagementModal);
