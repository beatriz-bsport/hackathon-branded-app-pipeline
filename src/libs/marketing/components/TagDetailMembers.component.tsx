import React from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import LabelIcon from '@material-ui/icons/Label';
import LabelOffIcon from '@material-ui/icons/LabelOff';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// @ts-expect-error
import PaginatedListBase from '#components/PaginatedListBase.component';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

import type { Member } from '#libs/member/types';
import type { OptionCallback } from '../../../state/types';

type MemberTagListItemProps = {
  member: Member;
  loading: boolean;
  buttonLabel: string;
  isTagAction?: boolean;
  onClickMember: (id: number) => void;
  onClickAction: (member: Member) => void;
};

const MemberTagListItem: React.FC<MemberTagListItemProps> = React.memo(
  ({
    member,
    loading,
    buttonLabel,
    isTagAction,
    onClickMember,
    onClickAction,
  }) => {
    const classes = useStyles();

    const handleClickMember = React.useCallback(
      () => member?.id && onClickMember?.(member.id),
      [member, onClickMember],
    );

    const handleClickAction = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        onClickAction(member);
      },
      [member, onClickAction],
    );

    return (
      <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
        {(hasMemberProfileAccessPermission: boolean) => (
          <ListItem
            key={member.id}
            dense
            divider
            button={
              !!onClickMember && (hasMemberProfileAccessPermission as any)
            }
            disabled={loading}
            onClick={
              hasMemberProfileAccessPermission ? handleClickMember : null
            }
          >
            <div className={classes.listItemInfo}>
              <Avatar alt={member.name} src={member.photo} />
              <Typography className={classes.name}>{member.name}</Typography>
            </div>
            <ListItemSecondaryAction>
              <Button color="primary" onClick={handleClickAction}>
                {isTagAction ? (
                  <LabelIcon className={classes.leftIcon} />
                ) : (
                  <LabelOffIcon className={classes.leftIcon} />
                )}
                {buttonLabel}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </ObjectLevelPermissionProvider>
    );
  },
);

type Props = {
  membersWithTagList: Member[];
  membersWithTagListLoading: boolean;
  membersWithTagListCount: number;
  membersWithTagListPage: number | null;

  membersWithoutTagList: Member[];
  membersWithoutTagListLoading: boolean;
  membersWithoutTagListCount: number;
  membersWithoutTagListPage: number | null;

  itemPerPage: number;

  onPageRequestWithTag: (page: number, pageSize: number) => void;
  onPageRequestWithoutTag: (page: number, pageSize: number) => void;
  onClickTagMember: (member: Member) => void;
  onClickUntagMember: (member: Member) => void;
  onClickMember: (id: number) => void;
  untagAll: (options?: OptionCallback) => void;
  tagAll: (options?: OptionCallback) => void;
};

const TagDetailMembers: React.FC<Props> = ({
  membersWithTagList,
  membersWithTagListLoading,
  membersWithTagListCount,
  membersWithTagListPage,
  membersWithoutTagList,
  membersWithoutTagListLoading,
  membersWithoutTagListCount,
  membersWithoutTagListPage,
  itemPerPage,
  onPageRequestWithTag,
  onPageRequestWithoutTag,
  onClickTagMember,
  onClickUntagMember,
  onClickMember,
  untagAll,
  tagAll,
}) => {
  const { t } = useTranslation('tag');
  const classes = useStyles();

  const [processing, setProcessing] = React.useState(false);

  const handleTagAll = React.useCallback(() => {
    setProcessing(true);
    tagAll({
      onSuccess: () => setProcessing(false),
      onError: () => setProcessing(false),
    });
  }, [tagAll]);

  const handleUntagAll = React.useCallback(() => {
    setProcessing(true);
    untagAll({
      onSuccess: () => setProcessing(false),
      onError: () => setProcessing(false),
    });
  }, [untagAll]);

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Typography variant="h5">
          {t('management.memberDetail.memberWithTag')}
        </Typography>

        <Button
          color="primary"
          disabled={processing}
          onClick={handleUntagAll}
          variant="outlined"
        >
          <LabelOffIcon className={classes.leftIcon} />
          {t('management.memberDetail.removeTagFromAll')}
        </Button>
      </div>

      <Paper className={classes.listContainer}>
        <PaginatedListBase
          itemPerPage={itemPerPage}
          items={membersWithTagList}
          listProps={{ dense: true }}
          loading={membersWithTagListLoading || processing}
          nbItems={membersWithTagListCount}
          onPageRequested={onPageRequestWithTag}
          page={membersWithTagListPage}
          renderItem={(member: Member) => (
            <MemberTagListItem
              buttonLabel={t('management.memberDetail.removeTag')}
              loading={membersWithTagListLoading || processing}
              member={member}
              onClickAction={onClickUntagMember}
              onClickMember={onClickMember}
            />
          )}
        />
      </Paper>
      <div className={classes.divider} />

      <div className={classes.row}>
        <Typography variant="h5">
          {t('management.memberDetail.memberWithoutTag')}
        </Typography>
        <Button
          color="primary"
          disabled={processing}
          onClick={handleTagAll}
          variant="outlined"
        >
          <LabelIcon className={classes.leftIcon} />
          {t('management.memberDetail.addTagToAll')}
        </Button>
      </div>

      <Paper className={classes.listContainer}>
        <PaginatedListBase
          itemPerPage={itemPerPage}
          items={membersWithoutTagList}
          listProps={{ dense: true }}
          loading={membersWithoutTagListLoading || processing}
          nbItems={membersWithoutTagListCount}
          onPageRequested={onPageRequestWithoutTag}
          page={membersWithoutTagListPage}
          renderItem={(member: Member) => (
            <MemberTagListItem
              isTagAction
              buttonLabel={t('management.memberDetail.addTag')}
              loading={membersWithoutTagListLoading || processing}
              member={member}
              onClickAction={onClickTagMember}
              onClickMember={onClickMember}
            />
          )}
        />
      </Paper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  divider: {
    height: 64,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  listContainer: {
    marginTop: theme.spacing(2),
  },
  listItemInfo: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    marginLeft: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default React.memo(TagDetailMembers);
