import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import LabelIcon from '@material-ui/icons/Label';
import LabelOffIcon from '@material-ui/icons/LabelOff';

import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
// @ts-ignore

import PaginatedListBase from '../../../components/PaginatedListBase.component';
import { MaterialStyleType } from '../../../utils/types';
import { Member } from '../../member/types';

type OwnProps = {
  membersWithTagList: Member[];
  membersWithTagListLoading: boolean;
  membersWithTagListCount: number;
  membersWithTagListPage: number | null;

  membersWithoutTagList: Member[];
  membersWithoutTagListLoading: boolean;
  membersWithoutTagListCount: number;
  membersWithoutTagListPage: number | null;

  onPageRequestWithTag: (page: number, pageSize: number) => void;
  onPageRequestWithoutTag: (page: number, pageSize: number) => void;

  onClickTagMember: (member: Member) => void;
  onClickUntagMember: (member: Member) => void;

  onClickMember: (id: number) => void;

  untagAll: () => void;
  tagAll: () => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const TagDetailMembers = (props: Props) => {
  const { classes, t } = props;
  const [processing, setProcessing] = React.useState(false);

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Typography variant="h5">
          {t('management.memberDetail.memberWithTag')}
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          disabled={processing}
          onClick={() => {
            setProcessing(true);
            props.untagAll({
              onSuccess: () => setProcessing(false),
              onError: () => setProcessing(false),
            });
          }}
        >
          <LabelOffIcon className={classes.leftIcon} />
          {t('management.memberDetail.removeTagFromAll')}
        </Button>
      </div>

      <Paper className={classes.listContainer}>
        <PaginatedListBase
          page={props.membersWithTagListPage}
          nbItems={props.membersWithTagListCount}
          itemPerPage={props.itemPerPage}
          loading={props.membersWithTagListLoading || processing}
          onPageRequested={props.onPageRequestWithTag}
          items={props.membersWithTagList}
          renderItem={(item: Member) => {
            return (
              <ListItem
                divider
                key={item.id}
                dense
                disabled={props.membersWithTagListLoading || processing}
                button={!!props.onClickMember}
                onClick={
                  props.onClickMember
                    ? () => props.onClickMember(item.id)
                    : null
                }
              >
                <div className={classes.listItemInfo}>
                  <Avatar alt={item.name} src={item.photo} />
                  <Typography className={classes.name}>{item.name}</Typography>
                </div>
                <ListItemSecondaryAction>
                  <Button
                    color="primary"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      props.onClickUntagMember(item);
                    }}
                  >
                    <LabelOffIcon className={classes.leftIcon} />
                    {t('management.memberDetail.removeTag')}
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            );
          }}
          listProps={{ dense: true }}
        />
      </Paper>
      <div className={classes.divider} />

      <div className={classes.row}>
        <Typography variant="h5">
          {t('management.memberDetail.memberWithoutTag')}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          disabled={processing}
          onClick={() => {
            setProcessing(true);
            props.tagAll({
              onSuccess: () => setProcessing(false),
              onError: () => setProcessing(false),
            });
          }}
        >
          <LabelIcon className={classes.leftIcon} />
          {t('management.memberDetail.addTagToAll')}
        </Button>
      </div>

      <Paper className={classes.listContainer}>
        <PaginatedListBase
          page={props.membersWithoutTagListPage}
          nbItems={props.membersWithoutTagListCount}
          itemPerPage={props.itemPerPage}
          loading={props.membersWithoutTagListLoading || processing}
          onPageRequested={props.onPageRequestWithoutTag}
          items={props.membersWithoutTagList}
          renderItem={(item: Member) => {
            return (
              <ListItem
                divider
                key={item.id}
                dense
                disabled={props.membersWithoutTagListLoading || processing}
                button={!!props.onClickMember}
                onClick={
                  props.onClickMember
                    ? () => props.onClickMember(item.id)
                    : null
                }
              >
                <div className={classes.listItemInfo}>
                  <Avatar alt={item.name} src={item.photo} />
                  <Typography className={classes.name}>{item.name}</Typography>
                </div>
                <ListItemSecondaryAction>
                  <Button
                    color="primary"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      props.onClickTagMember(item);
                    }}
                  >
                    <LabelIcon className={classes.leftIcon} />
                    {t('management.memberDetail.addTag')}
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            );
          }}
          listProps={{ dense: true }}
        />
      </Paper>
    </div>
  );
};

const styles = (theme: Theme) => ({
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
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['tag']),
)(TagDetailMembers);
